# Array Utilities Specification

## sliding_window_max(arr, window_size)
Returns the maximum value in each sliding window of the given size.

- Input: `arr` (list of numbers), `window_size` (positive integer)
- Output: List of maximum values, one per window position
- The number of windows should be `len(arr) - window_size + 1`
- If `arr` is empty or `window_size <= 0`, return `[]`
- If `window_size > len(arr)`, return `[max(arr)]`

Examples:
- `sliding_window_max([1, 3, 2, 5, 1, 4], 3)` → `[3, 5, 5, 5]`
- `sliding_window_max([1, 2, 3], 1)` → `[1, 2, 3]`
- `sliding_window_max([5], 1)` → `[5]`

## chunk_list(lst, chunk_size)
Split a list into chunks of the given size. The last chunk may be smaller.

- Input: `lst` (list), `chunk_size` (positive integer)
- Output: List of sublists
- If `lst` is empty or `chunk_size <= 0`, return `[]`

Examples:
- `chunk_list([1, 2, 3, 4, 5], 2)` → `[[1, 2], [3, 4], [5]]`
- `chunk_list([1, 2, 3], 3)` → `[[1, 2, 3]]`

## find_duplicates(arr)
Find all values that appear more than once. Each duplicate value should appear exactly once in the output.

- Input: `arr` (list of hashable values)
- Output: List of duplicate values (each appearing once, in order of first duplicate occurrence)

Examples:
- `find_duplicates([1, 2, 3, 2, 4, 1])` → `[2, 1]`
- `find_duplicates([1, 1, 1, 1])` → `[1]` (not `[1, 1, 1]`)
- `find_duplicates([1, 2, 3])` → `[]`
