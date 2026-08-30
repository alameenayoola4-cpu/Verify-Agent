"""
Simple Baseline Reviewer — The "before" in our comparison.

This represents what most people do today: send code to an LLM
with a single prompt asking "is this code correct?" and trusting
the static text response without any execution or verification.
"""

import json
import time
from pathlib import Path
from dataclasses import dataclass, asdict
from src.llm.gemini_client import GeminiClient


@dataclass
class BaselineReport:
    """Report from the simple baseline reviewer."""
    case_id: str
    bugs_found: list[dict]
    bug_count: int
    review_text: str
    total_time_seconds: float
    trajectory: list[dict]

    def to_dict(self) -> dict:
        return asdict(self)


class SimpleReviewer:
    """
    Single-prompt LLM code reviewer.

    This is the baseline: no execution, no test generation, no verification.
    Just "read the code and tell me if it's correct."
    """

    def __init__(self):
        self.llm = GeminiClient()

    def review(self, case_id: str, code: str, spec: str) -> BaselineReport:
        """
        Send the code and spec to an LLM in a single prompt.

        This is intentionally simple — it represents the naive approach
        that most developers use today (paste code into ChatGPT and ask
        "does this look right?").
        """
        start_time = time.time()
        self.llm.reset_trajectory()

        print(f"\n{'='*60}")
        print(f"  BASELINE REVIEWER — Case: {case_id}")
        print(f"{'='*60}")

        prompt = f"""Review the following Python code against its specification.
Identify any bugs, issues, or potential problems.

## SPECIFICATION (what the code should do):
{spec}

## CODE:
```python
{code}
```

Analyze the code carefully and return a JSON object with:
- "bugs": an array of bugs found, each with:
  - "description": what the bug is
  - "severity": "critical", "high", "medium", or "low"
  - "location": which function or line has the issue
- "overall_assessment": "correct", "has_minor_issues", or "has_significant_bugs"
- "review_summary": a brief summary of your findings

Return ONLY valid JSON."""

        result = self.llm.generate_json(
            prompt=prompt,
            temperature=0.1,
        )

        elapsed = time.time() - start_time

        bugs = result.get("bugs", [])
        print(f"  Baseline found {len(bugs)} issues (static analysis only)")
        for b in bugs:
            print(f"    [*] [{b.get('severity', '?')}] {b.get('description', 'Unknown')[:80]}")

        report = BaselineReport(
            case_id=case_id,
            bugs_found=bugs,
            bug_count=len(bugs),
            review_text=json.dumps(result, indent=2),
            total_time_seconds=round(elapsed, 2),
            trajectory=self.llm.trajectory,
        )

        return report

    def save_report(self, report: BaselineReport, output_dir: Path) -> None:
        """Save baseline report to disk."""
        output_dir.mkdir(parents=True, exist_ok=True)

        report_path = output_dir / f"{report.case_id}_baseline.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report.to_dict(), f, indent=2, ensure_ascii=False)

        traj_path = output_dir / f"{report.case_id}_baseline_trajectory.json"
        with open(traj_path, "w", encoding="utf-8") as f:
            json.dump(report.trajectory, f, indent=2, ensure_ascii=False)

        print(f"Baseline report saved to {report_path}")
