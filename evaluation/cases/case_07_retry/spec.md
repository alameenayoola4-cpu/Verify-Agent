# Retry with Backoff Specification

## retry_with_backoff(func, max_retries=3, base_delay=1.0, max_delay=30.0, jitter=True, retryable_exceptions=(Exception,))

Executes a function with exponential backoff retry logic.

### Behavior:
- Calls `func()` and returns its result on success
- On failure (exception in `retryable_exceptions`), waits and retries
- Delay doubles each attempt: `base_delay * 2^(attempt-1)`, capped at `max_delay`
- If `jitter` is True, multiply delay by random factor in [0.5, 1.0)
- After `max_retries` failed attempts, raises the last exception
- Total attempts = 1 (initial) + max_retries (retries)
- Non-retryable exceptions should propagate immediately without retry

## retry_decorator(max_retries=3, base_delay=0.1)

Decorator version of retry_with_backoff.

- Preserves function arguments
- Should preserve function name and docstring (functools.wraps)

## CircuitBreaker(failure_threshold=5, recovery_timeout=30.0)

### States:
- **closed**: Normal operation. Requests pass through.
- **open**: Too many failures. Requests immediately fail with RuntimeError.
- **half_open**: After recovery_timeout, one test request is allowed.

### call(func) behavior:
- In **closed** state: execute func normally
- In **open** state: if recovery_timeout has passed, transition to half_open; otherwise raise RuntimeError
- In **half_open** state: execute func; on success → closed + reset failure count; on failure → open
- Consecutive failures increment failure_count; reaching threshold opens circuit
- Any success in closed state resets failure_count to 0

### Key requirement:
- Non-retryable exceptions (those NOT in retryable_exceptions) must NOT be retried
- The decorator should use functools.wraps to preserve metadata
