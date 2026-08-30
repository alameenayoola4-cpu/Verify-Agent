"""
VerifyAgent Orchestrator — The main agent loop.

Coordinates the full verification pipeline:
  Phase 1: Understand the code and spec
  Phase 2: Generate adversarial test cases
  Phase 3: Execute tests in sandbox
  Phase 4: Diagnose failures
  Phase 5: Fix and re-verify (retry loop)
  Phase 6: Generate final report
"""

import json
import time
from pathlib import Path
from dataclasses import dataclass, asdict, field

from src.llm.gemini_client import GeminiClient
from src.sandbox.runner import SandboxRunner, ExecutionResult
from src.agent.test_generator import generate_test_cases
from src.agent.diagnoser import diagnose_failures
from src.agent.fixer import generate_fix


@dataclass
class VerificationReport:
    """Final report from VerifyAgent for a single code file."""
    case_id: str
    spec_summary: str
    total_tests: int
    tests_passed: int
    tests_failed: int
    bugs_found: list[dict]
    bug_count: int
    severity_breakdown: dict
    fix_applied: bool
    fix_improved: bool
    post_fix_passed: int
    post_fix_failed: int
    test_results: list[dict]
    post_fix_test_results: list[dict]
    fixed_code: str | None
    original_code: str
    total_time_seconds: float
    trajectory: list[dict] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


class VerifyAgentOrchestrator:
    """Main orchestrator for the VerifyAgent pipeline."""

    def __init__(self, max_fix_attempts: int = 3):
        self.llm = GeminiClient()
        self.sandbox = SandboxRunner(timeout=10)
        self.max_fix_attempts = max_fix_attempts

    def verify(
        self,
        case_id: str,
        code: str,
        spec: str,
    ) -> VerificationReport:
        """
        Run the full verification pipeline on a single code file.

        Args:
            case_id: Identifier for this evaluation case
            code: The AI-generated Python code to verify
            spec: Natural language specification of what the code should do

        Returns:
            VerificationReport with all findings
        """
        start_time = time.time()
        self.llm.reset_trajectory()

        print(f"\n{'='*60}")
        print(f"  VERIFYAGENT — Case: {case_id}")
        print(f"{'='*60}")

        # ── Phase 1: Understand ──────────────────────────────────
        print("\n[Phase 1] Understanding code and specification...")

        # ── Phase 2: Generate test cases ─────────────────────────
        print("[Phase 2] Generating adversarial test cases...")
        test_cases = generate_test_cases(
            llm=self.llm,
            code=code,
            spec=spec,
            num_tests=12,
        )
        print(f"  -> Generated {len(test_cases)} test cases")

        # ── Phase 3: Execute tests ───────────────────────────────
        print("[Phase 3] Executing tests in sandbox...")
        results = self.sandbox.run_all_tests(
            code=code,
            test_cases=test_cases,
        )

        passed = sum(1 for r in results if r.passed)
        failed = sum(1 for r in results if not r.passed)
        print(f"  -> Results: {passed} passed, {failed} failed")

        for r in results:
            status = "[PASS]" if r.passed else "[FAIL]"
            print(f"    {status} {r.test_name}: {r.actual_output[:80]}")

        # ── Phase 4: Diagnose ────────────────────────────────────
        print("[Phase 4] Diagnosing failures...")
        test_results_dicts = [r.to_dict() for r in results]
        diagnoses = []

        if failed > 0:
            diagnoses = diagnose_failures(
                llm=self.llm,
                code=code,
                spec=spec,
                test_results=test_results_dicts,
            )
            print(f"  -> Found {len(diagnoses)} distinct bugs:")
            for d in diagnoses:
                print(f"    [BUG] [{d.get('severity', '?').upper()}] {d.get('root_cause', 'Unknown')[:80]}")
        else:
            print("  -> No bugs found. Code passed all generated tests.")

        # ── Phase 5: Fix & Re-verify ─────────────────────────────
        fixed_code = None
        fix_applied = False
        fix_improved = False
        post_fix_results = []

        if diagnoses:
            print("[Phase 5] Generating fix and re-verifying...")
            current_code = code

            for attempt in range(1, self.max_fix_attempts + 1):
                print(f"  -> Fix attempt {attempt}/{self.max_fix_attempts}...")
                candidate_fix = generate_fix(
                    llm=self.llm,
                    code=current_code,
                    spec=spec,
                    diagnoses=diagnoses,
                )

                # Re-run all tests on the fixed code
                post_results = self.sandbox.run_all_tests(
                    code=candidate_fix,
                    test_cases=test_cases,
                )

                post_passed = sum(1 for r in post_results if r.passed)
                post_failed = sum(1 for r in post_results if not r.passed)
                print(f"    Results: {post_passed} passed, {post_failed} failed")

                if post_passed > passed:
                    fixed_code = candidate_fix
                    fix_applied = True
                    fix_improved = True
                    post_fix_results = post_results

                    if post_failed == 0:
                        print(f"    [OK] All tests passing after fix attempt {attempt}!")
                        break

                    # Re-diagnose remaining failures for next attempt
                    post_results_dicts = [r.to_dict() for r in post_results]
                    diagnoses = diagnose_failures(
                        llm=self.llm,
                        code=candidate_fix,
                        spec=spec,
                        test_results=post_results_dicts,
                    )
                    current_code = candidate_fix
                    passed = post_passed
                else:
                    print(f"    [WARN]  Fix attempt {attempt} did not improve results")
                    if not fixed_code:
                        post_fix_results = post_results

        # ── Phase 6: Report ──────────────────────────────────────
        print("[Phase 6] Generating report...")

        severity_breakdown = {}
        for d in diagnoses:
            sev = d.get("severity", "unknown")
            severity_breakdown[sev] = severity_breakdown.get(sev, 0) + 1

        elapsed = time.time() - start_time

        post_passed = sum(1 for r in post_fix_results if r.passed) if post_fix_results else 0
        post_failed = sum(1 for r in post_fix_results if not r.passed) if post_fix_results else 0

        report = VerificationReport(
            case_id=case_id,
            spec_summary=spec[:200],
            total_tests=len(results),
            tests_passed=sum(1 for r in results if r.passed),
            tests_failed=sum(1 for r in results if not r.passed),
            bugs_found=diagnoses,
            bug_count=len(diagnoses),
            severity_breakdown=severity_breakdown,
            fix_applied=fix_applied,
            fix_improved=fix_improved,
            post_fix_passed=post_passed,
            post_fix_failed=post_failed,
            test_results=test_results_dicts,
            post_fix_test_results=[r.to_dict() for r in post_fix_results],
            fixed_code=fixed_code,
            original_code=code,
            total_time_seconds=round(elapsed, 2),
            trajectory=self.llm.trajectory,
        )

        print(f"\n{'─'*60}")
        print(f"  SUMMARY — {case_id}")
        print(f"  Tests: {report.tests_passed}/{report.total_tests} passed")
        print(f"  Bugs found: {report.bug_count}")
        print(f"  Severity: {severity_breakdown}")
        if fix_applied:
            print(f"  After fix: {post_passed}/{report.total_tests} passed")
        print(f"  Time: {report.total_time_seconds}s")
        print(f"{'─'*60}\n")

        return report

    def save_report(self, report: VerificationReport, output_dir: Path) -> None:
        """Save a verification report and its trajectory to disk."""
        output_dir.mkdir(parents=True, exist_ok=True)

        # Save full report
        report_path = output_dir / f"{report.case_id}_report.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report.to_dict(), f, indent=2, ensure_ascii=False)

        # Save trajectory separately
        traj_path = output_dir / f"{report.case_id}_trajectory.json"
        with open(traj_path, "w", encoding="utf-8") as f:
            json.dump(report.trajectory, f, indent=2, ensure_ascii=False)

        # Save fixed code if available
        if report.fixed_code:
            fix_path = output_dir / f"{report.case_id}_fixed.py"
            with open(fix_path, "w", encoding="utf-8") as f:
                f.write(report.fixed_code)

        print(f"Report saved to {report_path}")
