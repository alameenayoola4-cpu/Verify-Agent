# CHANGELOG

## [1.0.0] - 2026-08-29 - The "Verify, Don't Trust" Release

This release turns VerifyAgent from a prototype into a robust execution engine.

### Added
- **Resilient Pipeline**: The agent runner (`run_agent.py`) now handles intermittent API errors smoothly and can resume interrupted runs without losing data.
- **Robust Rate Limiting**: Upgraded `gemini_client.py` with intelligent request pacing (15 RPM limits) and exponential backoff that parses API error messages for `retryDelay` headers.
- **Ground Truth Scorer**: Built `score_results.py` to compare agent and baseline outputs against a known `ground_truth.json` for 10 evaluation cases. This finally gives us objective Precision, Recall, and F1 scores.
- **Interactive Dashboard**: Added a beautiful Vite-powered web dashboard (vanilla JS/CSS, no frameworks) with glassmorphism design. It includes:
  - Visualized 6-phase pipeline
  - Results metrics (Precision, Recall, F1)
  - Interactive bar charts (using native Canvas API)
  - Case Explorer with detailed diff viewer
  - LLM Trajectory Viewer for full transparency
- **Evaluation Integrity**: Stripped all "bug hint" comments from the 10 evaluation code files. The agent must now truly find bugs via execution, not by reading labels.

### Changed
- **Results Output**: Completely revamped the final output JSON to include detailed timestamps, trajectories, and fix diffs for use by the new dashboard.
- **Comparison Engine**: Replaced the rudimentary `generate_comparison.py` logic with the new ground truth scorer which automatically updates `COMPARISON.md`.

### Fixed
- Fixed 429/503 Resource Exhausted crashes that previously halted the evaluation mid-way.
- Fixed an issue where the baseline reviewer falsely inflated bug counts without verification.
