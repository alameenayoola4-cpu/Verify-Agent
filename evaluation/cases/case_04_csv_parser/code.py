"""
Case 04: CSV Parser — Breaks on quoted fields containing commas

A simple CSV parser that handles basic cases but fails on
RFC 4180 compliant quoted fields.
"""


def parse_csv(text: str, delimiter: str = ",") -> list[list[str]]:
    """Parse a CSV string into a list of rows (each row is a list of fields).
    
    Handles:
        - Basic comma-separated values
        - Quoted fields (fields wrapped in double quotes)
        - Quoted fields containing the delimiter
        - Escaped quotes within quoted fields (doubled: "")
        - Empty fields
        - Newlines within quoted fields
    
    Args:
        text: The CSV string to parse
        delimiter: The field separator (default: comma)
    
    Returns:
        List of rows, where each row is a list of string fields
    """
    if not text:
        return []
    
    rows = []
    current_row = []
    current_field = ""
    in_quotes = False
    i = 0
    
    while i < len(text):
        char = text[i]
        
        if char == '"':
            if in_quotes:
                # Check for escaped quote
                if i + 1 < len(text) and text[i + 1] == '"':
                    current_field += '"'
                    i += 2
                    continue
                else:
                    in_quotes = False
            else:
                in_quotes = True
        elif char == delimiter and not in_quotes:
            current_row.append(current_field)
            current_field = ""
        elif char == '\n' and not in_quotes:
            current_row.append(current_field)
            rows.append(current_row)
            current_row = []
            current_field = ""
        elif char == '\r' and not in_quotes:
            # Skip \r, handle \r\n
            if i + 1 < len(text) and text[i + 1] == '\n':
                i += 1
            current_row.append(current_field)
            rows.append(current_row)
            current_row = []
            current_field = ""
        else:
            current_field += char
        
        i += 1
    
    # Don't forget the last field/row
    if current_field or current_row:
        current_row.append(current_field)
        rows.append(current_row)
    
    # but if the last row is empty (just a newline), it gets dropped.
    # Also BUG: doesn't handle the case where the last field is empty 
    # (trailing delimiter) — e.g., "a,b," should give ["a", "b", ""]
    # The current logic handles trailing delimiter but drops empty last rows
    
    return rows


def csv_to_dict(text: str, delimiter: str = ",") -> list[dict]:
    """Parse CSV with headers into a list of dictionaries.
    
    The first row is treated as headers.
    
    Args:
        text: CSV string with header row
        delimiter: Field separator
    
    Returns:
        List of dicts mapping header names to field values
    """
    rows = parse_csv(text, delimiter)
    
    if len(rows) < 2:
        return []
    
    headers = rows[0]
    result = []
    
    for row in rows[1:]:
        record = {}
        for j, header in enumerate(headers):
            if j < len(row):
                record[header] = row[j]
        result.append(record)
    
    return result
