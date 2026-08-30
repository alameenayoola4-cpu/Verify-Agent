# VerifyAgent — Agent Handoff Document

> **If you are a new AI agent reading this**, this document tells you everything you need to know about this project, what has been done, what's left, and how to continue.

---

## 1. WHAT IS THIS PROJECT?

**VerifyAgent** is a submission for the **micro1 Frontier Engineering Challenge 2026** hackathon.

It is a **CLI-based Python tool** (NOT a web app) that autonomously verifies AI-generated code by **executing it** rather than just reading it. It's the opposite of "ask an LLM if this code looks right" — instead, it generates adversarial test cases, runs them in a sandbox, diagnoses failures from real tracebacks, and auto-patches the bugs.

### The core insight
Static LLM code review is unreliable (the reviewer hallucinates "looks good" even when bugs exist). VerifyAgent solves this by using **execution evidence** — actual test failures and stack traces — as ground truth.

---

## 2. PROJECT STATUS

### ✅ FULLY COMPLETE — Backend / Agent Pipeline
All Python code is done and working. All 10 evaluation cases have been run. Results are saved.

- `py run_agent.py` — Runs the full 6-phase pipeline on all 10 cases
- `py run_baseline.py` — Runs the static LLM reviewer (the "bad" baseline)
- `py score_results.py` — Scores agent results against ground truth
- `py build_data.py` — Compiles results into `dashboard/src/data.js`

**Final scores:** Precision 56%, Recall 56%, F1 0.562, Fix Success Rate 100%

### ⚠️ NEEDS REWORK — Website / Landing Page
The website at `dashboard/` currently has:
- `index.html` — A landing page (Tailwind CSS, black theme) — **too bare, doesn't explain the product properly**
- `dashboard.html` — A split-pane dashboard showing results — **works but is just a read-only results viewer, not an operable tool**

**THE USER WANTS**: A proper product landing page (like strix.ai or antigravity.dev) that:
1. Explains what VerifyAgent is and what problem it solves
2. Shows how to install and run it (CLI commands)
3. Shows the 6-phase pipeline visually
4. Shows the evaluation results as proof
5. Has a "Try it" / quickstart section
6. Looks premium and professional (NOT glassmorphism, NOT generic AI slop)

The dashboard can be removed or kept as a secondary page — the user's priority is a landing page that properly presents the tool as a real open-source product.

### ❌ NOT DONE — Deployment
- Vercel deployment failed due to missing login (`npx vercel login` needed first, or `npx vercel deploy --temporary`)
- Video recording not started

---

## 3. FILE STRUCTURE

```
c:\hackathonfolder\micro1-hackathon\
├── run_agent.py              # Main entry point — runs all 10 cases
├── run_baseline.py           # Runs static LLM baseline
├── score_results.py          # Scores results vs ground truth
├── build_data.py             # Builds dashboard/src/data.js from results
├── generate_comparison.py    # Generates COMPARISON.md report
├── .env                      # API keys (4 comma-separated Gemini keys)
├── .env.example              # Template for .env
├── requirements.txt          # pip install google-genai python-dotenv rich
├── README.md                 # Project readme
├── BLUEPRINT.md              # Original architecture doc
├── VIDEO_SCRIPT.md           # Script for demo video
│
├── src/
│   ├── llm/
│   │   └── gemini_client.py  # LLM wrapper with API key rotation + rate limiting
│   ├── agent/
│   │   ├── orchestrator.py   # 6-phase pipeline coordinator
│   │   ├── test_generator.py # Generates adversarial test cases
│   │   ├── diagnoser.py      # Analyzes test failures
│   │   └── fixer.py          # Generates code patches
│   ├── sandbox/
│   │   └── runner.py         # Runs code in subprocess with timeout
│   └── baseline/
│       └── simple_reviewer.py # Static LLM review (baseline)
│
├── evaluation/
│   └── cases/                # 10 evaluation cases, each with code.py + spec.md
│       ├── case_01_array_utils/
│       ├── case_02_rate_limiter/
│       └── ... (10 total)
│
├── results/
│   ├── agent/                # Agent JSON reports + fixed code + trajectories
│   ├── baseline/             # Baseline JSON reports
│   └── COMPARISON.md         # Markdown comparison report
│
└── dashboard/                # Vite project for the web frontend
    ├── index.html            # Landing page (needs redesign)
    ├── dashboard.html        # Results dashboard (read-only viewer)
    ├── package.json          # npm scripts: dev, build, preview
    └── src/
        ├── data.js           # 270KB auto-generated data (all 10 cases)
        ├── dashboard.js      # JS for dashboard.html
        ├── main.js           # OLD JS for previous design (dead code)
        └── styles/           # OLD CSS (dead code)
```

---

## 4. ENVIRONMENT NOTES (Windows)

- **Python**: Use `py` not `python` (Windows alias issue)
- **Encoding**: Set `$env:PYTHONIOENCODING="utf-8"` before running Python
- **Shell**: PowerShell — use `;` not `&&` to chain commands
- **Node**: Available via `node --version`
- **Dashboard dev server**: `cd dashboard; npm run dev` → http://localhost:5173/
- **API keys**: 4 Gemini keys in `.env`, comma-separated, auto-rotated on 429 errors

---

## 5. KEY TECHNICAL DETAILS

### API Key Rotation
`src/llm/gemini_client.py` has a `_rotate_api_key()` method. When a 429 (Quota Exceeded) error is caught in the `generate()` method, it automatically switches to the next API key. This was critical to complete all 10 cases.

### Resume Logic
`run_agent.py` checks if `results/agent/{case_id}_report.json` exists before running a case. It skips completed cases automatically.

### Data Pipeline
The flow is: `run_agent.py` → JSON files in `results/agent/` → `score_results.py` → `build_data.py` → `dashboard/src/data.js` → website reads it.

### Vite Multi-Page Issue
Vite doesn't serve `dashboard.html` properly without a `vite.config.js` that declares it as an additional entry point. This needs to be fixed if keeping the dashboard.

---

## 6. WHAT TO DO NEXT

### Priority 1: Redesign the Landing Page
Convert `dashboard/index.html` into a proper product page that:
- Explains what VerifyAgent does (the problem + solution)
- Shows installation steps (`pip install`, `.env` setup)
- Shows usage commands (`py run_agent.py`)
- Visualizes the 6-phase pipeline
- Shows results/benchmarks as social proof
- Has a quickstart code block
- Looks like a real open-source tool homepage (think: strix.ai, linear.app docs)

### Priority 2: Fix Vite Config
Add `vite.config.js` to handle multi-page if dashboard.html is kept.

### Priority 3: Clean Up Dead Files
Remove: `dashboard/src/main.js`, `main.ts`, `counter.ts`, `style.css`, `src/styles/`

### Priority 4: Deploy
Run `npx vercel login` then `npx vercel` inside `dashboard/` to deploy.

### Priority 5: Record Demo Video
Use `VIDEO_SCRIPT.md` as the script. Record a 5-min Loom walkthrough.
