"""
Fixer — Phase 5 of VerifyAgent

Generates a corrected version of the code based on diagnosed bugs,
then re-verifies the fix by running all tests again.
"""

import json
from src.llm.gemini_client import GeminiClient

SYSTEM_PROMPT = """You are a senior software engineer fixing bugs in AI-generated code.

You are given:
1. The original buggy code
2. The specification of what it should do
3. Diagnosed bugs with root causes and evidence

Your job is to produce a CORRECTED version of the entire code.

Rules:
- Fix ALL diagnosed bugs
- Do NOT change the function signatures (names, parameters, return types)
- Do NOT add unnecessary complexity
- Preserve all correct behavior (don't break passing tests)
- Output ONLY the corrected Python code, no markdown fences, no explanations"""


def generate_fix(
    llm: GeminiClient,
    code: str,
    spec: str,
    diagnoses: list[dict],
) -> str:
    """
    Generate a corrected version of the code based on bug diagnoses.

    Returns the full corrected Python code as a string.
    """
    prompt = f"""Fix the bugs in this code.

## SPECIFICATION:
{spec}

## BUGGY CODE:
```python
{code}
```

## DIAGNOSED BUGS:
{json.dumps(diagnoses, indent=2)}

Write the complete corrected Python code. Fix every diagnosed bug while preserving correct behavior.
Output ONLY the Python code — no markdown fences, no comments about changes, just the code."""

    result = llm.generate(
        prompt=prompt,
        system_instruction=SYSTEM_PROMPT,
        temperature=0.1,
    )

    # Strip markdown fences if the LLM added them anyway
    result = result.strip()
    if result.startswith("```python"):
        result = result[len("```python"):].strip()
    if result.startswith("```"):
        result = result[3:].strip()
    if result.endswith("```"):
        result = result[:-3].strip()

    return result
