# Date Range Calculator Specification

## days_between(date1_str, date2_str, fmt="%Y-%m-%d") -> int
Returns the absolute number of days between two dates.

## add_months(date_str, months, fmt="%Y-%m-%d") -> str
Adds months to a date. Handles month-end clamping.
- `add_months("2024-01-31", 1)` → `"2024-02-29"` (leap year, clamp to month end)
- `add_months("2023-01-31", 1)` → `"2023-02-28"` (non-leap, clamp)
- `add_months("2024-03-15", -1)` → `"2024-02-15"` (negative months)

## get_date_range(start_str, end_str, fmt="%Y-%m-%d") -> list[str]
Returns all dates from start to end, **inclusive of both endpoints**.
- `get_date_range("2024-01-01", "2024-01-03")` → `["2024-01-01", "2024-01-02", "2024-01-03"]`
- If start > end, swap them so the range is always ascending
- `get_date_range("2024-02-28", "2024-03-01")` → `["2024-02-28", "2024-02-29", "2024-03-01"]` (leap year)

## is_business_day(date_str) -> bool
Returns True if the date is Monday–Friday.

## next_business_day(date_str) -> str
Returns the next business day strictly after the given date.
- If given a Friday, returns the following Monday
- If given a Saturday, returns Monday
- If given a weekday, returns the next day (if it's a weekday)
