"""
Case 08: Date Range Calculator — Wrong output for leap years and month boundaries

Date utilities that handle most cases but fail on leap year edge cases
and month boundary calculations.
"""

from datetime import datetime, timedelta


def days_between(date1_str: str, date2_str: str, fmt: str = "%Y-%m-%d") -> int:
    """Calculate the number of days between two dates.
    
    Args:
        date1_str: First date string
        date2_str: Second date string
        fmt: Date format string
    
    Returns:
        Absolute number of days between the two dates
    """
    d1 = datetime.strptime(date1_str, fmt)
    d2 = datetime.strptime(date2_str, fmt)
    return abs((d2 - d1).days)


def add_months(date_str: str, months: int, fmt: str = "%Y-%m-%d") -> str:
    """Add a number of months to a date.
    
    If the resulting day doesn't exist in the target month (e.g., Jan 31 + 1 month),
    clamp to the last day of the target month.
    
    Args:
        date_str: Starting date string
        months: Number of months to add (can be negative)
        fmt: Date format string
    
    Returns:
        The resulting date string
    """
    dt = datetime.strptime(date_str, fmt)
    
    # Calculate new month and year
    total_months = dt.month + months - 1
    new_year = dt.year + total_months // 12
    new_month = total_months % 12 + 1
    
    # When months is negative and total_months goes below 0,
    # Python's // and % handle negatives differently than expected
    # E.g., month=1, months=-1: total_months = -1
    # -1 // 12 = -1 (not 0), -1 % 12 = 11 (not -1)
    # So new_year = year - 1, new_month = 12 — which is actually correct for this case
    # But month=1, months=-13: total_months = -13
    # -13 // 12 = -2, -13 % 12 = 11 → year-2, month 12 — should be year-2, month 12 ✓
    # Actually the math works for negatives in Python! Let me add a different bug...
    
    # Clamp day to valid range for the new month
    import calendar
    max_day = calendar.monthrange(new_year, new_month)[1]
    new_day = min(dt.day, max_day)
    
    result = dt.replace(year=new_year, month=new_month, day=new_day)
    return result.strftime(fmt)


def get_date_range(start_str: str, end_str: str, fmt: str = "%Y-%m-%d") -> list[str]:
    """Generate a list of all dates between start and end (inclusive).
    
    Args:
        start_str: Start date string
        end_str: End date string
        fmt: Date format string
    
    Returns:
        List of date strings from start to end (inclusive)
    """
    start = datetime.strptime(start_str, fmt)
    end = datetime.strptime(end_str, fmt)
    
    if start > end:
        start, end = end, start
    
    dates = []
    current = start
    while current < end:
        dates.append(current.strftime(fmt))
        current += timedelta(days=1)
    
    return dates


def is_business_day(date_str: str, fmt: str = "%Y-%m-%d") -> bool:
    """Check if a date is a business day (Monday-Friday)."""
    dt = datetime.strptime(date_str, fmt)
    return dt.weekday() < 5  # 0=Monday, 4=Friday


def next_business_day(date_str: str, fmt: str = "%Y-%m-%d") -> str:
    """Get the next business day after the given date."""
    dt = datetime.strptime(date_str, fmt)
    dt += timedelta(days=1)
    while dt.weekday() >= 5:
        dt += timedelta(days=1)
    return dt.strftime(fmt)
