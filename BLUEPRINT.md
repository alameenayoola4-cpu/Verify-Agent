# VerifyAgent — Project Blueprint
# ================================================
# This document is the SINGLE SOURCE OF TRUTH for the entire project.
# Any AI or human should be able to read this and continue building.
# ================================================

## 1. PROJECT OVERVIEW

**What**: VerifyAgent is an agentic AI tool that verifies AI-generated code by
EXECUTING it, not just reading it. It generates adversarial test cases, runs them
in a sandbox, diagnoses failures, applies fixes, and re-verifies — proving through
execution whether the code works.

**Why**: The "Verification Gap" — LLMs produce code that looks correct but contains
subtle logic bugs. Static LLM reviewers just hallucinate. Execution-based verification
is the only way to get real proof.

**For**: micro1 Frontier Engineering Challenge 2026 (Aug 28-31)

**Stack**: Python 3.13 backend + Vite static web dashboard
**LLM**: Google Gemini 3.6 Flash via google-genai SDK
**API Key**: Stored in `.env` as GEMINI_API_KEY

---

## 2. DIRECTORY STRUCTURE (TARGET STATE)

```
c:\hackathonfolder\micro1-hackathon\
│
├── .env                          # GEMINI_API_KEY=xxx (DO NOT COMMIT)
├── .env.example                  # Template
├── .gitignore
├── README.md                     # Final submission README
├── BLUEPRINT.md                  # THIS FILE
├── CHANGELOG.md                  # What we built and learned
├── requirements.txt              # Python deps: google-genai, python-dotenv, rich
│
├── src/                          # Python backend — the agent
│   ├── __init__.py
│   ├── llm/
│   │   ├── __init__.py
│   │   └── gemini_client.py      # LLM wrapper with rate limiting & trajectory logging
│   ├── sandbox/
│   │   ├── __init__.py
│   │   └── runner.py             # Subprocess-based code execution sandbox
│   ├── agent/
│   │   ├── __init__.py
│   │   ├── orchestrator.py       # Main 6-phase verification loop
│   │   ├── test_generator.py     # Phase 2: Generate adversarial test cases
│   │   ├── diagnoser.py          # Phase 4: Root cause analysis from failures
│   │   └── fixer.py              # Phase 5: Apply fixes and re-verify
│   └── baseline/
│       ├── __init__.py
│       └── simple_reviewer.py    # Single-prompt static LLM reviewer (the "bad" approach)
│
├── evaluation/
│   └── cases/                    # 10 evaluation cases
│       ├── case_01_array_utils/
│       │   ├── code.py           # Buggy AI-generated code (NO bug labels in comments!)
│       │   ├── spec.md           # What the code should do
│       │   └── ground_truth.json # Known bugs with categories
│       ├── case_02_rate_limiter/
│       │   └── ... (same structure)
│       └── ... (case_03 through case_10)
│
├── run_baseline.py               # Runs baseline reviewer on all 10 cases
├── run_agent.py                  # Runs VerifyAgent on all 10 cases (with rate limiting)
├── score_results.py              # Compares results against ground_truth.json
├── generate_comparison.py        # Generates markdown comparison report
│
├── results/                      # All output from runs
│   ├── baseline/                 # Baseline results (10 JSON files + summary)
│   │   ├── case_XX_baseline.json
│   │   └── summary.json
│   ├── agent/                    # Agent results (reports, trajectories, fixed code)
│   │   ├── case_XX_report.json
│   │   ├── case_XX_trajectory.json
│   │   └── case_XX_fixed.py
│   ├── scores/                   # Ground truth comparison
│   │   ├── baseline_scores.json
│   │   ├── agent_scores.json
│   │   └── comparison.json       # Side-by-side metrics
│   └── COMPARISON.md             # Human-readable comparison
│
└── dashboard/                    # Vite web dashboard
    ├── package.json
    ├── vite.config.js
    ├── index.html                # Single page app entry
    ├── src/
    │   ├── main.js               # App initialization
    │   ├── data.js               # Embedded results data (generated from results/)
    │   ├── styles/
    │   │   └── main.css          # All styles — dark glassmorphism theme
    │   ├── components/
    │   │   ├── hero.js           # Landing hero section
    │   │   ├── pipeline.js       # 6-phase pipeline visualizer
    │   │   ├── cases.js          # Case explorer grid
    │   │   ├── codeview.js       # Code diff viewer with syntax highlighting
    │   │   ├── metrics.js        # Charts and scorecards
    │   │   └── trajectory.js     # LLM trajectory viewer
    │   └── lib/
    │       ├── charts.js         # Chart rendering utilities
    │       └── highlight.js      # Code syntax highlighting
    └── public/
        └── favicon.svg
```

---

## 3. COMPONENT SPECIFICATIONS

### 3.1 gemini_client.py — LLM Wrapper
**STATUS: NEEDS UPGRADE**

Current issues:
- Rate limiting is too simple (retries on 429 but doesn't prevent hitting limits)
- No request-per-minute throttling

Required changes:
```python
# Add to __init__:
self._last_request_time = 0
self._min_request_interval = 4.0  # 15 RPM = 1 every 4 seconds

# Add before each API call:
elapsed = time.time() - self._last_request_time
if elapsed < self._min_request_interval:
    time.sleep(self._min_request_interval - elapsed)
self._last_request_time = time.time()

# Increase max_retries to 8
# Increase base_delay to 5.0
# Add print statements showing retry status
```

### 3.2 run_agent.py — Agent Runner
**STATUS: NEEDS UPGRADE**

Required changes:
- Remove the `cases[:3]` slice — run ALL 10
- Add per-case try/except so one failure doesn't kill the entire run
- Add progress printing (Case 3/10...)
- Add resume capability: skip cases that already have results in results/agent/
- Save summary.json at the end (like baseline does)

### 3.3 score_results.py — Ground Truth Scorer
**STATUS: NOT BUILT**

This is the most important missing piece. Logic:
```python
# For each case:
#   1. Load ground_truth.json (list of known bugs with "location" and "bug_type" fields)
#   2. Load agent report (bugs_found list with "root_cause" and "category" fields)
#   3. Match agent findings to ground truth bugs (fuzzy match on location + type)
#   4. Count: TP (correctly found), FP (hallucinated), FN (missed)
#
# Aggregate across all cases:
#   Precision = TP / (TP + FP)
#   Recall = TP / (TP + FN)
#   F1 = 2 * P * R / (P + R)
#   Fix Success Rate = cases_where_fix_improved / cases_with_bugs
```

### 3.4 Evaluation Cases — Bug Label Removal
**STATUS: NEEDS CLEANUP**

Current code files have comments like:
```python
for i in range(len(arr) - window_size):  # BUG: should be len(arr) - window_size + 1
```
These MUST be removed. The agent should find bugs through execution, not by reading labels.
Strip all comments containing "BUG:", "HACK:", "TODO: fix", etc.

### 3.5 Web Dashboard — Full Specification
**STATUS: NOT BUILT**

**Technology**: Vite + vanilla JS + vanilla CSS
**Deploy**: Vercel (free, instant, judges can access a live URL)
**Data**: results/ JSON files are converted to a single `data.js` module at build time

#### Design System

```css
/* Color palette */
--bg-primary: #0a0a0f;          /* Near-black background */
--bg-card: rgba(15, 15, 25, 0.8); /* Glassmorphism card */
--bg-card-hover: rgba(20, 20, 35, 0.9);
--border-glass: rgba(255, 255, 255, 0.06);
--border-glow: rgba(99, 102, 241, 0.3);

--text-primary: #e2e8f0;
--text-secondary: #94a3b8;
--text-muted: #64748b;

--accent-indigo: #818cf8;        /* Primary accent */
--accent-emerald: #34d399;       /* Success / pass */
--accent-rose: #fb7185;          /* Failure / bug */
--accent-amber: #fbbf24;         /* Warning */
--accent-cyan: #22d3ee;          /* Info / agent */

--gradient-hero: linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0a1628 100%);
--glass-blur: blur(20px);

/* Typography */
--font-body: 'Inter', system-ui, sans-serif;
--font-code: 'JetBrains Mono', 'Fira Code', monospace;

/* Spacing */
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;
--space-2xl: 3rem;
--space-3xl: 4rem;

/* Border radius */
--radius-sm: 0.5rem;
--radius-md: 0.75rem;
--radius-lg: 1rem;
--radius-xl: 1.5rem;
```

#### Section 1: Hero
- Full-viewport height
- Animated gradient background (subtle movement)
- Title: "VerifyAgent" in large bold text
- Subtitle: "Execution-Based Verification for AI-Generated Code"
- Three stat cards below:
  - "10 Real-World Cases" with code icon
  - "X Bugs Caught" with bug icon
  - "Y% Improvement over Static Review" with chart icon
- Scroll-down indicator

#### Section 2: The Problem
- Two-column layout
- Left: "The Verification Gap" explanation
- Right: Visual showing LLM saying "looks good ✅" vs actual execution showing "FAIL ❌"
- Animated comparison

#### Section 3: Pipeline Visualizer
- Horizontal flow diagram of 6 phases
- Each phase is a card with icon, name, description
- Connected by animated lines/arrows
- Click a phase → expand to show details for a selected case
- Phase cards: Understand → Generate Tests → Execute → Diagnose → Fix → Report

#### Section 4: Case Explorer
- Grid of 10 case cards (2 columns on desktop, 1 on mobile)
- Each card shows:
  - Case name and icon
  - Bug type badge (e.g., "off-by-one", "state bug")
  - Baseline result: "Found: 2 bugs (unverified)"
  - Agent result: "Found: 2 bugs → Fixed → 12/12 tests pass"
  - Status badge: ✅ Fixed / ⚠️ Partially Fixed / ❌ Missed
- Click card → opens modal with full details:
  - Tabbed view: Code | Tests | Results | Diagnosis | Fix | Diff

#### Section 5: Code Diff Viewer (inside case modal)
- Side-by-side: original (red highlights) vs fixed (green highlights)
- Line numbers
- Syntax highlighted with Prism.js (loaded from CDN)
- Bug locations annotated

#### Section 6: Results Dashboard
- Score Cards row:
  - Agent Precision: X%
  - Agent Recall: X%
  - Agent F1: X%
  - Fix Success Rate: X%
- Bar chart: Bugs found per case (baseline vs agent, grouped bars)
- Comparison table: all 10 cases with baseline/agent columns
- "Key Insight" callout box

#### Section 7: Trajectory Viewer
- Accordion/collapsible for each LLM call
- Shows: prompt preview, response preview, latency, tokens
- Expandable to see full prompt/response

#### Section 8: Footer
- "Built for micro1 Frontier Engineering Challenge 2026"
- Link to GitHub repo
- "Powered by Gemini 3.6 Flash"

---

## 4. DATA FLOW

```
evaluation/cases/  →  run_baseline.py  →  results/baseline/*.json
                   →  run_agent.py     →  results/agent/*.json
                   →  score_results.py →  results/scores/*.json
                                       →  results/COMPARISON.md

results/*.json     →  build_data.py    →  dashboard/src/data.js

dashboard/         →  npm run build    →  dashboard/dist/  →  Deploy to Vercel
```

The `build_data.py` script reads all JSON from results/ and writes a single
JavaScript module that the dashboard imports:

```javascript
// dashboard/src/data.js (auto-generated)
export const baselineResults = [ ... ];
export const agentResults = [ ... ];
export const scores = { ... };
export const caseMetadata = [ ... ];
```

---

## 5. BUILD ORDER (for any AI continuing this work)

**STEP 1**: Upgrade gemini_client.py with proper rate limiting
**STEP 2**: Remove bug-label comments from all 10 evaluation case code.py files
**STEP 3**: Upgrade run_agent.py with resume + error handling
**STEP 4**: Run VerifyAgent on all 10 cases (may take 10-15 minutes with rate limiting)
**STEP 5**: Build score_results.py and generate ground truth scores
**STEP 6**: Generate final COMPARISON.md with real metrics
**STEP 7**: Initialize Vite dashboard project
**STEP 8**: Build dashboard CSS design system
**STEP 9**: Build hero + problem sections
**STEP 10**: Build pipeline visualizer
**STEP 11**: Build case explorer + code diff viewer
**STEP 12**: Build results dashboard with charts
**STEP 13**: Build trajectory viewer
**STEP 14**: Create build_data.py to embed results into dashboard
**STEP 15**: Deploy dashboard to Vercel
**STEP 16**: Rewrite README.md with screenshots and live URL
**STEP 17**: Record 5-minute demo video
**STEP 18**: Package and submit

---

## 6. CURRENT STATUS TRACKER

| Step | Status | Notes |
|------|--------|-------|
| 1. Rate limiter upgrade | NOT STARTED | |
| 2. Remove bug labels | NOT STARTED | |
| 3. Upgrade run_agent.py | NOT STARTED | |
| 4. Run all 10 cases | NOT STARTED | Only case_01 has agent results |
| 5. Ground truth scorer | NOT STARTED | |
| 6. Final comparison | NOT STARTED | |
| 7. Init Vite dashboard | NOT STARTED | |
| 8. Dashboard CSS | NOT STARTED | |
| 9. Hero + problem | NOT STARTED | |
| 10. Pipeline visualizer | NOT STARTED | |
| 11. Case explorer + diff | NOT STARTED | |
| 12. Results charts | NOT STARTED | |
| 13. Trajectory viewer | NOT STARTED | |
| 14. build_data.py | NOT STARTED | |
| 15. Deploy to Vercel | NOT STARTED | |
| 16. README rewrite | NOT STARTED | |
| 17. Record video | NOT STARTED | User action |
| 18. Submit | NOT STARTED | User action |

---

## 7. KEY FILES REFERENCE

These files already exist and work:
- `src/llm/gemini_client.py` — LLM wrapper (needs rate limit upgrade)
- `src/sandbox/runner.py` — Subprocess code executor (working)
- `src/agent/test_generator.py` — Test case generator (working)
- `src/agent/diagnoser.py` — Failure analyzer (working)
- `src/agent/fixer.py` — Code fixer (working)
- `src/agent/orchestrator.py` — Main pipeline (working)
- `src/baseline/simple_reviewer.py` — Static reviewer (working)
- `results/baseline/summary.json` — Baseline ran successfully on all 10 cases
- `results/agent/case_01_array_utils_report.json` — Only completed agent result

## 8. ENVIRONMENT

- Python 3.13.5 at `C:\Users\USER PC\AppData\Local\Programs\Python\Python313\python.exe`
- Node.js should be available (check with `node --version`)
- OS: Windows
- Workspace: `c:\hackathonfolder\micro1-hackathon`
- Use `py` command to run Python (not `python`)
- PowerShell: use `;` not `&&` to chain commands
- Set `$env:PYTHONIOENCODING="utf-8"` before running Python scripts (Windows encoding fix)
