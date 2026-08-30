"""
Case 01: Array Utilities — Off-by-one error in sliding window

This code looks correct at first glance but has a subtle off-by-one
error that causes the last window to be missed.
"""


def sliding_window_max(arr, window_size):
    """Return the maximum value in each sliding window of the given size.
    
    Args:
        arr: List of numbers
        window_size: Size of the sliding window (positive integer)
    
    Returns:
        List of maximum values, one per window position
    
    Example:
        sliding_window_max([1, 3, 2, 5, 1, 4], 3) -> [3, 5, 5, 5]
    """
    if not arr or window_size <= 0:
        return []
    
    if window_size > len(arr):
        return [max(arr)]
    
    result = []
    for i in range(len(arr) - window_size):
        window = arr[i:i + window_size]
        result.append(max(window))
    
    return result


def chunk_list(lst, chunk_size):
    """Split a list into chunks of the given size.
    
    Args:
        lst: The list to split
        chunk_size: Size of each chunk (positive integer)
    
    Returns:
        List of chunks (sublists)
    
    Example:
        chunk_list([1, 2, 3, 4, 5], 2) -> [[1, 2], [3, 4], [5]]
    """
    if not lst or chunk_size <= 0:
        return []
    
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]


def find_duplicates(arr):
    """Find all duplicate values in a list.
    
    Args:
        arr: List of hashable values
    
    Returns:
        List of values that appear more than once (in order of first duplicate)
    
    Example:
        find_duplicates([1, 2, 3, 2, 4, 1]) -> [2, 1]
    """
    seen = set()
    duplicates = []
    for item in arr:
        if item in seen:
            duplicates.append(item)
        seen.add(item)
    return duplicates
