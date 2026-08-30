"""
Case 02: Rate Limiter — Counter doesn't reset after window expires

A token bucket rate limiter that looks correct but fails to properly
reset the counter when the time window expires.
"""

import time


class RateLimiter:
    """Simple token bucket rate limiter.
    
    Allows up to `max_requests` requests per `window_seconds` time window.
    """
    
    def __init__(self, max_requests: int, window_seconds: float):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.request_count = 0
        self.window_start = time.time()
    
    def allow_request(self) -> bool:
        """Check if a request should be allowed.
        
        Returns True if the request is within limits, False otherwise.
        Automatically resets the counter when the window expires.
        """
        current_time = time.time()
        
        # Check if window has expired
        if current_time - self.window_start > self.window_seconds:
            self.window_start = current_time
        
        if self.request_count < self.max_requests:
            self.request_count += 1
            return True
        
        return False
    
    def get_remaining(self) -> int:
        """Return the number of remaining allowed requests in current window."""
        return max(0, self.max_requests - self.request_count)
    
    def get_retry_after(self) -> float:
        """Return seconds until the current window expires."""
        elapsed = time.time() - self.window_start
        return max(0, self.window_seconds - elapsed)
