"""
Case 10: Data Transformer Pipeline — Silently drops records with null fields

An ETL-style data pipeline that processes records but silently drops
any record containing a None/null field instead of handling them properly.
"""


def transform_records(
    records: list[dict],
    transformations: list[dict],
) -> list[dict]:
    """Apply a sequence of transformations to a list of records.
    
    Args:
        records: List of dictionaries to transform
        transformations: List of transformation specs, each with:
            - type: "rename", "compute", "filter", "default"
            - params: transformation-specific parameters
    
    Returns:
        Transformed list of records
    """
    result = [dict(r) for r in records]  # shallow copy
    
    for transform in transformations:
        t_type = transform.get("type")
        params = transform.get("params", {})
        
        if t_type == "rename":
            # Rename a field
            old_name = params["from"]
            new_name = params["to"]
            for record in result:
                if old_name in record:
                    record[new_name] = record.pop(old_name)
        
        elif t_type == "compute":
            # Add a computed field
            field = params["field"]
            expression = params["expression"]  # e.g., "price * quantity"
            for record in result:
                try:
                    # crashes on None values instead of handling them
                    record[field] = eval(expression, {"__builtins__": {}}, record)
                except Exception:
                    pass
        
        elif t_type == "filter":
            # Filter records matching a condition
            field = params["field"]
            operator = params["operator"]
            value = params["value"]
            
            filtered = []
            for record in result:
                record_value = record.get(field)
                
                # or produce wrong results (None < 5 raises TypeError in Python 3)
                try:
                    if operator == "eq" and record_value == value:
                        filtered.append(record)
                    elif operator == "neq" and record_value != value:
                        filtered.append(record)
                    elif operator == "gt" and record_value > value:
                        filtered.append(record)
                    elif operator == "lt" and record_value < value:
                        filtered.append(record)
                    elif operator == "gte" and record_value >= value:
                        filtered.append(record)
                    elif operator == "lte" and record_value <= value:
                        filtered.append(record)
                    elif operator == "contains" and value in str(record_value):
                        filtered.append(record)
                except TypeError:
                    # during comparison, instead of being included/excluded
                    # based on a defined null-handling policy
                    pass
            
            result = filtered
        
        elif t_type == "default":
            # Set default values for missing/None fields
            field = params["field"]
            default_value = params["value"]
            for record in result:
                if field not in record or record[field] is None:
                    record[field] = default_value
    
    return result


def aggregate_records(
    records: list[dict],
    group_by: str,
    aggregations: dict,
) -> list[dict]:
    """Group records and compute aggregations.
    
    Args:
        records: List of dicts
        group_by: Field name to group by
        aggregations: dict mapping output field names to {"field": ..., "func": "sum"|"avg"|"count"|"min"|"max"}
    
    Returns:
        List of grouped/aggregated records
    """
    groups = {}
    for record in records:
        key = record.get(group_by)
        if key not in groups:
            groups[key] = []
        groups[key].append(record)
    
    result = []
    for key, group_records in groups.items():
        row = {group_by: key}
        
        for output_field, agg_spec in aggregations.items():
            field = agg_spec["field"]
            func = agg_spec["func"]
            
            values = [r.get(field) for r in group_records]
            # sum([1, None, 3]) raises TypeError
            
            try:
                if func == "sum":
                    row[output_field] = sum(values)
                elif func == "avg":
                    row[output_field] = sum(values) / len(values)
                elif func == "count":
                    row[output_field] = len(values)
                elif func == "min":
                    row[output_field] = min(values)
                elif func == "max":
                    row[output_field] = max(values)
            except (TypeError, ZeroDivisionError):
                row[output_field] = None
                                          # computing on non-None values
        
        result.append(row)
    
    return result
