"""
Run the simple baseline reviewer on all evaluation cases.

Usage:
    py run_baseline.py                    # Run on all cases
    py run_baseline.py case_01_array_utils  # Run on specific case
"""

import sys
import json
from pathlib import Path
from src.baseline.simple_reviewer import SimpleReviewer

CASES_DIR = Path("evaluation/cases")
RESULTS_DIR = Path("results/baseline")


def load_case(case_dir: Path) -> dict:
    """Load a single evaluation case."""
    code = (case_dir / "code.py").read_text(encoding="utf-8")
    spec = (case_dir / "spec.md").read_text(encoding="utf-8")
    ground_truth = json.loads((case_dir / "ground_truth.json").read_text(encoding="utf-8"))
    return {
        "case_id": ground_truth["case_id"],
        "code": code,
        "spec": spec,
        "ground_truth": ground_truth,
    }


def run_all(filter_case: str | None = None):
    """Run baseline reviewer on all (or filtered) evaluation cases."""
    reviewer = SimpleReviewer()
    
    case_dirs = sorted(CASES_DIR.iterdir())
    if filter_case:
        case_dirs = [d for d in case_dirs if filter_case in d.name]
    
    all_reports = []
    
    for case_dir in case_dirs:
        if not case_dir.is_dir():
            continue
        
        try:
            case = load_case(case_dir)
        except FileNotFoundError as e:
            print(f"Skipping {case_dir.name}: {e}")
            continue
        
        print(f"\n{'#'*60}")
        print(f"  Running Baseline on: {case['case_id']}")
        print(f"{'#'*60}")
        
        report = reviewer.review(
            case_id=case["case_id"],
            code=case["code"],
            spec=case["spec"],
        )
        
        reviewer.save_report(report, RESULTS_DIR)
        all_reports.append(report.to_dict())
    
    # Save summary
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    summary_path = RESULTS_DIR / "summary.json"
    
    summary = {
        "total_cases": len(all_reports),
        "cases": [],
    }
    
    for r in all_reports:
        summary["cases"].append({
            "case_id": r["case_id"],
            "bugs_reported": r["bug_count"],
            "time_seconds": r["total_time_seconds"],
        })
    
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    
    print(f"\n{'='*60}")
    print(f"  BASELINE RUN COMPLETE")
    print(f"  Results saved to: {RESULTS_DIR}")
    print(f"  Cases processed: {len(all_reports)}")
    print(f"{'='*60}")


if __name__ == "__main__":
    filter_case = sys.argv[1] if len(sys.argv) > 1 else None
    run_all(filter_case)
