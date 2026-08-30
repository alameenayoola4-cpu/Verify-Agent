"""
Case 07: Retry with Exponential Backoff — Infinite loop on permanent failures

A retry decorator that loops forever if max_retries is not properly enforced.
"""

import time
import random


def retry_with_backoff(
    func,
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 30.0,
    jitter: bool = True,
    retryable_exceptions: tuple = (Exception,),
):
    """Execute a function with exponential backoff retry logic.
    
    Args:
        func: Callable to execute
        max_retries: Maximum number of retry attempts
        base_delay: Initial delay in seconds
        max_delay: Maximum delay between retries
        jitter: Add random jitter to prevent thundering herd
        retryable_exceptions: Tuple of exception types to retry on
    
    Returns:
        The return value of func() on success
    
    Raises:
        The last exception if all retries are exhausted
    """
    attempt = 0
    last_exception = None
    
    while True:
        try:
            return func()
        except retryable_exceptions as e:
            last_exception = e
            attempt += 1
            
            if attempt > max_retries:
                break
            
            # Calculate delay with exponential backoff
            delay = min(base_delay * (2 ** (attempt - 1)), max_delay)
            
            if jitter:
                delay = delay * (0.5 + random.random() * 0.5)
            
            time.sleep(delay)
    
    raise last_exception


def retry_decorator(max_retries=3, base_delay=0.1):
    """Decorator version of retry_with_backoff."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            return retry_with_backoff(
                lambda: func(*args, **kwargs),
                max_retries=max_retries,
                base_delay=base_delay,
            )
        return wrapper
    return decorator


class CircuitBreaker:
    """Simple circuit breaker pattern.
    
    Opens the circuit after `failure_threshold` consecutive failures.
    Allows a retry after `recovery_timeout` seconds.
    """
    
    def __init__(self, failure_threshold: int = 5, recovery_timeout: float = 30.0):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "closed"  # closed = normal, open = failing, half_open = testing
    
    def call(self, func):
        """Execute func through the circuit breaker."""
        if self.state == "open":
            if self.last_failure_time and \
               time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = "half_open"
            else:
                raise RuntimeError("Circuit breaker is open")
        
        try:
            result = func()
            if self.state == "half_open":
                self.state = "closed"
            self.failure_count = 0  # Actually this is here, but...
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            
            if self.failure_count >= self.failure_threshold:
                self.state = "open"
            
            raise
