# Data Transformer Pipeline Specification

## transform_records(records, transformations) -> list[dict]

Applies a sequence of transformations to a list of records (dicts).

### Transformation types:

**rename**: Rename a field
- params: `{"from": "old_name", "to": "new_name"}`
- If the field doesn't exist, skip silently

**compute**: Add a computed field using an expression
- params: `{"field": "total", "expression": "price * quantity"}`
- Expression variables come from the record's fields
- If any referenced field is None, the computed field should be set to None (not silently skipped)
- Should NOT use `eval()` for security reasons — use a safe expression evaluator

**filter**: Keep only records matching a condition
- params: `{"field": "age", "operator": "gt", "value": 18}`
- Operators: eq, neq, gt, lt, gte, lte, contains
- Records with None in the filter field should be KEPT in the result (not silently dropped)
- None should only match "eq None" or "neq <non-None>"

**default**: Set a default value for missing/None fields
- params: `{"field": "status", "value": "active"}`

### Key requirements:
- Never silently drop records — if a transformation fails for a record, keep the record and set the failed field to None or a sensible default
- Compute expressions must be safe (no arbitrary code execution)

## aggregate_records(records, group_by, aggregations) -> list[dict]

Groups records by a field and computes aggregate values.

- `aggregations` maps output field names to `{"field": "...", "func": "sum|avg|count|min|max"}`
- None values in aggregated fields should be **skipped** (not cause errors)
- `sum([1, None, 3])` should return `4` (skip None)
- `avg([1, None, 3])` should return `2.0` (average of non-None values)
- `count` should count all records in the group (including those with None)
