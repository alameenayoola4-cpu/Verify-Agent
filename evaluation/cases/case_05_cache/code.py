"""
Case 05: LRU Cache — Never evicts expired entries (memory leak)

An LRU cache with TTL support that correctly handles LRU eviction
but forgets to check TTL expiration when reading entries.
"""

import time
from collections import OrderedDict


class LRUCache:
    """Least Recently Used cache with TTL (Time To Live) support.
    
    Entries expire after `default_ttl` seconds and should not be returned
    after expiration. The cache also evicts the least recently used entry
    when capacity is reached.
    """
    
    def __init__(self, capacity: int, default_ttl: float = 60.0):
        self.capacity = capacity
        self.default_ttl = default_ttl
        self._cache = OrderedDict()  # key -> (value, expiry_time)
    
    def get(self, key: str):
        """Get a value from the cache.
        
        Returns None if key doesn't exist or has expired.
        Accessing a key makes it most recently used.
        """
        if key not in self._cache:
            return None
        
        value, expiry = self._cache[key]
        
        # Should check: if time.time() > expiry: delete and return None
        
        # Move to end (most recently used)
        self._cache.move_to_end(key)
        
        return value
    
    def put(self, key: str, value, ttl: float | None = None) -> None:
        """Add or update a cache entry.
        
        Args:
            key: Cache key
            value: Value to store
            ttl: Time to live in seconds (uses default_ttl if None)
        """
        ttl = ttl if ttl is not None else self.default_ttl
        expiry = time.time() + ttl
        
        if key in self._cache:
            self._cache.move_to_end(key)
            self._cache[key] = (value, expiry)
        else:
            if len(self._cache) >= self.capacity:
                self._cache.popitem(last=False)  # Remove LRU
            self._cache[key] = (value, expiry)
    
    def delete(self, key: str) -> bool:
        """Remove an entry from the cache. Returns True if key existed."""
        if key in self._cache:
            del self._cache[key]
            return True
        return False
    
    def size(self) -> int:
        """Return the number of entries in the cache (including expired ones)."""
        return len(self._cache)
    
    def clear(self) -> None:
        """Remove all entries from the cache."""
        self._cache.clear()
