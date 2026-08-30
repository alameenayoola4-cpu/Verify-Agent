# CSV Parser Specification

## parse_csv(text, delimiter=",") -> list[list[str]]

Parses a CSV string following RFC 4180 conventions.

### Rules:
1. Fields are separated by the delimiter (default: comma)
2. Rows are separated by newlines (\n or \r\n)
3. Fields may be enclosed in double quotes
4. Quoted fields can contain the delimiter, newlines, and escaped quotes
5. Escaped quotes within quoted fields use doubled quotes: `""` → `"`
6. Empty fields are valid: `"a,,b"` → `["a", "", "b"]`
7. Trailing delimiter means an empty last field: `"a,b,"` → `["a", "b", ""]`
8. Trailing newline does NOT add an empty row
9. Empty string input returns `[]`

### Examples:
- `parse_csv("a,b,c\n1,2,3")` → `[["a","b","c"], ["1","2","3"]]`
- `parse_csv('"has,comma","normal"')` → `[["has,comma", "normal"]]`
- `parse_csv('"say ""hi""",b')` → `[['say "hi"', "b"]]`
- `parse_csv("a,b,\n1,2,3")` → `[["a","b",""], ["1","2","3"]]`

## csv_to_dict(text, delimiter=",") -> list[dict]

Parses CSV with the first row as headers.

### Rules:
1. First row is used as dictionary keys
2. Subsequent rows are converted to dicts mapping header → value
3. If a row has fewer fields than headers, missing values should be set to empty string `""`
4. If a row has more fields than headers, extra fields should be preserved (not silently dropped)
5. Returns empty list if there are no data rows (only headers or empty input)

### Examples:
- `csv_to_dict("name,age\nAlice,30")` → `[{"name": "Alice", "age": "30"}]`
- `csv_to_dict("a,b\n1")` → `[{"a": "1", "b": ""}]`
