"""
Build Dashboard Data — Generates data.js for the Vite dashboard.

Reads all output JSON files (baseline, agent, scores) and compiles
them into a single JavaScript module that the dashboard imports.
"""

import json
from pathlib import Path
import re


def load_json(filepath: Path) -> dict | list | None:
    if not filepath.exists():
        return None
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None


def main():
    results_dir = Path("results")
    dashboard_data_path = Path("dashboard/src/data.js")
    
    # Load all required data
    baseline_dir = results_dir / "baseline"
    agent_dir = results_dir / "agent"
    scores_dir = results_dir / "scores"
    
    # Load baseline results
    baseline_results = []
    if baseline_dir.exists():
        for p in sorted(baseline_dir.glob("*_baseline.json")):
            data = load_json(p)
            if data:
                baseline_results.append(data)
                
    # Load agent results
    agent_results = []
    if agent_dir.exists():
        for p in sorted(agent_dir.glob("*_report.json")):
            data = load_json(p)
            if data:
                # Truncate overly long trajectories to keep dashboard bundle size reasonable
                if "trajectory" in data and isinstance(data["trajectory"], list):
                    for step in data["trajectory"]:
                        if "prompt_preview" in step and len(step["prompt_preview"]) > 1000:
                            step["prompt_preview"] = step["prompt_preview"][:1000] + "\n...[truncated for display]..."
                        if "response_preview" in step and len(step["response_preview"]) > 1000:
                            step["response_preview"] = step["response_preview"][:1000] + "\n...[truncated for display]..."
                agent_results.append(data)
                
    # Load scores
    scores_data = load_json(scores_dir / "comparison.json")
    if not scores_data:
        # Provide default empty scores if comparison hasn't been run yet
        scores_data = {
            "baseline": {"precision": 0, "recall": 0, "f1_score": 0, "true_positives": 0, "false_positives": 0, "false_negatives": 0},
            "agent": {"precision": 0, "recall": 0, "f1_score": 0, "true_positives": 0, "false_positives": 0, "false_negatives": 0, "fix_success_rate": 0}
        }
        
    # Case metadata
    # Extracted from the cases for display purposes
    case_metadata = [
      { "id": "case_01_array_utils", "name": "Array Utilities", "bugType": "off-by-one", "severity": "medium" },
      { "id": "case_02_rate_limiter", "name": "Rate Limiter", "bugType": "state bug", "severity": "high" },
      { "id": "case_03_password_validator", "name": "Password Validator", "bugType": "unicode bypass", "severity": "high" },
      { "id": "case_04_csv_parser", "name": "CSV Parser", "bugType": "quoted fields", "severity": "medium" },
      { "id": "case_05_cache", "name": "Cache", "bugType": "memory leak", "severity": "high" },
      { "id": "case_06_pagination", "name": "Pagination", "bugType": "boundary dupes", "severity": "medium" },
      { "id": "case_07_retry", "name": "Retry Handler", "bugType": "infinite loop", "severity": "critical" },
      { "id": "case_08_date_utils", "name": "Date Utilities", "bugType": "leap year", "severity": "medium" },
      { "id": "case_09_permissions", "name": "Permissions", "bugType": "privilege escalation", "severity": "critical" },
      { "id": "case_10_data_transformer", "name": "Data Transformer", "bugType": "silent null drops", "severity": "high" }
    ]

    # Generate the JS file content
    js_content = f"""// AUTO-GENERATED DATA MODULE
// Run python build_data.py to update this file with the latest results.

export const caseMetadata = {json.dumps(case_metadata, indent=2)};

export const scores = {json.dumps(scores_data, indent=2)};

export const baselineResults = {json.dumps(baseline_results, indent=2)};

export const agentResults = {json.dumps(agent_results, indent=2)};
"""

    dashboard_data_path.parent.mkdir(parents=True, exist_ok=True)
    with open(dashboard_data_path, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"Successfully generated {dashboard_data_path}")
    print(f"  - Baseline cases: {len(baseline_results)}")
    print(f"  - Agent cases: {len(agent_results)}")
    print(f"  - Scores included: {'Yes' if scores_data.get('baseline', {}).get('precision') > 0 else 'Default/Empty'}")

if __name__ == "__main__":
    main()
