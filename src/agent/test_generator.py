"""
Test Generator — Phase 2 of VerifyAgent

Reads AI-generated code + its specification and generates
targeted test cases designed to catch common AI hallucination patterns.
"""

import json
from src.llm.gemini_client import GeminiClient

SYSTEM_PROMPT = """You are a senior test engineer specializing in catching bugs in AI-generated code.

Your job is to generate test cases that will EXECUTE against the provided code to verify it works correctly.
Focus especially on cases that AI code generators commonly get wrong:

1. **Edge cases**: Empty inputs, single elements, None/null values
2. **Boundary conditions**: Zero, negative numbers, max values, empty strings
3. **Type mismatches**: What happens with unexpected input types?
4. **Off-by-one errors**: Array bounds, ranges, loop conditions
5. **Error handling**: Does it handle errors gracefully or crash?
6. **Logic errors**: Does the output actually match the specification?
7. **State management**: Are side effects handled correctly?
8. **Concurrency/timing**: Any race conditions possible?

Each test must be a self-contained Python snippet that:
- Calls the function(s) in the code
- Compares actual output to expected output
- Prints a JSON object with keys: passed (bool), input (str), expected (str), actual (str)

Be adversarial. Your goal is to FIND bugs, not confirm the code works."""


def generate_test_cases(
    llm: GeminiClient,
    code: str,
    spec: str,
    num_tests: int = 12,
) -> list[dict]:
    """
    Generate test cases for the given code based on its specification.

    Returns a list of dicts, each with:
        - name: str (human-readable test name)
        - category: str (happy_path | edge_case | boundary | error_handling)
        - test_code: str (Python code snippet to execute)
        - rationale: str (why this test matters)
    """
    prompt = f"""Analyze this code and its specification, then generate exactly {num_tests} test cases.

## SPECIFICATION (what the code SHOULD do):
{spec}

## CODE (what was actually written — may contain bugs):
```python
{code}
```

Generate {num_tests} test cases as a JSON array. Each test case must have:
- "name": short descriptive name (e.g., "empty_input_returns_zero")
- "category": one of "happy_path", "edge_case", "boundary", "error_handling"
- "test_code": a Python code snippet that tests the code. The snippet must:
  1. Call the function(s) defined in the code above (they are already in scope)
  2. Compare the actual result to the expected result
  3. Print EXACTLY ONE line of JSON: {{"passed": true/false, "input": "<description>", "expected": "<value>", "actual": "<value>"}}
- "rationale": one sentence explaining what this test catches

CRITICAL RULES:
- The test_code must be valid Python that can run directly after the code above
- Each test MUST print exactly one JSON line as its last output
- Include at least 3 happy-path tests, 4 edge-case tests, 3 boundary tests, and 2 error-handling tests
- Design tests that are likely to CATCH bugs, not just confirm the obvious
- Use json.dumps() for printing — json is already imported in scope

Return ONLY the JSON array, no markdown fences."""

    result = llm.generate_json(
        prompt=prompt,
        system_instruction=SYSTEM_PROMPT,
        temperature=0.3,
    )

    if isinstance(result, list):
        return result
    return result.get("test_cases", result.get("tests", []))
