"""
Sandbox Runner — Safely execute Python code with timeout and capture.

Runs AI-generated code in an isolated subprocess with:
- Timeout enforcement (default 10s)
- stdout/stderr capture
- Return value serialization
- Exception capture with full tracebacks
"""

import subprocess
import sys
import json
import tempfile
import textwrap
import time
from pathlib import Path
from dataclasses import dataclass, asdict


@dataclass
class ExecutionResult:
    """Result of a single code execution."""
    test_name: str
    passed: bool
    input_data: str
    expected_output: str
    actual_output: str
    stdout: str
    stderr: str
    error: str | None
    runtime_ms: float

    def to_dict(self) -> dict:
        return asdict(self)


class SandboxRunner:
    """Execute Python code safely in isolated subprocesses."""

    def __init__(self, timeout: int = 10):
        self.timeout = timeout
        self.python_path = sys.executable

    def run_test_case(
        self,
        code: str,
        test_code: str,
        test_name: str = "unnamed_test",
    ) -> ExecutionResult:
        """
        Run a test case against the provided code.

        Args:
            code: The AI-generated source code to test
            test_code: A test snippet that imports/calls the code and prints a JSON result
            test_name: Human-readable name for this test

        Returns:
            ExecutionResult with pass/fail status and captured output
        """
        # Build the combined script
        script = textwrap.dedent(f"""
import json
import sys
import traceback

# === AI-GENERATED CODE UNDER TEST ===
{code}

# === TEST CASE ===
try:
{textwrap.indent(test_code, '    ')}
except Exception as e:
    print(json.dumps({{
        "passed": False,
        "input": "N/A",
        "expected": "N/A",
        "actual": f"EXCEPTION: {{type(e).__name__}}: {{str(e)}}",
        "error": traceback.format_exc()
    }}))
""")

        # Write to temp file and execute
        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".py",
            delete=False,
            encoding="utf-8",
        ) as f:
            f.write(script)
            temp_path = f.name

        start_time = time.time()
        try:
            result = subprocess.run(
                [self.python_path, temp_path],
                capture_output=True,
                text=True,
                timeout=self.timeout,
                cwd=tempfile.gettempdir(),
            )
            elapsed_ms = (time.time() - start_time) * 1000

            stdout = result.stdout.strip()
            stderr = result.stderr.strip()

            # Try to parse the JSON output from the test
            try:
                test_result = json.loads(stdout.split("\n")[-1]) if stdout else {}
                return ExecutionResult(
                    test_name=test_name,
                    passed=test_result.get("passed", False),
                    input_data=str(test_result.get("input", "N/A")),
                    expected_output=str(test_result.get("expected", "N/A")),
                    actual_output=str(test_result.get("actual", "N/A")),
                    stdout=stdout,
                    stderr=stderr,
                    error=test_result.get("error"),
                    runtime_ms=round(elapsed_ms, 2),
                )
            except (json.JSONDecodeError, IndexError):
                return ExecutionResult(
                    test_name=test_name,
                    passed=False,
                    input_data="N/A",
                    expected_output="Valid JSON output",
                    actual_output=stdout[:500] if stdout else "(no output)",
                    stdout=stdout,
                    stderr=stderr,
                    error=f"Test did not produce valid JSON. stderr: {stderr[:500]}",
                    runtime_ms=round(elapsed_ms, 2),
                )

        except subprocess.TimeoutExpired:
            elapsed_ms = (time.time() - start_time) * 1000
            return ExecutionResult(
                test_name=test_name,
                passed=False,
                input_data="N/A",
                expected_output="Completion within timeout",
                actual_output=f"TIMEOUT after {self.timeout}s",
                stdout="",
                stderr="",
                error=f"Execution timed out after {self.timeout} seconds",
                runtime_ms=round(elapsed_ms, 2),
            )

        except Exception as e:
            elapsed_ms = (time.time() - start_time) * 1000
            return ExecutionResult(
                test_name=test_name,
                passed=False,
                input_data="N/A",
                expected_output="Successful execution",
                actual_output=f"RUNNER ERROR: {str(e)}",
                stdout="",
                stderr="",
                error=str(e),
                runtime_ms=round(elapsed_ms, 2),
            )

        finally:
            Path(temp_path).unlink(missing_ok=True)

    def run_all_tests(
        self,
        code: str,
        test_cases: list[dict],
    ) -> list[ExecutionResult]:
        """
        Run multiple test cases against the same code.

        Args:
            code: The AI-generated code to test
            test_cases: List of dicts with 'name' and 'test_code' keys

        Returns:
            List of ExecutionResult objects
        """
        results = []
        for tc in test_cases:
            result = self.run_test_case(
                code=code,
                test_code=tc["test_code"],
                test_name=tc.get("name", "unnamed"),
            )
            results.append(result)
        return results
