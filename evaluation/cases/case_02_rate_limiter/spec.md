# Rate Limiter Specification

## RateLimiter(max_requests, window_seconds)

A token bucket rate limiter that allows up to `max_requests` requests within each `window_seconds` time window.

### allow_request() -> bool
- Returns `True` if the request is within the rate limit, `False` otherwise
- Increments the internal counter when allowing a request
- When the time window expires (current_time - window_start > window_seconds), the counter must reset to 0 and a new window begins
- After reset, requests should be allowed again up to max_requests

### get_remaining() -> int
- Returns the number of remaining allowed requests in the current window
- Should return 0 if the limit has been reached

### get_retry_after() -> float
- Returns the number of seconds until the current window expires
- Returns 0 if the window has already expired

### Expected Behavior Example:
```
limiter = RateLimiter(max_requests=3, window_seconds=1.0)
limiter.allow_request()  # True (1/3)
limiter.allow_request()  # True (2/3)
limiter.allow_request()  # True (3/3)
limiter.allow_request()  # False (limit reached)
time.sleep(1.1)          # window expires
limiter.allow_request()  # True (counter reset, 1/3 in new window)
```
