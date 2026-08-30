# VerifyAgent - 5-Minute Demo Video Script (Hackathon Rubric Optimized)

## 0:00 - 0:45 | The Hook, Problem, and Baseline
**Visual:** Show your face or the landing page. Then switch to the terminal running the baseline (`python run_baseline.py`).
**Script:** 
"Hi, I'm Ayoola Adedeji, Founder of STRATIFY-SYS. Today, I'm presenting VerifyAgent for the micro1 Agentic Workflows Hackathon.
The major bottleneck in AI coding right now is the *Verification Gap*. Developers use AI to write code, but they can't fully trust it. The standard baseline way to check it is with a 'static AI reviewer'. 
If you look at this baseline run, the static reviewer just guesses at bugs. It hallucinates issues and misses real runtime errors because it can't execute the code. Real engineering requires execution."

## 0:45 - 2:30 | Walkthrough: Realistic Execution
**Visual:** Open the terminal and run `python run_agent.py`. Show the 6-phase architecture diagram on the website while it runs.
**Script:**
"So, I built VerifyAgent. It takes AI-generated code and forces it to prove it works in a sandbox. 
Here is a live execution on a real test case. Watch what happens:
1. It reads the code.
2. It generates 12 aggressive adversarial test cases.
3. It executes them in an isolated Python sandbox.
4. It parses the actual tracebacks from the failures.
5. It patches the code.
And you can see here, it automatically achieved a perfect 12/12 pass rate on code that previously crashed."

## 2:30 - 3:30 | Final Comparison & The Changelog
**Visual:** Show the `README.md` Improvement Changelog table.
**Script:**
"When we compare the final results, the baseline static reviewer failed to fix the subtle edge cases, while VerifyAgent achieved perfect passes across the benchmark. 
If we look at the Improvement Changelog in our README, you can see how this evolved. We started with a basic baseline prompt, which failed. We then added an execution sandbox, but it hung on infinite loops, so we had to add strict subprocess timeouts."

## 3:30 - 4:15 | The Most Important Change & Removed Experiment
**Visual:** Highlight the "Diagnose" step in the code or architecture diagram.
**Script:**
"The change that contributed the most to our final result was adding the formal 'Diagnosis' phase. Instead of just giving the LLM raw error text, we structured it to parse the exact root cause first, which made patching incredibly reliable.
One experiment we actually removed was trying to have the LLM blindly auto-fix code based on just the raw stdout without diagnosing it first. It turned out that without a structured diagnosis step, the LLM would actually break the code further. So we removed that naive approach."

## 4:15 - 5:00 | Conclusion & Agent API
**Visual:** Show the GitHub repo or the FastAPI server running.
**Script:**
"To make this truly useful for the ecosystem, I also wrapped VerifyAgent in a FastAPI REST server, so other AI agents can use it as a verification backend. 
My hot take is this: Static AI code review is a dead end. If an agent can't execute the code, it's just guessing. 
All code and agent trajectories are available in the repo. Thank you!"
