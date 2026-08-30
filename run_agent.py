"""
VerifyAgent Runner — Runs the full agent pipeline on all evaluation cases.

Features:
- Resumable: skips cases that already have results
- Error-resilient: catches per-case failures and continues
- Rate-limit aware: uses the upgraded Gemini client
- Progress tracking with timestamps
"""

import json
import sys
import time
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

from src.agent.orchestrator import VerifyAgentOrchestrator


def load_case(case_dir: Path) -> dict:
    """Load a single evaluation case from disk."""
    code_path = case_dir / "code.py"
    spec_path = case_dir / "spec.md"
    
    if not code_path.exists():
        raise FileNotFoundError(f"Missing code.py in {case_dir}")
    if not spec_path.exists():
        raise FileNotFoundError(f"Missing spec.md in {case_dir}")
    
    return {
        "case_id": case_dir.name,
        "code": code_path.read_text(encoding="utf-8"),
        "spec": spec_path.read_text(encoding="utf-8"),
    }


def case_already_done(case_id: str, output_dir: Path) -> bool:
    """Check if a case already has a completed report."""
    report_path = output_dir / f"{case_id}_report.json"
    return report_path.exists()


def run_all(filter_case: str | None = None, force: bool = False):
    """Run VerifyAgent on all evaluation cases.
    
    Args:
        filter_case: If set, only run cases matching this string
        force: If True, re-run even if results already exist
    """
    cases_dir = Path("evaluation/cases")
    output_dir = Path("results/agent")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Load all cases
    case_dirs = sorted([d for d in cases_dir.iterdir() if d.is_dir()])
    if filter_case:
        case_dirs = [d for d in case_dirs if filter_case in d.name]
    
    cases = []
    for d in case_dirs:
        try:
            cases.append(load_case(d))
        except FileNotFoundError as e:
            print(f"  [SKIP] {d.name}: {e}")
    
    if not cases:
        print("No cases found!")
        return
    
    # Check which cases need running
    if not force:
        pending = [c for c in cases if not case_already_done(c["case_id"], output_dir)]
        done = [c for c in cases if case_already_done(c["case_id"], output_dir)]
        if done:
            print(f"\n  [resume] Skipping {len(done)} already-completed cases:")
            for c in done:
                print(f"    - {c['case_id']}")
        cases = pending
    
    if not cases:
        print("\n  All cases already have results! Use --force to re-run.")
        return
    
    print(f"\n{'='*60}")
    print(f"  VERIFYAGENT — Running {len(cases)} cases")
    print(f"  Rate limit: ~4.5s between API calls")
    print(f"  Estimated time: ~{len(cases) * 2} minutes")
    print(f"{'='*60}")
    
    agent = VerifyAgentOrchestrator(max_fix_attempts=2)
    all_reports = []
    successes = 0
    failures = 0
    
    for i, case in enumerate(cases, 1):
        print(f"\n{'#'*60}")
        print(f"  [{i}/{len(cases)}] Running VerifyAgent on: {case['case_id']}")
        print(f"  Started at: {time.strftime('%H:%M:%S')}")
        print(f"{'#'*60}")
        
        try:
            report = agent.verify(
                case_id=case["case_id"],
                code=case["code"],
                spec=case["spec"],
            )
            
            # Save immediately after each case (don't wait for all to finish)
            agent.save_report(report, output_dir)
            all_reports.append(report)
            successes += 1
            print(f"  [OK] {case['case_id']} completed successfully")
            
        except Exception as e:
            failures += 1
            error_msg = str(e)[:300]
            print(f"\n  [FAIL] {case['case_id']} failed: {error_msg}")
            print(f"  Continuing to next case...\n")
            
            # Save a partial failure report
            failure_report = {
                "case_id": case["case_id"],
                "error": str(e)[:500],
                "status": "FAILED",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }
            fail_path = output_dir / f"{case['case_id']}_error.json"
            with open(fail_path, "w", encoding="utf-8") as f:
                json.dump(failure_report, f, indent=2)
            continue
    
    # Save summary
    summary = {
        "total_cases": len(cases),
        "successes": successes,
        "failures": failures,
        "cases": [],
    }
    
    for report in all_reports:
        summary["cases"].append({
            "case_id": report.case_id,
            "bugs_found": report.bug_count,
            "tests_total": report.total_tests,
            "tests_passed": report.tests_passed,
            "fix_applied": report.fix_applied,
            "fix_improved": report.fix_improved,
            "post_fix_passed": report.post_fix_passed,
            "time_seconds": report.total_time_seconds,
        })
    
    summary_path = output_dir / "summary.json"
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    
    print(f"\n{'='*60}")
    print(f"  AGENT RUN COMPLETE")
    print(f"  Successes: {successes}/{len(cases)}")
    print(f"  Failures: {failures}/{len(cases)}")
    print(f"  Results saved to: {output_dir}")
    print(f"{'='*60}")


if __name__ == "__main__":
    filter_case = None
    force = False
    
    for arg in sys.argv[1:]:
        if arg == "--force":
            force = True
        elif arg.startswith("--case="):
            filter_case = arg.split("=", 1)[1]
        else:
            filter_case = arg
    
    run_all(filter_case, force)
