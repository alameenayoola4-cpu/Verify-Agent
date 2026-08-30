# LRU Cache with TTL Specification

## LRUCache(capacity, default_ttl=60.0)

A Least Recently Used (LRU) cache with Time To Live (TTL) support.

### get(key) -> value or None
- Returns the cached value if it exists **and has not expired**
- Returns `None` if the key doesn't exist or has expired
- **Expired entries must be removed** from the cache when accessed (lazy deletion)
- Accessing a valid (non-expired) entry marks it as most recently used

### put(key, value, ttl=None)
- Adds or updates a cache entry
- If TTL is not provided, uses the default_ttl
- If the cache is at capacity, evicts the least recently used entry
- Updating an existing key refreshes its TTL

### delete(key) -> bool
- Removes an entry from the cache
- Returns True if the key existed, False otherwise

### size() -> int
- Returns the number of **valid (non-expired)** entries in the cache
- Should not count expired entries

### clear()
- Removes all entries from the cache

### Expected Behavior:
```python
cache = LRUCache(capacity=2, default_ttl=1.0)
cache.put("a", 1)
cache.put("b", 2)
cache.get("a")        # Returns 1
time.sleep(1.1)       # TTL expires
cache.get("a")        # Returns None (expired)
cache.size()          # Returns 0 (both expired)
```
