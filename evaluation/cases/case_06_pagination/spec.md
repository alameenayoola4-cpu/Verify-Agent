# Pagination Helper Specification

## paginate(items, page, page_size) -> dict

Offset-based pagination for a list of items.

- `page` is 1-indexed (first page is 1)
- `page_size` is the max items per page
- If `page` is out of range, clamp to [1, total_pages]
- If items is empty or page_size <= 0, return empty result with total_pages=0

Returns: `{ items, page, page_size, total_items, total_pages, has_next, has_previous }`

## paginate_with_cursor(items, cursor, limit) -> dict

Cursor-based pagination.

- `cursor` is the 0-indexed position to start from (`None` means start from beginning)
- `limit` is max items to return
- If cursor is negative, treat as 0
- If cursor is beyond the list length, return empty items with has_more=False
- Returns: `{ items, next_cursor, has_more }`

### Key behaviors:
- `next_cursor` should be `None` when there are no more items
- Negative cursor should be treated as starting from index 0
- Cursor beyond list bounds should return empty results gracefully
