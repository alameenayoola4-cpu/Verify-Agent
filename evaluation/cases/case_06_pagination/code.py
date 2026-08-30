"""
Case 06: Pagination Helper — Returns duplicate items at page boundaries

A pagination utility that calculates offsets incorrectly, causing
items to appear on two consecutive pages.
"""


def paginate(items: list, page: int, page_size: int) -> dict:
    """Paginate a list of items.
    
    Args:
        items: The full list to paginate
        page: The page number (1-indexed)
        page_size: Number of items per page
    
    Returns:
        dict with:
            - items: list of items for the requested page
            - page: current page number
            - page_size: items per page
            - total_items: total number of items
            - total_pages: total number of pages
            - has_next: bool
            - has_previous: bool
    """
    if not items or page_size <= 0:
        return {
            "items": [],
            "page": 1,
            "page_size": page_size,
            "total_items": 0,
            "total_pages": 0,
            "has_next": False,
            "has_previous": False,
        }
    
    total_items = len(items)
    total_pages = (total_items + page_size - 1) // page_size
    
    # Clamp page to valid range
    page = max(1, min(page, total_pages))
    
    # For page=1, page_size=10: start should be 0, but (1-1)*10 = 0 ✓
    # For page=2, page_size=10: start should be 10, but (2-1)*10 = 10 ✓
    # Actually the start is correct, but end is inclusive causing overlap
    start = (page - 1) * page_size
    end = start + page_size  # This is correct for Python slicing
    
    page_items = items[start:end]
    
    return {
        "items": page_items,
        "page": page,
        "page_size": page_size,
        "total_items": total_items,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_previous": page > 1,
    }


def paginate_with_cursor(items: list, cursor: int | None, limit: int) -> dict:
    """Cursor-based pagination.
    
    Args:
        items: The full sorted list
        cursor: The index to start from (None for beginning)
        limit: Maximum number of items to return
    
    Returns:
        dict with items, next_cursor, has_more
    """
    if not items or limit <= 0:
        return {"items": [], "next_cursor": None, "has_more": False}
    
    start = cursor if cursor is not None else 0
    
    # If cursor > len(items), should return empty
    
    end = start + limit
    page_items = items[start:end]
    
    has_more = end < len(items)
    next_cursor = end if has_more else None
    
    return {
        "items": page_items,
        "next_cursor": next_cursor,
        "has_more": has_more,
    }
