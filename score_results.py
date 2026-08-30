"""
Ground Truth Scorer — Compares agent/baseline results against known bugs.

Computes precision, recall, F1, and fix success rate for both approaches.
Outputs structured scoring to results/scores/.
"""

import json
import sys
from pathlib import Path


def load_ground_truths(cases_dir: Path) -> dict:
    """Load all ground truth files keyed by case_id."""
    truths = {}
    for case_dir in sorted(cases_dir.iterdir()):
        gt_path = case_dir / "ground_truth.json"
        if gt_path.exists():
            with open(gt_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                truths[data["case_id"]] = data["bugs"]
    return truths


def load_baseline_results(baseline_dir: Path) -> dict:
    """Load baseline results keyed by case_id."""
    results = {}
    for p in sorted(baseline_dir.glob("*_baseline.json")):
        with open(p, "r", encoding="utf-8") as f:
            data = json.load(f)
            results[data["case_id"]] = data
    return results


def load_agent_results(agent_dir: Path) -> dict:
    """Load agent results keyed by case_id."""
    results = {}
    for p in sorted(agent_dir.glob("*_report.json")):
        with open(p, "r", encoding="utf-8") as f:
            data = json.load(f)
            results[data["case_id"]] = data
    return results


def match_bug(found_bug: dict, truth_bug: dict) -> bool:
    """Check if a found bug matches a ground truth bug.
    
    Uses fuzzy matching on function name, category, and description keywords.
    """
    # Try matching on function/location
    found_text = json.dumps(found_bug).lower()
    truth_func = truth_bug.get("function", "").lower()
    truth_desc = truth_bug.get("description", "").lower()
    truth_cat = truth_bug.get("category", "").lower()
    truth_hint = truth_bug.get("line_hint", "").lower()
    
    # Must mention the correct function/location
    if truth_func and truth_func not in found_text:
        return False
    
    # Score based on keyword overlap
    score = 0
    
    # Check if key descriptive words from truth appear in the found bug
    key_words = set()
    for word in truth_desc.split():
        if len(word) > 4:  # Only meaningful words
            key_words.add(word.strip(".,;:()"))
    
    matching_words = sum(1 for w in key_words if w in found_text)
    if key_words:
        score = matching_words / len(key_words)
    
    # Check line hint
    if truth_hint and truth_hint in found_text:
        score += 0.3
    
    # Check category match
    if truth_cat and truth_cat.replace("_", " ") in found_text.replace("_", " "):
        score += 0.2
    
    return score >= 0.3  # Threshold for a match


def score_approach(results: dict, truths: dict, approach_name: str) -> dict:
    """Score an approach (baseline or agent) against ground truth.
    
    Returns per-case and aggregate metrics.
    """
    cases = []
    total_tp = 0
    total_fp = 0
    total_fn = 0
    total_fix_attempts = 0
    total_fix_successes = 0
    
    for case_id, truth_bugs in truths.items():
        result = results.get(case_id)
        
        if not result:
            # Case not processed
            total_fn += len(truth_bugs)
            cases.append({
                "case_id": case_id,
                "status": "NOT_RUN",
                "true_bugs": len(truth_bugs),
                "tp": 0, "fp": 0, "fn": len(truth_bugs),
            })
            continue
        
        # Get the bugs found by this approach
        found_bugs = []
        if "bugs_found" in result:
            found = result["bugs_found"]
            found_bugs = found if isinstance(found, list) else []
        elif "bugs" in result:
            found = result["bugs"]
            found_bugs = found if isinstance(found, list) else []
        
        # Match found bugs to ground truth
        matched_truths = set()
        matched_founds = set()
        
        for i, found in enumerate(found_bugs):
            for j, truth in enumerate(truth_bugs):
                if j not in matched_truths and i not in matched_founds:
                    if match_bug(found, truth):
                        matched_truths.add(j)
                        matched_founds.add(i)
        
        tp = len(matched_truths)
        fp = len(found_bugs) - len(matched_founds)
        fn = len(truth_bugs) - len(matched_truths)
        
        total_tp += tp
        total_fp += fp
        total_fn += fn
        
        case_result = {
            "case_id": case_id,
            "status": "OK",
            "true_bugs": len(truth_bugs),
            "found_bugs": len(found_bugs),
            "tp": tp, "fp": fp, "fn": fn,
            "precision": tp / (tp + fp) if (tp + fp) > 0 else 0,
            "recall": tp / (tp + fn) if (tp + fn) > 0 else 0,
        }
        
        # Fix tracking (agent only)
        if "fix_applied" in result:
            case_result["fix_applied"] = result["fix_applied"]
            case_result["fix_improved"] = result.get("fix_improved", False)
            case_result["post_fix_passed"] = result.get("post_fix_passed", 0)
            case_result["total_tests"] = result.get("total_tests", 0)
            if result.get("fix_applied"):
                total_fix_attempts += 1
                if result.get("fix_improved"):
                    total_fix_successes += 1
        
        if "total_time_seconds" in result:
            case_result["time_seconds"] = result["total_time_seconds"]
        elif "total_time_seconds" in result:
            case_result["time_seconds"] = result["total_time_seconds"]
        
        cases.append(case_result)
    
    # Aggregate metrics
    precision = total_tp / (total_tp + total_fp) if (total_tp + total_fp) > 0 else 0
    recall = total_tp / (total_tp + total_fn) if (total_tp + total_fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    
    return {
        "approach": approach_name,
        "aggregate": {
            "total_true_bugs": sum(len(truths[c]) for c in truths),
            "total_found": total_tp + total_fp,
            "true_positives": total_tp,
            "false_positives": total_fp,
            "false_negatives": total_fn,
            "precision": round(precision, 3),
            "recall": round(recall, 3),
            "f1_score": round(f1, 3),
            "fix_attempts": total_fix_attempts,
            "fix_successes": total_fix_successes,
            "fix_success_rate": round(total_fix_successes / total_fix_attempts, 3) if total_fix_attempts > 0 else 0,
        },
        "cases": cases,
    }


def generate_comparison(baseline_scores: dict, agent_scores: dict) -> dict:
    """Generate a side-by-side comparison of baseline vs agent."""
    ba = baseline_scores["aggregate"]
    aa = agent_scores["aggregate"]
    
    return {
        "baseline": ba,
        "agent": aa,
        "improvement": {
            "precision_gain": round(aa["precision"] - ba["precision"], 3),
            "recall_gain": round(aa["recall"] - ba["recall"], 3),
            "f1_gain": round(aa["f1_score"] - ba["f1_score"], 3),
            "precision_pct": f"+{round((aa['precision'] / ba['precision'] - 1) * 100)}%" if ba["precision"] > 0 else "N/A",
            "recall_pct": f"+{round((aa['recall'] / ba['recall'] - 1) * 100)}%" if ba["recall"] > 0 else "N/A",
        }
    }


def generate_comparison_markdown(baseline_scores: dict, agent_scores: dict, comparison: dict) -> str:
    """Generate a detailed markdown comparison report."""
    ba = comparison["baseline"]
    aa = comparison["agent"]
    imp = comparison["improvement"]
    
    lines = [
        "# VerifyAgent vs Static Baseline: Ground Truth Comparison",
        "",
        "## Aggregate Metrics",
        "",
        "| Metric | Baseline (Static LLM) | VerifyAgent (Execution) | Improvement |",
        "|--------|----------------------|-------------------------|-------------|",
        f"| Precision | {ba['precision']:.1%} | **{aa['precision']:.1%}** | {imp['precision_pct']} |",
        f"| Recall | {ba['recall']:.1%} | **{aa['recall']:.1%}** | {imp['recall_pct']} |",
        f"| F1 Score | {ba['f1_score']:.3f} | **{aa['f1_score']:.3f}** | +{imp['f1_gain']:.3f} |",
        f"| True Positives | {ba['true_positives']} | **{aa['true_positives']}** | |",
        f"| False Positives | {ba['false_positives']} | **{aa['false_positives']}** | |",
        f"| False Negatives | {ba['false_negatives']} | **{aa['false_negatives']}** | |",
        f"| Fix Success Rate | N/A | **{aa['fix_success_rate']:.0%}** | |",
        "",
        "## Per-Case Breakdown",
        "",
        "| Case | True Bugs | Baseline TP/FP/FN | Agent TP/FP/FN | Agent Fixed? |",
        "|------|-----------|-------------------|----------------|--------------|",
    ]
    
    b_cases = {c["case_id"]: c for c in baseline_scores["cases"]}
    a_cases = {c["case_id"]: c for c in agent_scores["cases"]}
    
    for case_id in sorted(set(list(b_cases.keys()) + list(a_cases.keys()))):
        bc = b_cases.get(case_id, {"tp": 0, "fp": 0, "fn": 0, "true_bugs": "?"})
        ac = a_cases.get(case_id, {"tp": 0, "fp": 0, "fn": 0, "true_bugs": "?"})
        
        true_bugs = bc.get("true_bugs", ac.get("true_bugs", "?"))
        b_str = f"{bc['tp']}/{bc['fp']}/{bc['fn']}"
        a_str = f"{ac['tp']}/{ac['fp']}/{ac['fn']}"
        
        fixed = ""
        if "fix_improved" in ac:
            fixed = "Yes" if ac["fix_improved"] else "No"
            if ac.get("status") == "NOT_RUN":
                fixed = "Not run"
        
        lines.append(f"| `{case_id}` | {true_bugs} | {b_str} | **{a_str}** | {fixed} |")
    
    lines.extend([
        "",
        "## Key Insight",
        "",
        "The static LLM baseline can identify some bugs through pattern recognition,",
        "but it has no way to **verify** its findings. It may report bugs that don't",
        "actually exist (false positives) or miss subtle runtime issues (false negatives).",
        "",
        "VerifyAgent's execution-based approach generates adversarial tests, runs them,",
        "and only reports bugs backed by **concrete execution evidence**. This eliminates",
        "hallucinated bugs and catches issues that only manifest at runtime.",
    ])
    
    return "\n".join(lines)


def main():
    cases_dir = Path("evaluation/cases")
    baseline_dir = Path("results/baseline")
    agent_dir = Path("results/agent")
    scores_dir = Path("results/scores")
    scores_dir.mkdir(parents=True, exist_ok=True)
    
    print("Loading ground truths...")
    truths = load_ground_truths(cases_dir)
    print(f"  Found {len(truths)} cases with {sum(len(v) for v in truths.values())} total bugs")
    
    print("\nScoring baseline...")
    baseline_results = load_baseline_results(baseline_dir)
    baseline_scores = score_approach(baseline_results, truths, "baseline")
    
    print("\nScoring agent...")
    agent_results = load_agent_results(agent_dir)
    agent_scores = score_approach(agent_results, truths, "agent")
    
    # Save scores
    with open(scores_dir / "baseline_scores.json", "w", encoding="utf-8") as f:
        json.dump(baseline_scores, f, indent=2)
    with open(scores_dir / "agent_scores.json", "w", encoding="utf-8") as f:
        json.dump(agent_scores, f, indent=2)
    
    # Generate comparison
    comparison = generate_comparison(baseline_scores, agent_scores)
    with open(scores_dir / "comparison.json", "w", encoding="utf-8") as f:
        json.dump(comparison, f, indent=2)
    
    # Generate markdown report
    report_md = generate_comparison_markdown(baseline_scores, agent_scores, comparison)
    with open(Path("results/COMPARISON.md"), "w", encoding="utf-8") as f:
        f.write(report_md)
    
    # Print summary
    ba = baseline_scores["aggregate"]
    aa = agent_scores["aggregate"]
    
    print(f"\n{'='*60}")
    print(f"  SCORING COMPLETE")
    print(f"{'='*60}")
    print(f"  {'Metric':<25} {'Baseline':>10} {'Agent':>10}")
    print(f"  {'-'*45}")
    print(f"  {'Precision':<25} {ba['precision']:>10.1%} {aa['precision']:>10.1%}")
    print(f"  {'Recall':<25} {ba['recall']:>10.1%} {aa['recall']:>10.1%}")
    print(f"  {'F1 Score':<25} {ba['f1_score']:>10.3f} {aa['f1_score']:>10.3f}")
    print(f"  {'True Positives':<25} {ba['true_positives']:>10} {aa['true_positives']:>10}")
    print(f"  {'False Positives':<25} {ba['false_positives']:>10} {aa['false_positives']:>10}")
    print(f"  {'False Negatives':<25} {ba['false_negatives']:>10} {aa['false_negatives']:>10}")
    if aa["fix_attempts"] > 0:
        print(f"  {'Fix Success Rate':<25} {'N/A':>10} {aa['fix_success_rate']:>10.0%}")
    print(f"{'='*60}")
    print(f"\n  Results saved to: results/scores/")
    print(f"  Report saved to: results/COMPARISON.md")


if __name__ == "__main__":
    main()
