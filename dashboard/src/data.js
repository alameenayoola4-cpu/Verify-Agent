// AUTO-GENERATED DATA MODULE
// Run python build_data.py to update this file with the latest results.

export const caseMetadata = [
  {
    "id": "case_01_array_utils",
    "name": "Array Utilities",
    "bugType": "off-by-one",
    "severity": "medium"
  },
  {
    "id": "case_02_rate_limiter",
    "name": "Rate Limiter",
    "bugType": "state bug",
    "severity": "high"
  },
  {
    "id": "case_03_password_validator",
    "name": "Password Validator",
    "bugType": "unicode bypass",
    "severity": "high"
  },
  {
    "id": "case_04_csv_parser",
    "name": "CSV Parser",
    "bugType": "quoted fields",
    "severity": "medium"
  },
  {
    "id": "case_05_cache",
    "name": "Cache",
    "bugType": "memory leak",
    "severity": "high"
  },
  {
    "id": "case_06_pagination",
    "name": "Pagination",
    "bugType": "boundary dupes",
    "severity": "medium"
  },
  {
    "id": "case_07_retry",
    "name": "Retry Handler",
    "bugType": "infinite loop",
    "severity": "critical"
  },
  {
    "id": "case_08_date_utils",
    "name": "Date Utilities",
    "bugType": "leap year",
    "severity": "medium"
  },
  {
    "id": "case_09_permissions",
    "name": "Permissions",
    "bugType": "privilege escalation",
    "severity": "critical"
  },
  {
    "id": "case_10_data_transformer",
    "name": "Data Transformer",
    "bugType": "silent null drops",
    "severity": "high"
  }
];

export const scores = {
  "baseline": {
    "total_true_bugs": 16,
    "total_found": 19,
    "true_positives": 15,
    "false_positives": 4,
    "false_negatives": 1,
    "precision": 0.789,
    "recall": 0.938,
    "f1_score": 0.857,
    "fix_attempts": 0,
    "fix_successes": 0,
    "fix_success_rate": 0
  },
  "agent": {
    "total_true_bugs": 16,
    "total_found": 16,
    "true_positives": 9,
    "false_positives": 7,
    "false_negatives": 7,
    "precision": 0.562,
    "recall": 0.562,
    "f1_score": 0.562,
    "fix_attempts": 10,
    "fix_successes": 10,
    "fix_success_rate": 1.0
  },
  "improvement": {
    "precision_gain": -0.227,
    "recall_gain": -0.376,
    "f1_gain": -0.295,
    "precision_pct": "+-29%",
    "recall_pct": "+-40%"
  }
};

export const baselineResults = [
  {
    "case_id": "case_01_array_utils",
    "bugs_found": [
      {
        "description": "Off-by-one error in `range(len(arr) - window_size)` causes the last sliding window to be omitted from the results. It should be `range(len(arr) - window_size + 1)`.",
        "severity": "high",
        "location": "sliding_window_max"
      },
      {
        "description": "`find_duplicates` appends an item to the output list every time it is seen after its first occurrence, causing elements appearing 3 or more times to be duplicated in the result instead of appearing exactly once.",
        "severity": "high",
        "location": "find_duplicates"
      }
    ],
    "bug_count": 2,
    "review_text": "{\n  \"bugs\": [\n    {\n      \"description\": \"Off-by-one error in `range(len(arr) - window_size)` causes the last sliding window to be omitted from the results. It should be `range(len(arr) - window_size + 1)`.\",\n      \"severity\": \"high\",\n      \"location\": \"sliding_window_max\"\n    },\n    {\n      \"description\": \"`find_duplicates` appends an item to the output list every time it is seen after its first occurrence, causing elements appearing 3 or more times to be duplicated in the result instead of appearing exactly once.\",\n      \"severity\": \"high\",\n      \"location\": \"find_duplicates\"\n    }\n  ],\n  \"overall_assessment\": \"has_significant_bugs\",\n  \"review_summary\": \"The implementation contains two significant bugs: `sliding_window_max` misses the last window due to an off-by-one range limit, and `find_duplicates` returns repeated elements in the output when values appear more than twice.\"\n}",
    "total_time_seconds": 7.59,
    "trajectory": [
      {
        "timestamp": "2026-08-28T16:40:21Z",
        "model": "gemini-3.6-flash",
        "system_instruction": null,
        "prompt_preview": "Review the following Python code against its specification.\nIdentify any bugs, issues, or potential problems.\n\n## SPECIFICATION (what the code should do):\n# Array Utilities Specification\n\n## sliding_window_max(arr, window_size)\nReturns the maximum value in each sliding window of the given size.\n\n- I...",
        "prompt_length": 3880,
        "response_preview": "{\n  \"bugs\": [\n    {\n      \"description\": \"Off-by-one error in `range(len(arr) - window_size)` causes the last sliding window to be omitted from the results. It should be `range(len(arr) - window_size + 1)`.\",\n      \"severity\": \"high\",\n      \"location\": \"sliding_window_max\"\n    },\n    {\n      \"descri...",
        "response_length": 893,
        "latency_seconds": 7.59,
        "temperature": 0.1
      }
    ]
  },
  {
    "case_id": "case_02_rate_limiter",
    "bugs_found": [
      {
        "description": "In `allow_request()`, `self.request_count` is not reset to 0 when the window expires. `self.window_start` is updated, but `self.request_count` remains unchanged. Once `max_requests` is reached, all subsequent requests in future windows will be denied indefinitely.",
        "severity": "critical",
        "location": "allow_request"
      },
      {
        "description": "`get_remaining()` does not check whether the current time window has expired. If the window has expired, it returns remaining requests based on the stale `request_count` rather than returning `max_requests` for the expired window.",
        "severity": "medium",
        "location": "get_remaining"
      }
    ],
    "bug_count": 2,
    "review_text": "{\n  \"bugs\": [\n    {\n      \"description\": \"In `allow_request()`, `self.request_count` is not reset to 0 when the window expires. `self.window_start` is updated, but `self.request_count` remains unchanged. Once `max_requests` is reached, all subsequent requests in future windows will be denied indefinitely.\",\n      \"severity\": \"critical\",\n      \"location\": \"allow_request\"\n    },\n    {\n      \"description\": \"`get_remaining()` does not check whether the current time window has expired. If the window has expired, it returns remaining requests based on the stale `request_count` rather than returning `max_requests` for the expired window.\",\n      \"severity\": \"medium\",\n      \"location\": \"get_remaining\"\n    }\n  ],\n  \"overall_assessment\": \"has_significant_bugs\",\n  \"review_summary\": \"The rate limiter fails to reset `request_count` to 0 when a time window expires in `allow_request()`, permanently blocking future requests after reaching the limit. Additionally, `get_remaining()` does not evaluate window expiration when reporting available requests.\"\n}",
    "total_time_seconds": 68.28,
    "trajectory": [
      {
        "timestamp": "2026-08-28T16:41:29Z",
        "model": "gemini-3.6-flash",
        "system_instruction": null,
        "prompt_preview": "Review the following Python code against its specification.\nIdentify any bugs, issues, or potential problems.\n\n## SPECIFICATION (what the code should do):\n# Rate Limiter Specification\n\n## RateLimiter(max_requests, window_seconds)\n\nA token bucket rate limiter that allows up to `max_requests` requests...",
        "prompt_length": 3427,
        "response_preview": "{\n  \"bugs\": [\n    {\n      \"description\": \"In `allow_request()`, `self.request_count` is not reset to 0 when the window expires. `self.window_start` is updated, but `self.request_count` remains unchanged. Once `max_requests` is reached, all subsequent requests in future windows will be denied indefin...",
        "response_length": 1053,
        "latency_seconds": 68.28,
        "temperature": 0.1
      }
    ]
  },
  {
    "case_id": "case_03_password_validator",
    "bugs_found": [
      {
        "description": "The whitespace check only tests for space characters (`' ' in password`) instead of all whitespace characters (e.g., tabs `\\t`, newlines `\\n`, carriage returns `\\r`). This fails requirement 7 and allows passwords containing tabs or other non-space whitespace characters to be considered valid.",
        "severity": "medium",
        "location": "validate_password, line 48"
      }
    ],
    "bug_count": 1,
    "review_text": "{\n  \"bugs\": [\n    {\n      \"description\": \"The whitespace check only tests for space characters (`' ' in password`) instead of all whitespace characters (e.g., tabs `\\\\t`, newlines `\\\\n`, carriage returns `\\\\r`). This fails requirement 7 and allows passwords containing tabs or other non-space whitespace characters to be considered valid.\",\n      \"severity\": \"medium\",\n      \"location\": \"validate_password, line 48\"\n    }\n  ],\n  \"overall_assessment\": \"has_minor_issues\",\n  \"review_summary\": \"The password validator implements most complexity requirements correctly, but fails to properly enforce the whitespace constraint. It only checks for literal space characters rather than all whitespace characters (such as tabs and newlines).\"\n}",
    "total_time_seconds": 25.76,
    "trajectory": [
      {
        "timestamp": "2026-08-28T16:41:55Z",
        "model": "gemini-3.6-flash",
        "system_instruction": null,
        "prompt_preview": "Review the following Python code against its specification.\nIdentify any bugs, issues, or potential problems.\n\n## SPECIFICATION (what the code should do):\n# Password Validator Specification\n\n## validate_password(password: str) -> dict\n\nValidates a password against the following security requirements...",
        "prompt_length": 3946,
        "response_preview": "{\n  \"bugs\": [\n    {\n      \"description\": \"The whitespace check only tests for space characters (`' ' in password`) instead of all whitespace characters (e.g., tabs `\\\\t`, newlines `\\\\n`, carriage returns `\\\\r`). This fails requirement 7 and allows passwords containing tabs or other non-space whitesp...",
        "response_length": 736,
        "latency_seconds": 25.76,
        "temperature": 0.1
      }
    ]
  },
  {
    "case_id": "case_04_csv_parser",
    "bugs_found": [
      {
        "description": "csv_to_dict fails to set missing values to empty strings when a row has fewer fields than headers. Instead of setting record[header] = \"\", it omits the key entirely.",
        "severity": "high",
        "location": "csv_to_dict (lines 115-117)"
      },
      {
        "description": "csv_to_dict silently drops extra fields when a row contains more fields than headers. The function only iterates over headers and ignores row elements at indices greater than or equal to len(headers).",
        "severity": "high",
        "location": "csv_to_dict (lines 114-118)"
      },
      {
        "description": "parse_csv returns [] instead of [[\"\"]] when the input is a single empty quoted string '\"\"'. After parsing '\"\"', current_field is \"\" and current_row is [], causing the post-loop check `if current_field or current_row:` to evaluate to False.",
        "severity": "medium",
        "location": "parse_csv (lines 80-83)"
      }
    ],
    "bug_count": 3,
    "review_text": "{\n  \"bugs\": [\n    {\n      \"description\": \"csv_to_dict fails to set missing values to empty strings when a row has fewer fields than headers. Instead of setting record[header] = \\\"\\\", it omits the key entirely.\",\n      \"severity\": \"high\",\n      \"location\": \"csv_to_dict (lines 115-117)\"\n    },\n    {\n      \"description\": \"csv_to_dict silently drops extra fields when a row contains more fields than headers. The function only iterates over headers and ignores row elements at indices greater than or equal to len(headers).\",\n      \"severity\": \"high\",\n      \"location\": \"csv_to_dict (lines 114-118)\"\n    },\n    {\n      \"description\": \"parse_csv returns [] instead of [[\\\"\\\"]] when the input is a single empty quoted string '\\\"\\\"'. After parsing '\\\"\\\"', current_field is \\\"\\\" and current_row is [], causing the post-loop check `if current_field or current_row:` to evaluate to False.\",\n      \"severity\": \"medium\",\n      \"location\": \"parse_csv (lines 80-83)\"\n    }\n  ],\n  \"overall_assessment\": \"has_significant_bugs\",\n  \"review_summary\": \"The CSV parser implementation handles most quote-escaping and delimiter scenarios correctly, but csv_to_dict fails to handle rows with mismatched column counts relative to headers (violating rules 3 and 4 of the specification). Additionally, parse_csv incorrectly drops standalone empty quoted fields ('\\\"\\\"').\"\n}",
    "total_time_seconds": 125.05,
    "trajectory": [
      {
        "timestamp": "2026-08-28T16:38:38Z",
        "model": "gemini-3.6-flash",
        "system_instruction": null,
        "prompt_preview": "Review the following Python code against its specification.\nIdentify any bugs, issues, or potential problems.\n\n## SPECIFICATION (what the code should do):\n# CSV Parser Specification\n\n## parse_csv(text, delimiter=\",\") -> list[list[str]]\n\nParses a CSV string following RFC 4180 conventions.\n\n### Rules:...",
        "prompt_length": 5785,
        "response_preview": "{\n  \"bugs\": [\n    {\n      \"description\": \"csv_to_dict fails to set missing values to empty strings when a row has fewer fields than headers. Instead of setting record[header] = \\\"\\\", it omits the key entirely.\",\n      \"severity\": \"high\",\n      \"location\": \"csv_to_dict (lines 115-117)\"\n    },\n    {\n ...",
        "response_length": 1348,
        "latency_seconds": 125.05,
        "temperature": 0.1
      }
    ]
  },
  {
    "case_id": "case_05_cache",
    "bugs_found": [
      {
        "description": "get() does not check if the cached item has expired. It returns expired values and refreshes their LRU position instead of deleting expired items and returning None.",
        "severity": "critical",
        "location": "get method (lines 32-42)"
      },
      {
        "description": "size() returns the total count of items in the underlying dictionary, including expired entries, violating the requirement to count only valid (non-expired) entries.",
        "severity": "high",
        "location": "size method (lines 66-68)"
      }
    ],
    "bug_count": 2,
    "review_text": "{\n  \"bugs\": [\n    {\n      \"description\": \"get() does not check if the cached item has expired. It returns expired values and refreshes their LRU position instead of deleting expired items and returning None.\",\n      \"severity\": \"critical\",\n      \"location\": \"get method (lines 32-42)\"\n    },\n    {\n      \"description\": \"size() returns the total count of items in the underlying dictionary, including expired entries, violating the requirement to count only valid (non-expired) entries.\",\n      \"severity\": \"high\",\n      \"location\": \"size method (lines 66-68)\"\n    }\n  ],\n  \"overall_assessment\": \"has_significant_bugs\",\n  \"review_summary\": \"The implementation fails to enforce TTL expiration during get() operations and size() queries. Expired items are neither filtered out nor lazily deleted when accessed, leading to stale data access and incorrect cache size reporting.\"\n}",
    "total_time_seconds": 23.02,
    "trajectory": [
      {
        "timestamp": "2026-08-28T16:39:01Z",
        "model": "gemini-3.6-flash",
        "system_instruction": null,
        "prompt_preview": "Review the following Python code against its specification.\nIdentify any bugs, issues, or potential problems.\n\n## SPECIFICATION (what the code should do):\n# LRU Cache with TTL Specification\n\n## LRUCache(capacity, default_ttl=60.0)\n\nA Least Recently Used (LRU) cache with Time To Live (TTL) support.\n\n...",
        "prompt_length": 4315,
        "response_preview": "{\n  \"bugs\": [\n    {\n      \"description\": \"get() does not check if the cached item has expired. It returns expired values and refreshes their LRU position instead of deleting expired items and returning None.\",\n      \"severity\": \"critical\",\n      \"location\": \"get method (lines 32-42)\"\n    },\n    {\n  ...",
        "response_length": 875,
        "latency_seconds": 23.02,
        "temperature": 0.1
      }
    ]
  },
  {
    "case_id": "case_06_pagination",
    "bugs_found": [
      {
        "description": "Negative cursor values are not converted/treated as 0 in `paginate_with_cursor`. This causes Python slice indexing to use negative indices relative to the end of the list rather than starting from index 0 as required by the specification.",
        "severity": "high",
        "location": "paginate_with_cursor (line 92)"
      }
    ],
    "bug_count": 1,
    "review_text": "{\n  \"bugs\": [\n    {\n      \"description\": \"Negative cursor values are not converted/treated as 0 in `paginate_with_cursor`. This causes Python slice indexing to use negative indices relative to the end of the list rather than starting from index 0 as required by the specification.\",\n      \"severity\": \"high\",\n      \"location\": \"paginate_with_cursor (line 92)\"\n    }\n  ],\n  \"overall_assessment\": \"has_minor_issues\",\n  \"review_summary\": \"`paginate` functions correctly according to the specification. However, `paginate_with_cursor` fails to handle negative `cursor` values, which should be treated as index 0 per the specification but instead trigger Python's negative list slicing behavior.\"\n}",
    "total_time_seconds": 18.86,
    "trajectory": [
      {
        "timestamp": "2026-08-28T16:39:20Z",
        "model": "gemini-3.6-flash",
        "system_instruction": null,
        "prompt_preview": "Review the following Python code against its specification.\nIdentify any bugs, issues, or potential problems.\n\n## SPECIFICATION (what the code should do):\n# Pagination Helper Specification\n\n## paginate(items, page, page_size) -> dict\n\nOffset-based pagination for a list of items.\n\n- `page` is 1-index...",
        "prompt_length": 4337,
        "response_preview": "{\n  \"bugs\": [\n    {\n      \"description\": \"Negative cursor values are not converted/treated as 0 in `paginate_with_cursor`. This causes Python slice indexing to use negative indices relative to the end of the list rather than starting from index 0 as required by the specification.\",\n      \"severity\":...",
        "response_length": 693,
        "latency_seconds": 18.86,
        "temperature": 0.1
      }
    ]
  },
  {
    "case_id": "case_07_retry",
    "bugs_found": [
      {
        "description": "CircuitBreaker does not set state back to 'open' on failure when in 'half_open' state. Instead, it increments failure_count, leaving state as 'half_open' if failure_count < failure_threshold, which allows subsequent requests to bypass the recovery timeout.",
        "severity": "high",
        "location": "CircuitBreaker.call"
      },
      {
        "description": "retry_decorator does not use @functools.wraps(func) on the wrapper function, failing to preserve the decorated function's name, docstring, and metadata as specified.",
        "severity": "medium",
        "location": "retry_decorator"
      }
    ],
    "bug_count": 2,
    "review_text": "{\n  \"bugs\": [\n    {\n      \"description\": \"CircuitBreaker does not set state back to 'open' on failure when in 'half_open' state. Instead, it increments failure_count, leaving state as 'half_open' if failure_count < failure_threshold, which allows subsequent requests to bypass the recovery timeout.\",\n      \"severity\": \"high\",\n      \"location\": \"CircuitBreaker.call\"\n    },\n    {\n      \"description\": \"retry_decorator does not use @functools.wraps(func) on the wrapper function, failing to preserve the decorated function's name, docstring, and metadata as specified.\",\n      \"severity\": \"medium\",\n      \"location\": \"retry_decorator\"\n    }\n  ],\n  \"overall_assessment\": \"has_significant_bugs\",\n  \"review_summary\": \"The retry implementation functions as expected, but retry_decorator fails to preserve function metadata via functools.wraps. Crucially, CircuitBreaker has a logic bug in its state machine where a failure in the half_open state does not immediately transition the circuit back to open.\"\n}",
    "total_time_seconds": 19.6,
    "trajectory": [
      {
        "timestamp": "2026-08-28T16:39:40Z",
        "model": "gemini-3.6-flash",
        "system_instruction": null,
        "prompt_preview": "Review the following Python code against its specification.\nIdentify any bugs, issues, or potential problems.\n\n## SPECIFICATION (what the code should do):\n# Retry with Backoff Specification\n\n## retry_with_backoff(func, max_retries=3, base_delay=1.0, max_delay=30.0, jitter=True, retryable_exceptions=...",
        "prompt_length": 5757,
        "response_preview": "{\n  \"bugs\": [\n    {\n      \"description\": \"CircuitBreaker does not set state back to 'open' on failure when in 'half_open' state. Instead, it increments failure_count, leaving state as 'half_open' if failure_count < failure_threshold, which allows subsequent requests to bypass the recovery timeout.\",...",
        "response_length": 1001,
        "latency_seconds": 19.6,
        "temperature": 0.1
      }
    ]
  },
  {
    "case_id": "case_08_date_utils",
    "bugs_found": [
      {
        "description": "The function `get_date_range` excludes the `end` date because the loop condition is `current < end` instead of `current <= end`. The specification explicitly requires the output to be inclusive of both endpoints.",
        "severity": "high",
        "location": "get_date_range"
      }
    ],
    "bug_count": 1,
    "review_text": "{\n  \"bugs\": [\n    {\n      \"description\": \"The function `get_date_range` excludes the `end` date because the loop condition is `current < end` instead of `current <= end`. The specification explicitly requires the output to be inclusive of both endpoints.\",\n      \"severity\": \"high\",\n      \"location\": \"get_date_range\"\n    }\n  ],\n  \"overall_assessment\": \"has_minor_issues\",\n  \"review_summary\": \"The date utility functions are generally well-implemented and correctly handle leap year month clamping and negative month math. However, `get_date_range` fails to include the end date in the returned list due to using strict inequality (`<`) instead of less-than-or-equal (`<=`).\"\n}",
    "total_time_seconds": 55.61,
    "trajectory": [
      {
        "timestamp": "2026-08-28T16:40:36Z",
        "model": "gemini-3.6-flash",
        "system_instruction": null,
        "prompt_preview": "Review the following Python code against its specification.\nIdentify any bugs, issues, or potential problems.\n\n## SPECIFICATION (what the code should do):\n# Date Range Calculator Specification\n\n## days_between(date1_str, date2_str, fmt=\"%Y-%m-%d\") -> int\nReturns the absolute number of days between t...",
        "prompt_length": 5250,
        "response_preview": "{\n  \"bugs\": [\n    {\n      \"description\": \"The function `get_date_range` excludes the `end` date because the loop condition is `current < end` instead of `current <= end`. The specification explicitly requires the output to be inclusive of both endpoints.\",\n      \"severity\": \"high\",\n      \"location\":...",
        "response_length": 677,
        "latency_seconds": 55.61,
        "temperature": 0.1
      }
    ]
  },
  {
    "case_id": "case_09_permissions",
    "bugs_found": [
      {
        "description": "Unauthenticated users with `id=None` (or missing `id`) are incorrectly granted owner access to resources with `owner_id=None` because `user_id == owner_id` evaluates to True when both are None.",
        "severity": "critical",
        "location": "check_access method (`if user_id == owner_id:`)"
      }
    ],
    "bug_count": 1,
    "review_text": "{\n  \"bugs\": [\n    {\n      \"description\": \"Unauthenticated users with `id=None` (or missing `id`) are incorrectly granted owner access to resources with `owner_id=None` because `user_id == owner_id` evaluates to True when both are None.\",\n      \"severity\": \"critical\",\n      \"location\": \"check_access method (`if user_id == owner_id:`)\"\n    }\n  ],\n  \"overall_assessment\": \"has_significant_bugs\",\n  \"review_summary\": \" The `check_access` function contains a critical security flaw where `None == None` allows unauthenticated users (`id=None`) to gain full owner access over unowned resources (`owner_id=None`). The owner check must explicitly verify that `user_id` is not `None` before comparing it to `owner_id`.\"\n}",
    "total_time_seconds": 64.54,
    "trajectory": [
      {
        "timestamp": "2026-08-28T16:41:40Z",
        "model": "gemini-3.6-flash",
        "system_instruction": null,
        "prompt_preview": "Review the following Python code against its specification.\nIdentify any bugs, issues, or potential problems.\n\n## SPECIFICATION (what the code should do):\n# Permission Checker Specification\n\n## PermissionChecker(custom_roles=None)\n\nRole-based access control (RBAC) system.\n\n### has_permission(role, a...",
        "prompt_length": 5526,
        "response_preview": "{\n  \"bugs\": [\n    {\n      \"description\": \"Unauthenticated users with `id=None` (or missing `id`) are incorrectly granted owner access to resources with `owner_id=None` because `user_id == owner_id` evaluates to True when both are None.\",\n      \"severity\": \"critical\",\n      \"location\": \"check_access ...",
        "response_length": 714,
        "latency_seconds": 64.54,
        "temperature": 0.1
      }
    ]
  },
  {
    "case_id": "case_10_data_transformer",
    "bugs_found": [
      {
        "description": "Uses 'eval()' to evaluate compute expressions, which allows arbitrary code execution and poses a major security vulnerability.",
        "severity": "critical",
        "location": "transform_records (compute block)"
      },
      {
        "description": "Failed compute expressions silently swallow errors via 'pass' instead of setting the computed field to None as required by the specification.",
        "severity": "medium",
        "location": "transform_records (compute block)"
      },
      {
        "description": "Records with None in the filter field cause TypeErrors during operator comparisons and are silently caught and dropped by 'except TypeError: pass', violating the requirement that records with None in filter fields should be kept.",
        "severity": "high",
        "location": "transform_records (filter block)"
      },
      {
        "description": "Aggregation functions (sum, avg, min, max) fail to filter out None values before computing results, triggering TypeErrors and setting output fields to None instead of calculating over non-None values.",
        "severity": "high",
        "location": "aggregate_records"
      }
    ],
    "bug_count": 4,
    "review_text": "{\n  \"bugs\": [\n    {\n      \"description\": \"Uses 'eval()' to evaluate compute expressions, which allows arbitrary code execution and poses a major security vulnerability.\",\n      \"severity\": \"critical\",\n      \"location\": \"transform_records (compute block)\"\n    },\n    {\n      \"description\": \"Failed compute expressions silently swallow errors via 'pass' instead of setting the computed field to None as required by the specification.\",\n      \"severity\": \"medium\",\n      \"location\": \"transform_records (compute block)\"\n    },\n    {\n      \"description\": \"Records with None in the filter field cause TypeErrors during operator comparisons and are silently caught and dropped by 'except TypeError: pass', violating the requirement that records with None in filter fields should be kept.\",\n      \"severity\": \"high\",\n      \"location\": \"transform_records (filter block)\"\n    },\n    {\n      \"description\": \"Aggregation functions (sum, avg, min, max) fail to filter out None values before computing results, triggering TypeErrors and setting output fields to None instead of calculating over non-None values.\",\n      \"severity\": \"high\",\n      \"location\": \"aggregate_records\"\n    }\n  ],\n  \"overall_assessment\": \"has_significant_bugs\",\n  \"review_summary\": \"The implementation fails key functional and security requirements. It uses eval() for expression evaluation, drops records containing None values during filter operations, ignores error handling rules for compute transformations, and fails to handle None values properly during aggregation.\"\n}",
    "total_time_seconds": 35.55,
    "trajectory": [
      {
        "timestamp": "2026-08-28T16:42:16Z",
        "model": "gemini-3.6-flash",
        "system_instruction": null,
        "prompt_preview": "Review the following Python code against its specification.\nIdentify any bugs, issues, or potential problems.\n\n## SPECIFICATION (what the code should do):\n# Data Transformer Pipeline Specification\n\n## transform_records(records, transformations) -> list[dict]\n\nApplies a sequence of transformations to...",
        "prompt_length": 7954,
        "response_preview": "{\n  \"bugs\": [\n    {\n      \"description\": \"Uses 'eval()' to evaluate compute expressions, which allows arbitrary code execution and poses a major security vulnerability.\",\n      \"severity\": \"critical\",\n      \"location\": \"transform_records (compute block)\"\n    },\n    {\n      \"description\": \"Failed com...",
        "response_length": 1537,
        "latency_seconds": 35.55,
        "temperature": 0.1
      }
    ]
  }
];

export const agentResults = [
  {
    "case_id": "case_01_array_utils",
    "spec_summary": "# Array Utilities Specification\n\n## sliding_window_max(arr, window_size)\nReturns the maximum value in each sliding window of the given size.\n\n- Input: `arr` (list of numbers), `window_size` (positive ",
    "total_tests": 12,
    "tests_passed": 9,
    "tests_failed": 3,
    "bugs_found": [
      {
        "bug_id": "BUG-001",
        "root_cause": "In `sliding_window_max`, `range(len(arr) - window_size)` omits the final valid window position because `range` upper bounds are exclusive. This causes the last window result to be omitted, or returns an empty list when `window_size == len(arr)`.",
        "severity": "high",
        "category": "off_by_one",
        "failing_tests": [
          "sliding_window_max_happy_path",
          "sliding_window_max_window_equals_arr_len"
        ],
        "suggested_fix": "for i in range(len(arr) - window_size + 1):\n    window = arr[i:i + window_size]\n    result.append(max(window))",
        "confidence": 1.0,
        "evidence": "sliding_window_max_happy_path produced '[3, 5, 5]' instead of '[3, 5, 5, 5]', and sliding_window_max_window_equals_arr_len produced '[]' instead of '[3]'."
      },
      {
        "bug_id": "BUG-002",
        "root_cause": "In `find_duplicates`, an element is appended to `duplicates` every time it is seen after its first occurrence, causing elements appearing 3 or more times to be added multiple times to the output.",
        "severity": "high",
        "category": "logic_error",
        "failing_tests": [
          "find_duplicates_multiple_repeats"
        ],
        "suggested_fix": "seen = set()\nadded = set()\nduplicates = []\nfor item in arr:\n    if item in seen and item not in added:\n        duplicates.append(item)\n        added.add(item)\n    seen.add(item)\nreturn duplicates",
        "confidence": 1.0,
        "evidence": "find_duplicates_multiple_repeats with input arr=[1, 1, 1, 1] produced '[1, 1, 1]' instead of '[1]'."
      }
    ],
    "bug_count": 2,
    "severity_breakdown": {
      "high": 2
    },
    "fix_applied": true,
    "fix_improved": true,
    "post_fix_passed": 12,
    "post_fix_failed": 0,
    "test_results": [
      {
        "test_name": "sliding_window_max_happy_path",
        "passed": false,
        "input_data": "arr=[1, 3, 2, 5, 1, 4], window_size=3",
        "expected_output": "[3, 5, 5, 5]",
        "actual_output": "[3, 5, 5]",
        "stdout": "{\"passed\": false, \"input\": \"arr=[1, 3, 2, 5, 1, 4], window_size=3\", \"expected\": \"[3, 5, 5, 5]\", \"actual\": \"[3, 5, 5]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 1787.97
      },
      {
        "test_name": "chunk_list_happy_path",
        "passed": true,
        "input_data": "lst=[1, 2, 3, 4, 5], chunk_size=2",
        "expected_output": "[[1, 2], [3, 4], [5]]",
        "actual_output": "[[1, 2], [3, 4], [5]]",
        "stdout": "{\"passed\": true, \"input\": \"lst=[1, 2, 3, 4, 5], chunk_size=2\", \"expected\": \"[[1, 2], [3, 4], [5]]\", \"actual\": \"[[1, 2], [3, 4], [5]]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 312.87
      },
      {
        "test_name": "find_duplicates_happy_path",
        "passed": true,
        "input_data": "arr=[1, 2, 3, 2, 4, 1]",
        "expected_output": "[2, 1]",
        "actual_output": "[2, 1]",
        "stdout": "{\"passed\": true, \"input\": \"arr=[1, 2, 3, 2, 4, 1]\", \"expected\": \"[2, 1]\", \"actual\": \"[2, 1]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 217.31
      },
      {
        "test_name": "find_duplicates_multiple_repeats",
        "passed": false,
        "input_data": "arr=[1, 1, 1, 1]",
        "expected_output": "[1]",
        "actual_output": "[1, 1, 1]",
        "stdout": "{\"passed\": false, \"input\": \"arr=[1, 1, 1, 1]\", \"expected\": \"[1]\", \"actual\": \"[1, 1, 1]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 209.38
      },
      {
        "test_name": "sliding_window_max_window_larger_than_arr",
        "passed": true,
        "input_data": "arr=[1, 2, 3], window_size=5",
        "expected_output": "[3]",
        "actual_output": "[3]",
        "stdout": "{\"passed\": true, \"input\": \"arr=[1, 2, 3], window_size=5\", \"expected\": \"[3]\", \"actual\": \"[3]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 215.85
      },
      {
        "test_name": "chunk_list_empty",
        "passed": true,
        "input_data": "lst=[], chunk_size=3",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"lst=[], chunk_size=3\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 286.34
      },
      {
        "test_name": "find_duplicates_no_duplicates",
        "passed": true,
        "input_data": "arr=[1, 2, 3, 4]",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"arr=[1, 2, 3, 4]\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 199.97
      },
      {
        "test_name": "sliding_window_max_window_equals_arr_len",
        "passed": false,
        "input_data": "arr=[1, 3, 2], window_size=3",
        "expected_output": "[3]",
        "actual_output": "[]",
        "stdout": "{\"passed\": false, \"input\": \"arr=[1, 3, 2], window_size=3\", \"expected\": \"[3]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 196.34
      },
      {
        "test_name": "sliding_window_max_zero_window_size",
        "passed": true,
        "input_data": "arr=[1, 2, 3], window_size=0",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"arr=[1, 2, 3], window_size=0\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 194.01
      },
      {
        "test_name": "chunk_list_negative_chunk_size",
        "passed": true,
        "input_data": "lst=[1, 2, 3], chunk_size=-1",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"lst=[1, 2, 3], chunk_size=-1\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 196.2
      },
      {
        "test_name": "sliding_window_max_empty_arr",
        "passed": true,
        "input_data": "arr=[], window_size=3",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"arr=[], window_size=3\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 195.49
      },
      {
        "test_name": "chunk_list_zero_chunk_size",
        "passed": true,
        "input_data": "lst=[1, 2, 3], chunk_size=0",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"lst=[1, 2, 3], chunk_size=0\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 196.1
      }
    ],
    "post_fix_test_results": [
      {
        "test_name": "sliding_window_max_happy_path",
        "passed": true,
        "input_data": "arr=[1, 3, 2, 5, 1, 4], window_size=3",
        "expected_output": "[3, 5, 5, 5]",
        "actual_output": "[3, 5, 5, 5]",
        "stdout": "{\"passed\": true, \"input\": \"arr=[1, 3, 2, 5, 1, 4], window_size=3\", \"expected\": \"[3, 5, 5, 5]\", \"actual\": \"[3, 5, 5, 5]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 403.32
      },
      {
        "test_name": "chunk_list_happy_path",
        "passed": true,
        "input_data": "lst=[1, 2, 3, 4, 5], chunk_size=2",
        "expected_output": "[[1, 2], [3, 4], [5]]",
        "actual_output": "[[1, 2], [3, 4], [5]]",
        "stdout": "{\"passed\": true, \"input\": \"lst=[1, 2, 3, 4, 5], chunk_size=2\", \"expected\": \"[[1, 2], [3, 4], [5]]\", \"actual\": \"[[1, 2], [3, 4], [5]]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 213.09
      },
      {
        "test_name": "find_duplicates_happy_path",
        "passed": true,
        "input_data": "arr=[1, 2, 3, 2, 4, 1]",
        "expected_output": "[2, 1]",
        "actual_output": "[2, 1]",
        "stdout": "{\"passed\": true, \"input\": \"arr=[1, 2, 3, 2, 4, 1]\", \"expected\": \"[2, 1]\", \"actual\": \"[2, 1]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 194.34
      },
      {
        "test_name": "find_duplicates_multiple_repeats",
        "passed": true,
        "input_data": "arr=[1, 1, 1, 1]",
        "expected_output": "[1]",
        "actual_output": "[1]",
        "stdout": "{\"passed\": true, \"input\": \"arr=[1, 1, 1, 1]\", \"expected\": \"[1]\", \"actual\": \"[1]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 198.18
      },
      {
        "test_name": "sliding_window_max_window_larger_than_arr",
        "passed": true,
        "input_data": "arr=[1, 2, 3], window_size=5",
        "expected_output": "[3]",
        "actual_output": "[3]",
        "stdout": "{\"passed\": true, \"input\": \"arr=[1, 2, 3], window_size=5\", \"expected\": \"[3]\", \"actual\": \"[3]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 236.65
      },
      {
        "test_name": "chunk_list_empty",
        "passed": true,
        "input_data": "lst=[], chunk_size=3",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"lst=[], chunk_size=3\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 390.45
      },
      {
        "test_name": "find_duplicates_no_duplicates",
        "passed": true,
        "input_data": "arr=[1, 2, 3, 4]",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"arr=[1, 2, 3, 4]\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 303.33
      },
      {
        "test_name": "sliding_window_max_window_equals_arr_len",
        "passed": true,
        "input_data": "arr=[1, 3, 2], window_size=3",
        "expected_output": "[3]",
        "actual_output": "[3]",
        "stdout": "{\"passed\": true, \"input\": \"arr=[1, 3, 2], window_size=3\", \"expected\": \"[3]\", \"actual\": \"[3]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 259.47
      },
      {
        "test_name": "sliding_window_max_zero_window_size",
        "passed": true,
        "input_data": "arr=[1, 2, 3], window_size=0",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"arr=[1, 2, 3], window_size=0\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 245.28
      },
      {
        "test_name": "chunk_list_negative_chunk_size",
        "passed": true,
        "input_data": "lst=[1, 2, 3], chunk_size=-1",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"lst=[1, 2, 3], chunk_size=-1\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 243.88
      },
      {
        "test_name": "sliding_window_max_empty_arr",
        "passed": true,
        "input_data": "arr=[], window_size=3",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"arr=[], window_size=3\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 214.5
      },
      {
        "test_name": "chunk_list_zero_chunk_size",
        "passed": true,
        "input_data": "lst=[1, 2, 3], chunk_size=0",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"lst=[1, 2, 3], chunk_size=0\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 263.95
      }
    ],
    "fixed_code": "\"\"\"\nCase 01: Array Utilities \u2014 Off-by-one error in sliding window\n\nThis code looks correct at first glance but has a subtle off-by-one\nerror that causes the last window to be missed.\n\"\"\"\n\n\ndef sliding_window_max(arr, window_size):\n    \"\"\"Return the maximum value in each sliding window of the given size.\n    \n    Args:\n        arr: List of numbers\n        window_size: Size of the sliding window (positive integer)\n    \n    Returns:\n        List of maximum values, one per window position\n    \n    Example:\n        sliding_window_max([1, 3, 2, 5, 1, 4], 3) -> [3, 5, 5, 5]\n    \"\"\"\n    if not arr or window_size <= 0:\n        return []\n    \n    if window_size > len(arr):\n        return [max(arr)]\n    \n    result = []\n    for i in range(len(arr) - window_size + 1):\n        window = arr[i:i + window_size]\n        result.append(max(window))\n    \n    return result\n\n\ndef chunk_list(lst, chunk_size):\n    \"\"\"Split a list into chunks of the given size.\n    \n    Args:\n        lst: The list to split\n        chunk_size: Size of each chunk (positive integer)\n    \n    Returns:\n        List of chunks (sublists)\n    \n    Example:\n        chunk_list([1, 2, 3, 4, 5], 2) -> [[1, 2], [3, 4], [5]]\n    \"\"\"\n    if not lst or chunk_size <= 0:\n        return []\n    \n    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]\n\n\ndef find_duplicates(arr):\n    \"\"\"Find all duplicate values in a list.\n    \n    Args:\n        arr: List of hashable values\n    \n    Returns:\n        List of values that appear more than once (in order of first duplicate)\n    \n    Example:\n        find_duplicates([1, 2, 3, 2, 4, 1]) -> [2, 1]\n    \"\"\"\n    seen = set()\n    added = set()\n    duplicates = []\n    for item in arr:\n        if item in seen and item not in added:\n            duplicates.append(item)\n            added.add(item)\n        seen.add(item)\n    return duplicates",
    "original_code": "\"\"\"\nCase 01: Array Utilities \u2014 Off-by-one error in sliding window\n\nThis code looks correct at first glance but has a subtle off-by-one\nerror that causes the last window to be missed.\n\"\"\"\n\n\ndef sliding_window_max(arr, window_size):\n    \"\"\"Return the maximum value in each sliding window of the given size.\n    \n    Args:\n        arr: List of numbers\n        window_size: Size of the sliding window (positive integer)\n    \n    Returns:\n        List of maximum values, one per window position\n    \n    Example:\n        sliding_window_max([1, 3, 2, 5, 1, 4], 3) -> [3, 5, 5, 5]\n    \"\"\"\n    if not arr or window_size <= 0:\n        return []\n    \n    if window_size > len(arr):\n        return [max(arr)]\n    \n    result = []\n    for i in range(len(arr) - window_size):  # BUG: should be len(arr) - window_size + 1\n        window = arr[i:i + window_size]\n        result.append(max(window))\n    \n    return result\n\n\ndef chunk_list(lst, chunk_size):\n    \"\"\"Split a list into chunks of the given size.\n    \n    Args:\n        lst: The list to split\n        chunk_size: Size of each chunk (positive integer)\n    \n    Returns:\n        List of chunks (sublists)\n    \n    Example:\n        chunk_list([1, 2, 3, 4, 5], 2) -> [[1, 2], [3, 4], [5]]\n    \"\"\"\n    if not lst or chunk_size <= 0:\n        return []\n    \n    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]\n\n\ndef find_duplicates(arr):\n    \"\"\"Find all duplicate values in a list.\n    \n    Args:\n        arr: List of hashable values\n    \n    Returns:\n        List of values that appear more than once (in order of first duplicate)\n    \n    Example:\n        find_duplicates([1, 2, 3, 2, 4, 1]) -> [2, 1]\n    \"\"\"\n    seen = set()\n    duplicates = []\n    for item in arr:\n        if item in seen:\n            duplicates.append(item)  # BUG: adds item every time it's seen, not just first duplicate\n        seen.add(item)\n    return duplicates\n",
    "total_time_seconds": 109.75,
    "trajectory": [
      {
        "timestamp": "2026-08-28T16:40:44Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior test engineer specializing in catching bugs in AI-generated code.\n\nYour job is to generate test cases that will EXECUTE against the provided code to verify it works correctly.\nFocus e...",
        "prompt_preview": "Analyze this code and its specification, then generate exactly 12 test cases.\n\n## SPECIFICATION (what the code SHOULD do):\n# Array Utilities Specification\n\n## sliding_window_max(arr, window_size)\nReturns the maximum value in each sliding window of the given size.\n\n- Input: `arr` (list of numbers), `...",
        "prompt_length": 4559,
        "response_preview": "[\n  {\n    \"name\": \"sliding_window_max_happy_path\",\n    \"category\": \"happy_path\",\n    \"test_code\": \"import json\\nactual = sliding_window_max([1, 3, 2, 5, 1, 4], 3)\\nexpected = [3, 5, 5, 5]\\npassed = actual == expected\\nprint(json.dumps({\\\"passed\\\": passed, \\\"input\\\": \\\"arr=[1, 3, 2, 5, 1, 4], window_...",
        "response_length": 5334,
        "latency_seconds": 26.17,
        "temperature": 0.3
      },
      {
        "timestamp": "2026-08-28T16:41:38Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior debugging engineer. You are given:\n1. Source code that was generated by an AI\n2. A specification of what the code should do\n3. Test results showing which tests passed and which failed...",
        "prompt_preview": "Analyze these test failures for the code below.\n\n## SPECIFICATION:\n# Array Utilities Specification\n\n## sliding_window_max(arr, window_size)\nReturns the maximum value in each sliding window of the given size.\n\n- Input: `arr` (list of numbers), `window_size` (positive integer)\n- Output: List of maximu...",
        "prompt_length": 8725,
        "response_preview": "[\n  {\n    \"bug_id\": \"BUG-001\",\n    \"root_cause\": \"In `sliding_window_max`, `range(len(arr) - window_size)` omits the final valid window position because `range` upper bounds are exclusive. This causes the last window result to be omitted, or returns an empty list when `window_size == len(arr)`.\",\n  ...",
        "response_length": 1554,
        "latency_seconds": 49.3,
        "temperature": 0.1
      },
      {
        "timestamp": "2026-08-28T16:42:05Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior software engineer fixing bugs in AI-generated code.\n\nYou are given:\n1. The original buggy code\n2. The specification of what it should do\n3. Diagnosed bugs with root causes and evidenc...",
        "prompt_preview": "Fix the bugs in this code.\n\n## SPECIFICATION:\n# Array Utilities Specification\n\n## sliding_window_max(arr, window_size)\nReturns the maximum value in each sliding window of the given size.\n\n- Input: `arr` (list of numbers), `window_size` (positive integer)\n- Output: List of maximum values, one per win...",
        "prompt_length": 5140,
        "response_preview": "\"\"\"\nCase 01: Array Utilities \u2014 Off-by-one error in sliding window\n\nThis code looks correct at first glance but has a subtle off-by-one\nerror that causes the last window to be missed.\n\"\"\"\n\n\ndef sliding_window_max(arr, window_size):\n    \"\"\"Return the maximum value in each sliding window of the given s...",
        "response_length": 1863,
        "latency_seconds": 26.83,
        "temperature": 0.1
      }
    ]
  },
  {
    "case_id": "case_02_rate_limiter",
    "spec_summary": "# Rate Limiter Specification\n\n## RateLimiter(max_requests, window_seconds)\n\nA token bucket rate limiter that allows up to `max_requests` requests within each `window_seconds` time window.\n\n### allow_r",
    "total_tests": 12,
    "tests_passed": 10,
    "tests_failed": 2,
    "bugs_found": [
      {
        "bug_id": "BUG-001",
        "root_cause": "When a time window expires (current_time - self.window_start > self.window_seconds), allow_request updates self.window_start but does not reset self.request_count to 0. Additionally, get_remaining does not check for window expiration before calculating remaining requests, returning stale count data.",
        "severity": "high",
        "category": "state_bug",
        "failing_tests": [
          "window_expiration_resets_counter",
          "get_remaining_after_expiration"
        ],
        "suggested_fix": "def _update_window(self):\n    current_time = time.time()\n    if current_time - self.window_start > self.window_seconds:\n        self.window_start = current_time\n        self.request_count = 0\n\ndef allow_request(self) -> bool:\n    self._update_window()\n    if self.request_count < self.max_requests:\n        self.request_count += 1\n        return True\n    return False\n\ndef get_remaining(self) -> int:\n    self._update_window()\n    return max(0, self.max_requests - self.request_count)",
        "confidence": 1.0,
        "evidence": "In 'window_expiration_resets_counter', sleep 0.15s after 1 request resulted in actual output 'False' (expected 'True'). In 'get_remaining_after_expiration', max requests used followed by sleep 0.15s resulted in actual output '0' (expected '2')."
      }
    ],
    "bug_count": 1,
    "severity_breakdown": {
      "high": 1
    },
    "fix_applied": true,
    "fix_improved": true,
    "post_fix_passed": 12,
    "post_fix_failed": 0,
    "test_results": [
      {
        "test_name": "basic_allow_request",
        "passed": true,
        "input_data": "max_requests=2, 2 requests",
        "expected_output": "True, True",
        "actual_output": "True, True",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=2, 2 requests\", \"expected\": \"True, True\", \"actual\": \"True, True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 96.67
      },
      {
        "test_name": "block_exceeding_requests",
        "passed": true,
        "input_data": "max_requests=1, second request",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=1, second request\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 85.45
      },
      {
        "test_name": "get_remaining_decrements",
        "passed": true,
        "input_data": "max_requests=3, 1 request made",
        "expected_output": "2",
        "actual_output": "2",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=3, 1 request made\", \"expected\": \"2\", \"actual\": \"2\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 80.44
      },
      {
        "test_name": "window_expiration_resets_counter",
        "passed": false,
        "input_data": "max_requests=1, sleep 0.15s after 1 request",
        "expected_output": "True",
        "actual_output": "False",
        "stdout": "{\"passed\": false, \"input\": \"max_requests=1, sleep 0.15s after 1 request\", \"expected\": \"True\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 235.17
      },
      {
        "test_name": "get_remaining_after_expiration",
        "passed": false,
        "input_data": "max_requests=2, max requests used, sleep 0.15s",
        "expected_output": "2",
        "actual_output": "0",
        "stdout": "{\"passed\": false, \"input\": \"max_requests=2, max requests used, sleep 0.15s\", \"expected\": \"2\", \"actual\": \"0\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 250.13
      },
      {
        "test_name": "multiple_window_expirations",
        "passed": true,
        "input_data": "window_seconds=0.05, sleep 0.15s (3 windows)",
        "expected_output": "True",
        "actual_output": "True",
        "stdout": "{\"passed\": true, \"input\": \"window_seconds=0.05, sleep 0.15s (3 windows)\", \"expected\": \"True\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 249.19
      },
      {
        "test_name": "zero_max_requests",
        "passed": true,
        "input_data": "max_requests=0",
        "expected_output": "allow=False, remaining=0",
        "actual_output": "allow=False, remaining=0",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=0\", \"expected\": \"allow=False, remaining=0\", \"actual\": \"allow=False, remaining=0\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 87.06
      },
      {
        "test_name": "single_max_request_boundary",
        "passed": true,
        "input_data": "max_requests=1, 2 requests",
        "expected_output": "True, False",
        "actual_output": "True, False",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=1, 2 requests\", \"expected\": \"True, False\", \"actual\": \"True, False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 85.01
      },
      {
        "test_name": "retry_after_within_window",
        "passed": true,
        "input_data": "get_retry_after immediately after init",
        "expected_output": "0 < retry <= 1.0",
        "actual_output": "0.9999988079071045",
        "stdout": "{\"passed\": true, \"input\": \"get_retry_after immediately after init\", \"expected\": \"0 < retry <= 1.0\", \"actual\": \"0.9999988079071045\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 79.89
      },
      {
        "test_name": "retry_after_expired_window",
        "passed": true,
        "input_data": "get_retry_after after window expires",
        "expected_output": "0",
        "actual_output": "0",
        "stdout": "{\"passed\": true, \"input\": \"get_retry_after after window expires\", \"expected\": \"0\", \"actual\": \"0\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 202.05
      },
      {
        "test_name": "negative_max_requests",
        "passed": true,
        "input_data": "max_requests=-5",
        "expected_output": "allow=False, remaining=0",
        "actual_output": "allow=False, remaining=0",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=-5\", \"expected\": \"allow=False, remaining=0\", \"actual\": \"allow=False, remaining=0\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 81.03
      },
      {
        "test_name": "zero_window_seconds",
        "passed": true,
        "input_data": "window_seconds=0.0",
        "expected_output": "True, True",
        "actual_output": "True, True",
        "stdout": "{\"passed\": true, \"input\": \"window_seconds=0.0\", \"expected\": \"True, True\", \"actual\": \"True, True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 99.25
      }
    ],
    "post_fix_test_results": [
      {
        "test_name": "basic_allow_request",
        "passed": true,
        "input_data": "max_requests=2, 2 requests",
        "expected_output": "True, True",
        "actual_output": "True, True",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=2, 2 requests\", \"expected\": \"True, True\", \"actual\": \"True, True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 91.61
      },
      {
        "test_name": "block_exceeding_requests",
        "passed": true,
        "input_data": "max_requests=1, second request",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=1, second request\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 87.93
      },
      {
        "test_name": "get_remaining_decrements",
        "passed": true,
        "input_data": "max_requests=3, 1 request made",
        "expected_output": "2",
        "actual_output": "2",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=3, 1 request made\", \"expected\": \"2\", \"actual\": \"2\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 87.38
      },
      {
        "test_name": "window_expiration_resets_counter",
        "passed": true,
        "input_data": "max_requests=1, sleep 0.15s after 1 request",
        "expected_output": "True",
        "actual_output": "True",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=1, sleep 0.15s after 1 request\", \"expected\": \"True\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 238.34
      },
      {
        "test_name": "get_remaining_after_expiration",
        "passed": true,
        "input_data": "max_requests=2, max requests used, sleep 0.15s",
        "expected_output": "2",
        "actual_output": "2",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=2, max requests used, sleep 0.15s\", \"expected\": \"2\", \"actual\": \"2\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 245.48
      },
      {
        "test_name": "multiple_window_expirations",
        "passed": true,
        "input_data": "window_seconds=0.05, sleep 0.15s (3 windows)",
        "expected_output": "True",
        "actual_output": "True",
        "stdout": "{\"passed\": true, \"input\": \"window_seconds=0.05, sleep 0.15s (3 windows)\", \"expected\": \"True\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 240.65
      },
      {
        "test_name": "zero_max_requests",
        "passed": true,
        "input_data": "max_requests=0",
        "expected_output": "allow=False, remaining=0",
        "actual_output": "allow=False, remaining=0",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=0\", \"expected\": \"allow=False, remaining=0\", \"actual\": \"allow=False, remaining=0\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 107.52
      },
      {
        "test_name": "single_max_request_boundary",
        "passed": true,
        "input_data": "max_requests=1, 2 requests",
        "expected_output": "True, False",
        "actual_output": "True, False",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=1, 2 requests\", \"expected\": \"True, False\", \"actual\": \"True, False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 99.19
      },
      {
        "test_name": "retry_after_within_window",
        "passed": true,
        "input_data": "get_retry_after immediately after init",
        "expected_output": "0 < retry <= 1.0",
        "actual_output": "0.9999988079071045",
        "stdout": "{\"passed\": true, \"input\": \"get_retry_after immediately after init\", \"expected\": \"0 < retry <= 1.0\", \"actual\": \"0.9999988079071045\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 101.79
      },
      {
        "test_name": "retry_after_expired_window",
        "passed": true,
        "input_data": "get_retry_after after window expires",
        "expected_output": "0",
        "actual_output": "0.0",
        "stdout": "{\"passed\": true, \"input\": \"get_retry_after after window expires\", \"expected\": \"0\", \"actual\": \"0.0\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 206.58
      },
      {
        "test_name": "negative_max_requests",
        "passed": true,
        "input_data": "max_requests=-5",
        "expected_output": "allow=False, remaining=0",
        "actual_output": "allow=False, remaining=0",
        "stdout": "{\"passed\": true, \"input\": \"max_requests=-5\", \"expected\": \"allow=False, remaining=0\", \"actual\": \"allow=False, remaining=0\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 105.47
      },
      {
        "test_name": "zero_window_seconds",
        "passed": true,
        "input_data": "window_seconds=0.0",
        "expected_output": "True, True",
        "actual_output": "True, True",
        "stdout": "{\"passed\": true, \"input\": \"window_seconds=0.0\", \"expected\": \"True, True\", \"actual\": \"True, True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 116.21
      }
    ],
    "fixed_code": "import time\n\n\nclass RateLimiter:\n    \"\"\"Simple token bucket rate limiter.\n    \n    Allows up to `max_requests` requests per `window_seconds` time window.\n    \"\"\"\n    \n    def __init__(self, max_requests: int, window_seconds: float):\n        self.max_requests = max_requests\n        self.window_seconds = window_seconds\n        self.request_count = 0\n        self.window_start = time.time()\n\n    def _update_window(self):\n        current_time = time.time()\n        if current_time - self.window_start > self.window_seconds:\n            self.window_start = current_time\n            self.request_count = 0\n    \n    def allow_request(self) -> bool:\n        \"\"\"Check if a request should be allowed.\n        \n        Returns True if the request is within limits, False otherwise.\n        Automatically resets the counter when the window expires.\n        \"\"\"\n        self._update_window()\n        \n        if self.request_count < self.max_requests:\n            self.request_count += 1\n            return True\n        \n        return False\n    \n    def get_remaining(self) -> int:\n        \"\"\"Return the number of remaining allowed requests in current window.\"\"\"\n        self._update_window()\n        return max(0, self.max_requests - self.request_count)\n    \n    def get_retry_after(self) -> float:\n        \"\"\"Return seconds until the current window expires.\"\"\"\n        elapsed = time.time() - self.window_start\n        return max(0.0, self.window_seconds - elapsed)",
    "original_code": "\"\"\"\nCase 02: Rate Limiter \u2014 Counter doesn't reset after window expires\n\nA token bucket rate limiter that looks correct but fails to properly\nreset the counter when the time window expires.\n\"\"\"\n\nimport time\n\n\nclass RateLimiter:\n    \"\"\"Simple token bucket rate limiter.\n    \n    Allows up to `max_requests` requests per `window_seconds` time window.\n    \"\"\"\n    \n    def __init__(self, max_requests: int, window_seconds: float):\n        self.max_requests = max_requests\n        self.window_seconds = window_seconds\n        self.request_count = 0\n        self.window_start = time.time()\n    \n    def allow_request(self) -> bool:\n        \"\"\"Check if a request should be allowed.\n        \n        Returns True if the request is within limits, False otherwise.\n        Automatically resets the counter when the window expires.\n        \"\"\"\n        current_time = time.time()\n        \n        # Check if window has expired\n        if current_time - self.window_start > self.window_seconds:\n            self.window_start = current_time\n        \n        if self.request_count < self.max_requests:\n            self.request_count += 1\n            return True\n        \n        return False\n    \n    def get_remaining(self) -> int:\n        \"\"\"Return the number of remaining allowed requests in current window.\"\"\"\n        return max(0, self.max_requests - self.request_count)\n    \n    def get_retry_after(self) -> float:\n        \"\"\"Return seconds until the current window expires.\"\"\"\n        elapsed = time.time() - self.window_start\n        return max(0, self.window_seconds - elapsed)\n",
    "total_time_seconds": 111.72,
    "trajectory": [
      {
        "timestamp": "2026-08-29T15:42:10Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior test engineer specializing in catching bugs in AI-generated code.\n\nYour job is to generate test cases that will EXECUTE against the provided code to verify it works correctly.\nFocus e...",
        "prompt_preview": "Analyze this code and its specification, then generate exactly 12 test cases.\n\n## SPECIFICATION (what the code SHOULD do):\n# Rate Limiter Specification\n\n## RateLimiter(max_requests, window_seconds)\n\nA token bucket rate limiter that allows up to `max_requests` requests within each `window_seconds` ti...",
        "prompt_length": 4048,
        "response_preview": "[\n  {\n    \"name\": \"basic_allow_request\",\n    \"category\": \"happy_path\",\n    \"test_code\": \"import json\\nlimiter = RateLimiter(max_requests=2, window_seconds=1.0)\\nres1 = limiter.allow_request()\\nres2 = limiter.allow_request()\\npassed = res1 is True and res2 is True\\nprint(json.dumps({\\\"passed\\\": passe...",
        "response_length": 6251,
        "latency_seconds": 47.5,
        "temperature": 0.3,
        "request_number": 1
      },
      {
        "timestamp": "2026-08-29T15:42:43Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior debugging engineer. You are given:\n1. Source code that was generated by an AI\n2. A specification of what the code should do\n3. Test results showing which tests passed and which failed...",
        "prompt_preview": "Analyze these test failures for the code below.\n\n## SPECIFICATION:\n# Rate Limiter Specification\n\n## RateLimiter(max_requests, window_seconds)\n\nA token bucket rate limiter that allows up to `max_requests` requests within each `window_seconds` time window.\n\n### allow_request() -> bool\n- Returns `True`...",
        "prompt_length": 8473,
        "response_preview": "[\n  {\n    \"bug_id\": \"BUG-001\",\n    \"root_cause\": \"When a time window expires (current_time - self.window_start > self.window_seconds), allow_request updates self.window_start but does not reset self.request_count to 0. Additionally, get_remaining does not check for window expiration before calculati...",
        "response_length": 1332,
        "latency_seconds": 31.65,
        "temperature": 0.1,
        "request_number": 2
      },
      {
        "timestamp": "2026-08-29T15:43:13Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior software engineer fixing bugs in AI-generated code.\n\nYou are given:\n1. The original buggy code\n2. The specification of what it should do\n3. Diagnosed bugs with root causes and evidenc...",
        "prompt_preview": "Fix the bugs in this code.\n\n## SPECIFICATION:\n# Rate Limiter Specification\n\n## RateLimiter(max_requests, window_seconds)\n\nA token bucket rate limiter that allows up to `max_requests` requests within each `window_seconds` time window.\n\n### allow_request() -> bool\n- Returns `True` if the request is wi...",
        "prompt_length": 4407,
        "response_preview": "import time\n\n\nclass RateLimiter:\n    \"\"\"Simple token bucket rate limiter.\n    \n    Allows up to `max_requests` requests per `window_seconds` time window.\n    \"\"\"\n    \n    def __init__(self, max_requests: int, window_seconds: float):\n        self.max_requests = max_requests\n        self.window_second...",
        "response_length": 1458,
        "latency_seconds": 29.18,
        "temperature": 0.1,
        "request_number": 3
      }
    ]
  },
  {
    "case_id": "case_03_password_validator",
    "spec_summary": "# Password Validator Specification\n\n## validate_password(password: str) -> dict\n\nValidates a password against the following security requirements:\n\n### Requirements:\n1. At least 8 characters long\n2. A",
    "total_tests": 12,
    "tests_passed": 10,
    "tests_failed": 2,
    "bugs_found": [
      {
        "bug_id": "BUG-001",
        "root_cause": "The whitespace validation only checks for the literal space character (' ') using `if ' ' in password:`, ignoring other whitespace characters such as tabs ('\\t') and newlines ('\\n').",
        "severity": "high",
        "category": "missing_validation",
        "failing_tests": [
          "edge_case_tab_whitespace_rejection",
          "edge_case_newline_whitespace_rejection"
        ],
        "suggested_fix": "if re.search(r'\\s', password):\n        errors.append(\"Password must not contain whitespace characters\")",
        "confidence": 1.0,
        "evidence": "edge_case_tab_whitespace_rejection with input 'Has\\tTab!1' and edge_case_newline_whitespace_rejection with input 'Pass1!\\nAbc' both returned valid=True instead of valid=False."
      }
    ],
    "bug_count": 1,
    "severity_breakdown": {
      "high": 1
    },
    "fix_applied": true,
    "fix_improved": true,
    "post_fix_passed": 12,
    "post_fix_failed": 0,
    "test_results": [
      {
        "test_name": "happy_path_standard_valid_password",
        "passed": true,
        "input_data": "Str0ng!Pass",
        "expected_output": "valid=True, errors=[]",
        "actual_output": "valid=True, errors=[]",
        "stdout": "{\"passed\": true, \"input\": \"Str0ng!Pass\", \"expected\": \"valid=True, errors=[]\", \"actual\": \"valid=True, errors=[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 133.6
      },
      {
        "test_name": "happy_path_repeated_valid_pattern",
        "passed": true,
        "input_data": "Ab1!Ab1!",
        "expected_output": "valid=True, errors=[]",
        "actual_output": "valid=True, errors=[]",
        "stdout": "{\"passed\": true, \"input\": \"Ab1!Ab1!\", \"expected\": \"valid=True, errors=[]\", \"actual\": \"valid=True, errors=[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 107.11
      },
      {
        "test_name": "happy_path_valid_with_special_characters",
        "passed": true,
        "input_data": "Valid123_Test!#$",
        "expected_output": "valid=True, errors=[]",
        "actual_output": "valid=True, errors=[]",
        "stdout": "{\"passed\": true, \"input\": \"Valid123_Test!#$\", \"expected\": \"valid=True, errors=[]\", \"actual\": \"valid=True, errors=[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 114.35
      },
      {
        "test_name": "edge_case_tab_whitespace_rejection",
        "passed": false,
        "input_data": "Has\\tTab!1",
        "expected_output": "valid=False",
        "actual_output": "valid=True",
        "stdout": "{\"passed\": false, \"input\": \"Has\\\\tTab!1\", \"expected\": \"valid=False\", \"actual\": \"valid=True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 112.03
      },
      {
        "test_name": "edge_case_newline_whitespace_rejection",
        "passed": false,
        "input_data": "Pass1!\\nAbc",
        "expected_output": "valid=False",
        "actual_output": "valid=True",
        "stdout": "{\"passed\": false, \"input\": \"Pass1!\\\\nAbc\", \"expected\": \"valid=False\", \"actual\": \"valid=True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 110.45
      },
      {
        "test_name": "edge_case_case_insensitive_password_word",
        "passed": true,
        "input_data": "MyPAsSWorD!1",
        "expected_output": "valid=False",
        "actual_output": "valid=False",
        "stdout": "{\"passed\": true, \"input\": \"MyPAsSWorD!1\", \"expected\": \"valid=False\", \"actual\": \"valid=False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 112.23
      },
      {
        "test_name": "edge_case_multiple_validation_failures",
        "passed": true,
        "input_data": "weak",
        "expected_output": "valid=False with multiple errors",
        "actual_output": "valid=False, error_count=4",
        "stdout": "{\"passed\": true, \"input\": \"weak\", \"expected\": \"valid=False with multiple errors\", \"actual\": \"valid=False, error_count=4\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 95.59
      },
      {
        "test_name": "boundary_exact_minimum_length_8",
        "passed": true,
        "input_data": "Abcdef1!",
        "expected_output": "valid=True",
        "actual_output": "valid=True",
        "stdout": "{\"passed\": true, \"input\": \"Abcdef1!\", \"expected\": \"valid=True\", \"actual\": \"valid=True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 90.97
      },
      {
        "test_name": "boundary_below_minimum_length_7",
        "passed": true,
        "input_data": "Abcde1!",
        "expected_output": "valid=False",
        "actual_output": "valid=False",
        "stdout": "{\"passed\": true, \"input\": \"Abcde1!\", \"expected\": \"valid=False\", \"actual\": \"valid=False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 107.16
      },
      {
        "test_name": "boundary_exact_maximum_length_64",
        "passed": true,
        "input_data": "<string length 64>",
        "expected_output": "valid=True",
        "actual_output": "valid=True",
        "stdout": "{\"passed\": true, \"input\": \"<string length 64>\", \"expected\": \"valid=True\", \"actual\": \"valid=True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 108.75
      },
      {
        "test_name": "error_handling_empty_string",
        "passed": true,
        "input_data": "",
        "expected_output": "valid=False",
        "actual_output": "valid=False",
        "stdout": "{\"passed\": true, \"input\": \"\", \"expected\": \"valid=False\", \"actual\": \"valid=False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 119.93
      },
      {
        "test_name": "error_handling_exceeds_maximum_length_65",
        "passed": true,
        "input_data": "<string length 65>",
        "expected_output": "valid=False",
        "actual_output": "valid=False",
        "stdout": "{\"passed\": true, \"input\": \"<string length 65>\", \"expected\": \"valid=False\", \"actual\": \"valid=False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 103.36
      }
    ],
    "post_fix_test_results": [
      {
        "test_name": "happy_path_standard_valid_password",
        "passed": true,
        "input_data": "Str0ng!Pass",
        "expected_output": "valid=True, errors=[]",
        "actual_output": "valid=True, errors=[]",
        "stdout": "{\"passed\": true, \"input\": \"Str0ng!Pass\", \"expected\": \"valid=True, errors=[]\", \"actual\": \"valid=True, errors=[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 114.58
      },
      {
        "test_name": "happy_path_repeated_valid_pattern",
        "passed": true,
        "input_data": "Ab1!Ab1!",
        "expected_output": "valid=True, errors=[]",
        "actual_output": "valid=True, errors=[]",
        "stdout": "{\"passed\": true, \"input\": \"Ab1!Ab1!\", \"expected\": \"valid=True, errors=[]\", \"actual\": \"valid=True, errors=[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 103.39
      },
      {
        "test_name": "happy_path_valid_with_special_characters",
        "passed": true,
        "input_data": "Valid123_Test!#$",
        "expected_output": "valid=True, errors=[]",
        "actual_output": "valid=True, errors=[]",
        "stdout": "{\"passed\": true, \"input\": \"Valid123_Test!#$\", \"expected\": \"valid=True, errors=[]\", \"actual\": \"valid=True, errors=[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 100.61
      },
      {
        "test_name": "edge_case_tab_whitespace_rejection",
        "passed": true,
        "input_data": "Has\\tTab!1",
        "expected_output": "valid=False",
        "actual_output": "valid=False",
        "stdout": "{\"passed\": true, \"input\": \"Has\\\\tTab!1\", \"expected\": \"valid=False\", \"actual\": \"valid=False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 96.93
      },
      {
        "test_name": "edge_case_newline_whitespace_rejection",
        "passed": true,
        "input_data": "Pass1!\\nAbc",
        "expected_output": "valid=False",
        "actual_output": "valid=False",
        "stdout": "{\"passed\": true, \"input\": \"Pass1!\\\\nAbc\", \"expected\": \"valid=False\", \"actual\": \"valid=False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 95.25
      },
      {
        "test_name": "edge_case_case_insensitive_password_word",
        "passed": true,
        "input_data": "MyPAsSWorD!1",
        "expected_output": "valid=False",
        "actual_output": "valid=False",
        "stdout": "{\"passed\": true, \"input\": \"MyPAsSWorD!1\", \"expected\": \"valid=False\", \"actual\": \"valid=False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 108.63
      },
      {
        "test_name": "edge_case_multiple_validation_failures",
        "passed": true,
        "input_data": "weak",
        "expected_output": "valid=False with multiple errors",
        "actual_output": "valid=False, error_count=4",
        "stdout": "{\"passed\": true, \"input\": \"weak\", \"expected\": \"valid=False with multiple errors\", \"actual\": \"valid=False, error_count=4\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 103.36
      },
      {
        "test_name": "boundary_exact_minimum_length_8",
        "passed": true,
        "input_data": "Abcdef1!",
        "expected_output": "valid=True",
        "actual_output": "valid=True",
        "stdout": "{\"passed\": true, \"input\": \"Abcdef1!\", \"expected\": \"valid=True\", \"actual\": \"valid=True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 96.78
      },
      {
        "test_name": "boundary_below_minimum_length_7",
        "passed": true,
        "input_data": "Abcde1!",
        "expected_output": "valid=False",
        "actual_output": "valid=False",
        "stdout": "{\"passed\": true, \"input\": \"Abcde1!\", \"expected\": \"valid=False\", \"actual\": \"valid=False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 101.03
      },
      {
        "test_name": "boundary_exact_maximum_length_64",
        "passed": true,
        "input_data": "<string length 64>",
        "expected_output": "valid=True",
        "actual_output": "valid=True",
        "stdout": "{\"passed\": true, \"input\": \"<string length 64>\", \"expected\": \"valid=True\", \"actual\": \"valid=True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 101.38
      },
      {
        "test_name": "error_handling_empty_string",
        "passed": true,
        "input_data": "",
        "expected_output": "valid=False",
        "actual_output": "valid=False",
        "stdout": "{\"passed\": true, \"input\": \"\", \"expected\": \"valid=False\", \"actual\": \"valid=False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 102.03
      },
      {
        "test_name": "error_handling_exceeds_maximum_length_65",
        "passed": true,
        "input_data": "<string length 65>",
        "expected_output": "valid=False",
        "actual_output": "valid=False",
        "stdout": "{\"passed\": true, \"input\": \"<string length 65>\", \"expected\": \"valid=False\", \"actual\": \"valid=False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 99.73
      }
    ],
    "fixed_code": "import re\n\n\ndef validate_password(password: str) -> dict:\n    \"\"\"Validate a password against security requirements.\n    \n    Requirements:\n        - At least 8 characters long\n        - At most 64 characters long\n        - Contains at least one uppercase letter (A-Z)\n        - Contains at least one lowercase letter (a-z)\n        - Contains at least one digit (0-9)\n        - Contains at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)\n        - Does not contain whitespace characters\n        - Does not contain the word \"password\" (case-insensitive)\n    \n    Returns:\n        dict with:\n            - valid: bool\n            - errors: list of strings describing failures\n    \"\"\"\n    errors = []\n    \n    if len(password) < 8:\n        errors.append(\"Password must be at least 8 characters\")\n    \n    if len(password) > 64:\n        errors.append(\"Password must be at most 64 characters\")\n    \n    if not re.search(r'[A-Z]', password):\n        errors.append(\"Password must contain at least one uppercase letter\")\n    \n    if not re.search(r'[a-z]', password):\n        errors.append(\"Password must contain at least one lowercase letter\")\n    \n    if not re.search(r'[0-9]', password):\n        errors.append(\"Password must contain at least one digit\")\n    \n    if not re.search(r'[!@#$%^&*()_+\\-=\\[\\]{}|;:,.<>?]', password):\n        errors.append(\"Password must contain at least one special character\")\n    \n    if re.search(r'\\s', password):\n        errors.append(\"Password must not contain whitespace characters\")\n    \n    if 'password' in password.lower():\n        errors.append(\"Password must not contain the word 'password'\")\n    \n    return {\n        \"valid\": len(errors) == 0,\n        \"errors\": errors\n    }",
    "original_code": "\"\"\"\nCase 03: Password Validator \u2014 Regex allows unicode lookalike characters\n\nA password validator that checks complexity requirements but uses\na naive regex that can be bypassed with unicode confusable characters.\n\"\"\"\n\nimport re\n\n\ndef validate_password(password: str) -> dict:\n    \"\"\"Validate a password against security requirements.\n    \n    Requirements:\n        - At least 8 characters long\n        - At most 64 characters long\n        - Contains at least one uppercase letter (A-Z)\n        - Contains at least one lowercase letter (a-z)\n        - Contains at least one digit (0-9)\n        - Contains at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)\n        - Does not contain spaces\n        - Does not contain the word \"password\" (case-insensitive)\n    \n    Returns:\n        dict with:\n            - valid: bool\n            - errors: list of strings describing failures\n    \"\"\"\n    errors = []\n    \n    if len(password) < 8:\n        errors.append(\"Password must be at least 8 characters\")\n    \n    if len(password) > 64:\n        errors.append(\"Password must be at most 64 characters\")\n    \n    if not re.search(r'[A-Z]', password):\n        errors.append(\"Password must contain at least one uppercase letter\")\n    \n    if not re.search(r'[a-z]', password):\n        errors.append(\"Password must contain at least one lowercase letter\")\n    \n    if not re.search(r'[0-9]', password):\n        errors.append(\"Password must contain at least one digit\")\n    \n    # that the password ONLY contains allowed characters\n    if not re.search(r'[!@#$%^&*()_+\\-=\\[\\]{}|;:,.<>?]', password):\n        errors.append(\"Password must contain at least one special character\")\n    \n    if ' ' in password:\n        errors.append(\"Password must not contain spaces\")\n    \n    if 'password' in password.lower():\n        errors.append(\"Password must not contain the word 'password'\")\n    \n    \n    return {\n        \"valid\": len(errors) == 0,\n        \"errors\": errors\n    }\n",
    "total_time_seconds": 84.31,
    "trajectory": [
      {
        "timestamp": "2026-08-29T15:44:10Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior test engineer specializing in catching bugs in AI-generated code.\n\nYour job is to generate test cases that will EXECUTE against the provided code to verify it works correctly.\nFocus e...",
        "prompt_preview": "Analyze this code and its specification, then generate exactly 12 test cases.\n\n## SPECIFICATION (what the code SHOULD do):\n# Password Validator Specification\n\n## validate_password(password: str) -> dict\n\nValidates a password against the following security requirements:\n\n### Requirements:\n1. At least...",
        "prompt_length": 4382,
        "response_preview": "[\n  {\n    \"name\": \"happy_path_standard_valid_password\",\n    \"category\": \"happy_path\",\n    \"test_code\": \"result = validate_password(\\\"Str0ng!Pass\\\")\\nexpected = True\\npassed = result.get(\\\"valid\\\") == expected and len(result.get(\\\"errors\\\", [])) == 0\\nprint(json.dumps({\\\"passed\\\": passed, \\\"input\\\": ...",
        "response_length": 6145,
        "latency_seconds": 55.84,
        "temperature": 0.3,
        "request_number": 4
      },
      {
        "timestamp": "2026-08-29T15:44:21Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior debugging engineer. You are given:\n1. Source code that was generated by an AI\n2. A specification of what the code should do\n3. Test results showing which tests passed and which failed...",
        "prompt_preview": "Analyze these test failures for the code below.\n\n## SPECIFICATION:\n# Password Validator Specification\n\n## validate_password(password: str) -> dict\n\nValidates a password against the following security requirements:\n\n### Requirements:\n1. At least 8 characters long\n2. At most 64 characters long\n3. Cont...",
        "prompt_length": 8719,
        "response_preview": "[\n  {\n    \"bug_id\": \"BUG-001\",\n    \"root_cause\": \"The whitespace validation only checks for the literal space character (' ') using `if ' ' in password:`, ignoring other whitespace characters such as tabs ('\\\\t') and newlines ('\\\\n').\",\n    \"severity\": \"high\",\n    \"category\": \"missing_validation\",\n ...",
        "response_length": 776,
        "latency_seconds": 8.87,
        "temperature": 0.1,
        "request_number": 5
      },
      {
        "timestamp": "2026-08-29T15:44:37Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior software engineer fixing bugs in AI-generated code.\n\nYou are given:\n1. The original buggy code\n2. The specification of what it should do\n3. Diagnosed bugs with root causes and evidenc...",
        "prompt_preview": "Fix the bugs in this code.\n\n## SPECIFICATION:\n# Password Validator Specification\n\n## validate_password(password: str) -> dict\n\nValidates a password against the following security requirements:\n\n### Requirements:\n1. At least 8 characters long\n2. At most 64 characters long\n3. Contains at least one ASC...",
        "prompt_length": 4185,
        "response_preview": "import re\n\n\ndef validate_password(password: str) -> dict:\n    \"\"\"Validate a password against security requirements.\n    \n    Requirements:\n        - At least 8 characters long\n        - At most 64 characters long\n        - Contains at least one uppercase letter (A-Z)\n        - Contains at least one ...",
        "response_length": 1720,
        "latency_seconds": 16.97,
        "temperature": 0.1,
        "request_number": 6
      }
    ]
  },
  {
    "case_id": "case_04_csv_parser",
    "spec_summary": "# CSV Parser Specification\n\n## parse_csv(text, delimiter=\",\") -> list[list[str]]\n\nParses a CSV string following RFC 4180 conventions.\n\n### Rules:\n1. Fields are separated by the delimiter (default: com",
    "total_tests": 12,
    "tests_passed": 10,
    "tests_failed": 2,
    "bugs_found": [
      {
        "bug_id": "BUG-001",
        "root_cause": "In csv_to_dict, when a row contains fewer fields than there are headers, the loop skips adding keys for missing fields rather than setting their values to an empty string as required by the specification.",
        "severity": "high",
        "category": "missing_edge_case",
        "failing_tests": [
          "csv_to_dict_missing_fields"
        ],
        "suggested_fix": "for j, header in enumerate(headers):\n    record[header] = row[j] if j < len(row) else \"\"",
        "confidence": 1.0,
        "evidence": "{\"passed\": false, \"input\": \"a,b\\n1\", \"expected\": \"[{'a': '1', 'b': ''}]\", \"actual\": \"[{'a': '1'}]\"}"
      },
      {
        "bug_id": "BUG-002",
        "root_cause": "In parse_csv, parsing an empty quoted field (such as \"\") results in current_field being empty (\"\") and current_row being empty ([]). The end-of-parsing condition `if current_field or current_row:` evaluates to False, causing the single empty field to be incorrectly dropped.",
        "severity": "high",
        "category": "logic_error",
        "failing_tests": [
          "parse_csv_single_quoted_empty_field"
        ],
        "suggested_fix": "if current_field or current_row or (len(text) > 0 and text[-1] not in ('\\n', '\\r')):\n    current_row.append(current_field)\n    rows.append(current_row)",
        "confidence": 1.0,
        "evidence": "{\"passed\": false, \"input\": \"\\\"\\\"\", \"expected\": \"[['']]\", \"actual\": \"[]\"}"
      }
    ],
    "bug_count": 2,
    "severity_breakdown": {
      "high": 2
    },
    "fix_applied": true,
    "fix_improved": true,
    "post_fix_passed": 12,
    "post_fix_failed": 0,
    "test_results": [
      {
        "test_name": "parse_csv_basic_rows",
        "passed": true,
        "input_data": "a,b,c\n1,2,3",
        "expected_output": "[['a', 'b', 'c'], ['1', '2', '3']]",
        "actual_output": "[['a', 'b', 'c'], ['1', '2', '3']]",
        "stdout": "{\"passed\": true, \"input\": \"a,b,c\\n1,2,3\", \"expected\": \"[['a', 'b', 'c'], ['1', '2', '3']]\", \"actual\": \"[['a', 'b', 'c'], ['1', '2', '3']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 142.81
      },
      {
        "test_name": "parse_csv_quoted_delimiter",
        "passed": true,
        "input_data": "\"has,comma\",\"normal\"",
        "expected_output": "[['has,comma', 'normal']]",
        "actual_output": "[['has,comma', 'normal']]",
        "stdout": "{\"passed\": true, \"input\": \"\\\"has,comma\\\",\\\"normal\\\"\", \"expected\": \"[['has,comma', 'normal']]\", \"actual\": \"[['has,comma', 'normal']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 143.74
      },
      {
        "test_name": "csv_to_dict_standard",
        "passed": true,
        "input_data": "name,age\nAlice,30\nBob,25",
        "expected_output": "[{'name': 'Alice', 'age': '30'}, {'name': 'Bob', 'age': '25'}]",
        "actual_output": "[{'name': 'Alice', 'age': '30'}, {'name': 'Bob', 'age': '25'}]",
        "stdout": "{\"passed\": true, \"input\": \"name,age\\nAlice,30\\nBob,25\", \"expected\": \"[{'name': 'Alice', 'age': '30'}, {'name': 'Bob', 'age': '25'}]\", \"actual\": \"[{'name': 'Alice', 'age': '30'}, {'name': 'Bob', 'age': '25'}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 147.16
      },
      {
        "test_name": "csv_to_dict_missing_fields",
        "passed": false,
        "input_data": "a,b\n1",
        "expected_output": "[{'a': '1', 'b': ''}]",
        "actual_output": "[{'a': '1'}]",
        "stdout": "{\"passed\": false, \"input\": \"a,b\\n1\", \"expected\": \"[{'a': '1', 'b': ''}]\", \"actual\": \"[{'a': '1'}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 144.03
      },
      {
        "test_name": "parse_csv_single_quoted_empty_field",
        "passed": false,
        "input_data": "\"\"",
        "expected_output": "[['']]",
        "actual_output": "[]",
        "stdout": "{\"passed\": false, \"input\": \"\\\"\\\"\", \"expected\": \"[['']]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 154.63
      },
      {
        "test_name": "parse_csv_escaped_quotes",
        "passed": true,
        "input_data": "\"say \"\"hi\"\"\",b",
        "expected_output": "[['say \"hi\"', 'b']]",
        "actual_output": "[['say \"hi\"', 'b']]",
        "stdout": "{\"passed\": true, \"input\": \"\\\"say \\\"\\\"hi\\\"\\\"\\\",b\", \"expected\": \"[['say \\\"hi\\\"', 'b']]\", \"actual\": \"[['say \\\"hi\\\"', 'b']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 160.37
      },
      {
        "test_name": "parse_csv_newlines_inside_quotes",
        "passed": true,
        "input_data": "\"line1\nline2\",val",
        "expected_output": "[['line1\\nline2', 'val']]",
        "actual_output": "[['line1\\nline2', 'val']]",
        "stdout": "{\"passed\": true, \"input\": \"\\\"line1\\nline2\\\",val\", \"expected\": \"[['line1\\\\nline2', 'val']]\", \"actual\": \"[['line1\\\\nline2', 'val']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 156.45
      },
      {
        "test_name": "parse_csv_empty_input",
        "passed": true,
        "input_data": "''",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"''\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 155.32
      },
      {
        "test_name": "parse_csv_trailing_delimiter",
        "passed": true,
        "input_data": "a,b,",
        "expected_output": "[['a', 'b', '']]",
        "actual_output": "[['a', 'b', '']]",
        "stdout": "{\"passed\": true, \"input\": \"a,b,\", \"expected\": \"[['a', 'b', '']]\", \"actual\": \"[['a', 'b', '']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 157.01
      },
      {
        "test_name": "parse_csv_trailing_newline",
        "passed": true,
        "input_data": "'a,b\\n1,2\\n'",
        "expected_output": "[['a', 'b'], ['1', '2']]",
        "actual_output": "[['a', 'b'], ['1', '2']]",
        "stdout": "{\"passed\": true, \"input\": \"'a,b\\\\n1,2\\\\n'\", \"expected\": \"[['a', 'b'], ['1', '2']]\", \"actual\": \"[['a', 'b'], ['1', '2']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 149.91
      },
      {
        "test_name": "parse_csv_custom_delimiter",
        "passed": true,
        "input_data": "a;b;c\n1;2;3",
        "expected_output": "[['a', 'b', 'c'], ['1', '2', '3']]",
        "actual_output": "[['a', 'b', 'c'], ['1', '2', '3']]",
        "stdout": "{\"passed\": true, \"input\": \"a;b;c\\n1;2;3\", \"expected\": \"[['a', 'b', 'c'], ['1', '2', '3']]\", \"actual\": \"[['a', 'b', 'c'], ['1', '2', '3']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 147.56
      },
      {
        "test_name": "csv_to_dict_headers_only",
        "passed": true,
        "input_data": "name,age",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"name,age\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 167.55
      }
    ],
    "post_fix_test_results": [
      {
        "test_name": "parse_csv_basic_rows",
        "passed": true,
        "input_data": "a,b,c\n1,2,3",
        "expected_output": "[['a', 'b', 'c'], ['1', '2', '3']]",
        "actual_output": "[['a', 'b', 'c'], ['1', '2', '3']]",
        "stdout": "{\"passed\": true, \"input\": \"a,b,c\\n1,2,3\", \"expected\": \"[['a', 'b', 'c'], ['1', '2', '3']]\", \"actual\": \"[['a', 'b', 'c'], ['1', '2', '3']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 144.16
      },
      {
        "test_name": "parse_csv_quoted_delimiter",
        "passed": true,
        "input_data": "\"has,comma\",\"normal\"",
        "expected_output": "[['has,comma', 'normal']]",
        "actual_output": "[['has,comma', 'normal']]",
        "stdout": "{\"passed\": true, \"input\": \"\\\"has,comma\\\",\\\"normal\\\"\", \"expected\": \"[['has,comma', 'normal']]\", \"actual\": \"[['has,comma', 'normal']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 153.73
      },
      {
        "test_name": "csv_to_dict_standard",
        "passed": true,
        "input_data": "name,age\nAlice,30\nBob,25",
        "expected_output": "[{'name': 'Alice', 'age': '30'}, {'name': 'Bob', 'age': '25'}]",
        "actual_output": "[{'name': 'Alice', 'age': '30'}, {'name': 'Bob', 'age': '25'}]",
        "stdout": "{\"passed\": true, \"input\": \"name,age\\nAlice,30\\nBob,25\", \"expected\": \"[{'name': 'Alice', 'age': '30'}, {'name': 'Bob', 'age': '25'}]\", \"actual\": \"[{'name': 'Alice', 'age': '30'}, {'name': 'Bob', 'age': '25'}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 153.1
      },
      {
        "test_name": "csv_to_dict_missing_fields",
        "passed": true,
        "input_data": "a,b\n1",
        "expected_output": "[{'a': '1', 'b': ''}]",
        "actual_output": "[{'a': '1', 'b': ''}]",
        "stdout": "{\"passed\": true, \"input\": \"a,b\\n1\", \"expected\": \"[{'a': '1', 'b': ''}]\", \"actual\": \"[{'a': '1', 'b': ''}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 163.33
      },
      {
        "test_name": "parse_csv_single_quoted_empty_field",
        "passed": true,
        "input_data": "\"\"",
        "expected_output": "[['']]",
        "actual_output": "[['']]",
        "stdout": "{\"passed\": true, \"input\": \"\\\"\\\"\", \"expected\": \"[['']]\", \"actual\": \"[['']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 160.34
      },
      {
        "test_name": "parse_csv_escaped_quotes",
        "passed": true,
        "input_data": "\"say \"\"hi\"\"\",b",
        "expected_output": "[['say \"hi\"', 'b']]",
        "actual_output": "[['say \"hi\"', 'b']]",
        "stdout": "{\"passed\": true, \"input\": \"\\\"say \\\"\\\"hi\\\"\\\"\\\",b\", \"expected\": \"[['say \\\"hi\\\"', 'b']]\", \"actual\": \"[['say \\\"hi\\\"', 'b']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 153.6
      },
      {
        "test_name": "parse_csv_newlines_inside_quotes",
        "passed": true,
        "input_data": "\"line1\nline2\",val",
        "expected_output": "[['line1\\nline2', 'val']]",
        "actual_output": "[['line1\\nline2', 'val']]",
        "stdout": "{\"passed\": true, \"input\": \"\\\"line1\\nline2\\\",val\", \"expected\": \"[['line1\\\\nline2', 'val']]\", \"actual\": \"[['line1\\\\nline2', 'val']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 296.54
      },
      {
        "test_name": "parse_csv_empty_input",
        "passed": true,
        "input_data": "''",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"''\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 166.25
      },
      {
        "test_name": "parse_csv_trailing_delimiter",
        "passed": true,
        "input_data": "a,b,",
        "expected_output": "[['a', 'b', '']]",
        "actual_output": "[['a', 'b', '']]",
        "stdout": "{\"passed\": true, \"input\": \"a,b,\", \"expected\": \"[['a', 'b', '']]\", \"actual\": \"[['a', 'b', '']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 163.12
      },
      {
        "test_name": "parse_csv_trailing_newline",
        "passed": true,
        "input_data": "'a,b\\n1,2\\n'",
        "expected_output": "[['a', 'b'], ['1', '2']]",
        "actual_output": "[['a', 'b'], ['1', '2']]",
        "stdout": "{\"passed\": true, \"input\": \"'a,b\\\\n1,2\\\\n'\", \"expected\": \"[['a', 'b'], ['1', '2']]\", \"actual\": \"[['a', 'b'], ['1', '2']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 176.95
      },
      {
        "test_name": "parse_csv_custom_delimiter",
        "passed": true,
        "input_data": "a;b;c\n1;2;3",
        "expected_output": "[['a', 'b', 'c'], ['1', '2', '3']]",
        "actual_output": "[['a', 'b', 'c'], ['1', '2', '3']]",
        "stdout": "{\"passed\": true, \"input\": \"a;b;c\\n1;2;3\", \"expected\": \"[['a', 'b', 'c'], ['1', '2', '3']]\", \"actual\": \"[['a', 'b', 'c'], ['1', '2', '3']]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 175.11
      },
      {
        "test_name": "csv_to_dict_headers_only",
        "passed": true,
        "input_data": "name,age",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"name,age\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 171.03
      }
    ],
    "fixed_code": "def parse_csv(text: str, delimiter: str = \",\") -> list[list[str]]:\n    \"\"\"Parse a CSV string into a list of rows (each row is a list of fields).\n    \n    Handles:\n        - Basic comma-separated values\n        - Quoted fields (fields wrapped in double quotes)\n        - Quoted fields containing the delimiter\n        - Escaped quotes within quoted fields (doubled: \"\")\n        - Empty fields\n        - Newlines within quoted fields\n    \n    Args:\n        text: The CSV string to parse\n        delimiter: The field separator (default: comma)\n    \n    Returns:\n        List of rows, where each row is a list of string fields\n    \"\"\"\n    if not text:\n        return []\n    \n    rows = []\n    current_row = []\n    current_field = \"\"\n    in_quotes = False\n    i = 0\n    \n    while i < len(text):\n        char = text[i]\n        \n        if char == '\"':\n            if in_quotes:\n                # Check for escaped quote\n                if i + 1 < len(text) and text[i + 1] == '\"':\n                    current_field += '\"'\n                    i += 2\n                    continue\n                else:\n                    in_quotes = False\n            else:\n                in_quotes = True\n        elif char == delimiter and not in_quotes:\n            current_row.append(current_field)\n            current_field = \"\"\n        elif char == '\\n' and not in_quotes:\n            current_row.append(current_field)\n            rows.append(current_row)\n            current_row = []\n            current_field = \"\"\n        elif char == '\\r' and not in_quotes:\n            # Skip \\r, handle \\r\\n\n            if i + 1 < len(text) and text[i + 1] == '\\n':\n                i += 1\n            current_row.append(current_field)\n            rows.append(current_row)\n            current_row = []\n            current_field = \"\"\n        else:\n            current_field += char\n        \n        i += 1\n    \n    # Don't forget the last field/row if text does not end with a newline\n    if text and text[-1] not in ('\\n', '\\r'):\n        current_row.append(current_field)\n        rows.append(current_row)\n    \n    return rows\n\n\ndef csv_to_dict(text: str, delimiter: str = \",\") -> list[dict]:\n    \"\"\"Parse CSV with headers into a list of dictionaries.\n    \n    The first row is treated as headers.\n    \n    Args:\n        text: CSV string with header row\n        delimiter: Field separator\n    \n    Returns:\n        List of dicts mapping header names to field values\n    \"\"\"\n    rows = parse_csv(text, delimiter)\n    \n    if len(rows) < 2:\n        return []\n    \n    headers = rows[0]\n    result = []\n    \n    for row in rows[1:]:\n        record = {}\n        for j, header in enumerate(headers):\n            record[header] = row[j] if j < len(row) else \"\"\n        if len(row) > len(headers):\n            record[None] = row[len(headers):]\n        result.append(record)\n    \n    return result",
    "original_code": "\"\"\"\nCase 04: CSV Parser \u2014 Breaks on quoted fields containing commas\n\nA simple CSV parser that handles basic cases but fails on\nRFC 4180 compliant quoted fields.\n\"\"\"\n\n\ndef parse_csv(text: str, delimiter: str = \",\") -> list[list[str]]:\n    \"\"\"Parse a CSV string into a list of rows (each row is a list of fields).\n    \n    Handles:\n        - Basic comma-separated values\n        - Quoted fields (fields wrapped in double quotes)\n        - Quoted fields containing the delimiter\n        - Escaped quotes within quoted fields (doubled: \"\")\n        - Empty fields\n        - Newlines within quoted fields\n    \n    Args:\n        text: The CSV string to parse\n        delimiter: The field separator (default: comma)\n    \n    Returns:\n        List of rows, where each row is a list of string fields\n    \"\"\"\n    if not text:\n        return []\n    \n    rows = []\n    current_row = []\n    current_field = \"\"\n    in_quotes = False\n    i = 0\n    \n    while i < len(text):\n        char = text[i]\n        \n        if char == '\"':\n            if in_quotes:\n                # Check for escaped quote\n                if i + 1 < len(text) and text[i + 1] == '\"':\n                    current_field += '\"'\n                    i += 2\n                    continue\n                else:\n                    in_quotes = False\n            else:\n                in_quotes = True\n        elif char == delimiter and not in_quotes:\n            current_row.append(current_field)\n            current_field = \"\"\n        elif char == '\\n' and not in_quotes:\n            current_row.append(current_field)\n            rows.append(current_row)\n            current_row = []\n            current_field = \"\"\n        elif char == '\\r' and not in_quotes:\n            # Skip \\r, handle \\r\\n\n            if i + 1 < len(text) and text[i + 1] == '\\n':\n                i += 1\n            current_row.append(current_field)\n            rows.append(current_row)\n            current_row = []\n            current_field = \"\"\n        else:\n            current_field += char\n        \n        i += 1\n    \n    # Don't forget the last field/row\n    if current_field or current_row:\n        current_row.append(current_field)\n        rows.append(current_row)\n    \n    # but if the last row is empty (just a newline), it gets dropped.\n    # Also BUG: doesn't handle the case where the last field is empty \n    # (trailing delimiter) \u2014 e.g., \"a,b,\" should give [\"a\", \"b\", \"\"]\n    # The current logic handles trailing delimiter but drops empty last rows\n    \n    return rows\n\n\ndef csv_to_dict(text: str, delimiter: str = \",\") -> list[dict]:\n    \"\"\"Parse CSV with headers into a list of dictionaries.\n    \n    The first row is treated as headers.\n    \n    Args:\n        text: CSV string with header row\n        delimiter: Field separator\n    \n    Returns:\n        List of dicts mapping header names to field values\n    \"\"\"\n    rows = parse_csv(text, delimiter)\n    \n    if len(rows) < 2:\n        return []\n    \n    headers = rows[0]\n    result = []\n    \n    for row in rows[1:]:\n        record = {}\n        for j, header in enumerate(headers):\n            if j < len(row):\n                record[header] = row[j]\n        result.append(record)\n    \n    return result\n",
    "total_time_seconds": 133.19,
    "trajectory": [
      {
        "timestamp": "2026-08-29T15:45:36Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior test engineer specializing in catching bugs in AI-generated code.\n\nYour job is to generate test cases that will EXECUTE against the provided code to verify it works correctly.\nFocus e...",
        "prompt_preview": "Analyze this code and its specification, then generate exactly 12 test cases.\n\n## SPECIFICATION (what the code SHOULD do):\n# CSV Parser Specification\n\n## parse_csv(text, delimiter=\",\") -> list[list[str]]\n\nParses a CSV string following RFC 4180 conventions.\n\n### Rules:\n1. Fields are separated by the ...",
        "prompt_length": 6004,
        "response_preview": "[\n  {\n    \"name\": \"parse_csv_basic_rows\",\n    \"category\": \"happy_path\",\n    \"test_code\": \"import json\\n\\ninp = 'a,b,c\\\\n1,2,3'\\nactual = parse_csv(inp)\\nexpected = [['a', 'b', 'c'], ['1', '2', '3']]\\nprint(json.dumps({\\n    'passed': actual == expected,\\n    'input': inp,\\n    'expected': str(expect...",
        "response_length": 5347,
        "latency_seconds": 56.96,
        "temperature": 0.3,
        "request_number": 7
      },
      {
        "timestamp": "2026-08-29T15:45:56Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior debugging engineer. You are given:\n1. Source code that was generated by an AI\n2. A specification of what the code should do\n3. Test results showing which tests passed and which failed...",
        "prompt_preview": "Analyze these test failures for the code below.\n\n## SPECIFICATION:\n# CSV Parser Specification\n\n## parse_csv(text, delimiter=\",\") -> list[list[str]]\n\nParses a CSV string following RFC 4180 conventions.\n\n### Rules:\n1. Fields are separated by the delimiter (default: comma)\n2. Rows are separated by newl...",
        "prompt_length": 10692,
        "response_preview": "[\n  {\n    \"bug_id\": \"BUG-001\",\n    \"root_cause\": \"In csv_to_dict, when a row contains fewer fields than there are headers, the loop skips adding keys for missing fields rather than setting their values to an empty string as required by the specification.\",\n    \"severity\": \"high\",\n    \"category\": \"mi...",
        "response_length": 1435,
        "latency_seconds": 18.6,
        "temperature": 0.1,
        "request_number": 8
      },
      {
        "timestamp": "2026-08-29T15:46:50Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior software engineer fixing bugs in AI-generated code.\n\nYou are given:\n1. The original buggy code\n2. The specification of what it should do\n3. Diagnosed bugs with root causes and evidenc...",
        "prompt_preview": "Fix the bugs in this code.\n\n## SPECIFICATION:\n# CSV Parser Specification\n\n## parse_csv(text, delimiter=\",\") -> list[list[str]]\n\nParses a CSV string following RFC 4180 conventions.\n\n### Rules:\n1. Fields are separated by the delimiter (default: comma)\n2. Rows are separated by newlines (\\n or \\r\\n)\n3. ...",
        "prompt_length": 6466,
        "response_preview": "def parse_csv(text: str, delimiter: str = \",\") -> list[list[str]]:\n    \"\"\"Parse a CSV string into a list of rows (each row is a list of fields).\n    \n    Handles:\n        - Basic comma-separated values\n        - Quoted fields (fields wrapped in double quotes)\n        - Quoted fields containing the d...",
        "response_length": 2858,
        "latency_seconds": 53.67,
        "temperature": 0.1,
        "request_number": 9
      }
    ]
  },
  {
    "case_id": "case_05_cache",
    "spec_summary": "# LRU Cache with TTL Specification\n\n## LRUCache(capacity, default_ttl=60.0)\n\nA Least Recently Used (LRU) cache with Time To Live (TTL) support.\n\n### get(key) -> value or None\n- Returns the cached valu",
    "total_tests": 12,
    "tests_passed": 7,
    "tests_failed": 5,
    "bugs_found": [
      {
        "bug_id": "BUG-001",
        "root_cause": "The get() method retrieves cache entries without checking if the entry's expiration timestamp has passed (time.time() >= expiry). Consequently, expired entries are returned instead of None and are not lazily deleted from the cache.",
        "severity": "high",
        "category": "logic_error",
        "failing_tests": [
          "expired_key_returns_none",
          "custom_ttl_overrides_default",
          "negative_ttl_expires_immediately",
          "lazy_deletion_on_get_removes_expired_key"
        ],
        "suggested_fix": "if time.time() >= expiry:\n    del self._cache[key]\n    return None",
        "confidence": 1.0,
        "evidence": "Test 'expired_key_returns_none' expected 'None' but got '1'. Code comment explicitly notes: '# Should check: if time.time() > expiry: delete and return None'."
      },
      {
        "bug_id": "BUG-002",
        "root_cause": "The size() method returns len(self._cache) without excluding entries whose TTL has expired, violating the specification requiring size() to count only valid (non-expired) entries.",
        "severity": "high",
        "category": "logic_error",
        "failing_tests": [
          "size_excludes_expired_entries"
        ],
        "suggested_fix": "now = time.time()\nreturn sum(1 for _, expiry in self._cache.values() if now < expiry)",
        "confidence": 1.0,
        "evidence": "Test 'size_excludes_expired_entries' returned '2' when '0' was expected after all entries had expired."
      }
    ],
    "bug_count": 2,
    "severity_breakdown": {
      "high": 2
    },
    "fix_applied": true,
    "fix_improved": true,
    "post_fix_passed": 12,
    "post_fix_failed": 0,
    "test_results": [
      {
        "test_name": "basic_put_get",
        "passed": true,
        "input_data": "put(\"k1\", \"v1\"), get(\"k1\")",
        "expected_output": "v1",
        "actual_output": "v1",
        "stdout": "{\"passed\": true, \"input\": \"put(\\\"k1\\\", \\\"v1\\\"), get(\\\"k1\\\")\", \"expected\": \"v1\", \"actual\": \"v1\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 90.15
      },
      {
        "test_name": "lru_eviction",
        "passed": true,
        "input_data": "capacity=2, put a, b, get a (MRU), put c",
        "expected_output": "(1, None)",
        "actual_output": "(1, None)",
        "stdout": "{\"passed\": true, \"input\": \"capacity=2, put a, b, get a (MRU), put c\", \"expected\": \"(1, None)\", \"actual\": \"(1, None)\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 85.85
      },
      {
        "test_name": "delete_and_clear",
        "passed": true,
        "input_data": "delete(\"a\"), size(), clear(), size()",
        "expected_output": "(True, 1, 0)",
        "actual_output": "(True, 1, 0)",
        "stdout": "{\"passed\": true, \"input\": \"delete(\\\"a\\\"), size(), clear(), size()\", \"expected\": \"(True, 1, 0)\", \"actual\": \"(True, 1, 0)\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 82.98
      },
      {
        "test_name": "expired_key_returns_none",
        "passed": false,
        "input_data": "get(\"a\") after TTL expired",
        "expected_output": "None",
        "actual_output": "1",
        "stdout": "{\"passed\": false, \"input\": \"get(\\\"a\\\") after TTL expired\", \"expected\": \"None\", \"actual\": \"1\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 249.68
      },
      {
        "test_name": "size_excludes_expired_entries",
        "passed": false,
        "input_data": "size() after all entries expired",
        "expected_output": "0",
        "actual_output": "2",
        "stdout": "{\"passed\": false, \"input\": \"size() after all entries expired\", \"expected\": \"0\", \"actual\": \"2\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 236.4
      },
      {
        "test_name": "custom_ttl_overrides_default",
        "passed": false,
        "input_data": "put fast with custom ttl=0.1, slow with default_ttl=10",
        "expected_output": "(None, 2)",
        "actual_output": "(1, 2)",
        "stdout": "{\"passed\": false, \"input\": \"put fast with custom ttl=0.1, slow with default_ttl=10\", \"expected\": \"(None, 2)\", \"actual\": \"(1, 2)\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 236.17
      },
      {
        "test_name": "update_key_refreshes_ttl",
        "passed": true,
        "input_data": "put(\"a\", 1), wait 0.1s, put(\"a\", 2), wait 0.15s, get(\"a\")",
        "expected_output": "2",
        "actual_output": "2",
        "stdout": "{\"passed\": true, \"input\": \"put(\\\"a\\\", 1), wait 0.1s, put(\\\"a\\\", 2), wait 0.15s, get(\\\"a\\\")\", \"expected\": \"2\", \"actual\": \"2\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 356.62
      },
      {
        "test_name": "capacity_one_cache",
        "passed": true,
        "input_data": "capacity=1: put \"a\", put \"b\"",
        "expected_output": "(None, 2, 1)",
        "actual_output": "(None, 2, 1)",
        "stdout": "{\"passed\": true, \"input\": \"capacity=1: put \\\"a\\\", put \\\"b\\\"\", \"expected\": \"(None, 2, 1)\", \"actual\": \"(None, 2, 1)\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 92.18
      },
      {
        "test_name": "get_nonexistent_key",
        "passed": true,
        "input_data": "get(\"missing\") on empty cache",
        "expected_output": "None",
        "actual_output": "None",
        "stdout": "{\"passed\": true, \"input\": \"get(\\\"missing\\\") on empty cache\", \"expected\": \"None\", \"actual\": \"None\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 81.53
      },
      {
        "test_name": "delete_nonexistent_key",
        "passed": true,
        "input_data": "delete(\"missing\") on empty cache",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"delete(\\\"missing\\\") on empty cache\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 81.71
      },
      {
        "test_name": "negative_ttl_expires_immediately",
        "passed": false,
        "input_data": "put(\"a\", 1, ttl=-1.0), get(\"a\")",
        "expected_output": "None",
        "actual_output": "1",
        "stdout": "{\"passed\": false, \"input\": \"put(\\\"a\\\", 1, ttl=-1.0), get(\\\"a\\\")\", \"expected\": \"None\", \"actual\": \"1\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 87.16
      },
      {
        "test_name": "lazy_deletion_on_get_removes_expired_key",
        "passed": false,
        "input_data": "get(\"a\") after expiration checks if entry is deleted from internal dict",
        "expected_output": "0",
        "actual_output": "1",
        "stdout": "{\"passed\": false, \"input\": \"get(\\\"a\\\") after expiration checks if entry is deleted from internal dict\", \"expected\": \"0\", \"actual\": \"1\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 232.78
      }
    ],
    "post_fix_test_results": [
      {
        "test_name": "basic_put_get",
        "passed": true,
        "input_data": "put(\"k1\", \"v1\"), get(\"k1\")",
        "expected_output": "v1",
        "actual_output": "v1",
        "stdout": "{\"passed\": true, \"input\": \"put(\\\"k1\\\", \\\"v1\\\"), get(\\\"k1\\\")\", \"expected\": \"v1\", \"actual\": \"v1\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 98.03
      },
      {
        "test_name": "lru_eviction",
        "passed": true,
        "input_data": "capacity=2, put a, b, get a (MRU), put c",
        "expected_output": "(1, None)",
        "actual_output": "(1, None)",
        "stdout": "{\"passed\": true, \"input\": \"capacity=2, put a, b, get a (MRU), put c\", \"expected\": \"(1, None)\", \"actual\": \"(1, None)\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 84.52
      },
      {
        "test_name": "delete_and_clear",
        "passed": true,
        "input_data": "delete(\"a\"), size(), clear(), size()",
        "expected_output": "(True, 1, 0)",
        "actual_output": "(True, 1, 0)",
        "stdout": "{\"passed\": true, \"input\": \"delete(\\\"a\\\"), size(), clear(), size()\", \"expected\": \"(True, 1, 0)\", \"actual\": \"(True, 1, 0)\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 85.69
      },
      {
        "test_name": "expired_key_returns_none",
        "passed": true,
        "input_data": "get(\"a\") after TTL expired",
        "expected_output": "None",
        "actual_output": "None",
        "stdout": "{\"passed\": true, \"input\": \"get(\\\"a\\\") after TTL expired\", \"expected\": \"None\", \"actual\": \"None\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 239.74
      },
      {
        "test_name": "size_excludes_expired_entries",
        "passed": true,
        "input_data": "size() after all entries expired",
        "expected_output": "0",
        "actual_output": "0",
        "stdout": "{\"passed\": true, \"input\": \"size() after all entries expired\", \"expected\": \"0\", \"actual\": \"0\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 278.6
      },
      {
        "test_name": "custom_ttl_overrides_default",
        "passed": true,
        "input_data": "put fast with custom ttl=0.1, slow with default_ttl=10",
        "expected_output": "(None, 2)",
        "actual_output": "(None, 2)",
        "stdout": "{\"passed\": true, \"input\": \"put fast with custom ttl=0.1, slow with default_ttl=10\", \"expected\": \"(None, 2)\", \"actual\": \"(None, 2)\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 314.21
      },
      {
        "test_name": "update_key_refreshes_ttl",
        "passed": true,
        "input_data": "put(\"a\", 1), wait 0.1s, put(\"a\", 2), wait 0.15s, get(\"a\")",
        "expected_output": "2",
        "actual_output": "2",
        "stdout": "{\"passed\": true, \"input\": \"put(\\\"a\\\", 1), wait 0.1s, put(\\\"a\\\", 2), wait 0.15s, get(\\\"a\\\")\", \"expected\": \"2\", \"actual\": \"2\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 351.72
      },
      {
        "test_name": "capacity_one_cache",
        "passed": true,
        "input_data": "capacity=1: put \"a\", put \"b\"",
        "expected_output": "(None, 2, 1)",
        "actual_output": "(None, 2, 1)",
        "stdout": "{\"passed\": true, \"input\": \"capacity=1: put \\\"a\\\", put \\\"b\\\"\", \"expected\": \"(None, 2, 1)\", \"actual\": \"(None, 2, 1)\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 90.03
      },
      {
        "test_name": "get_nonexistent_key",
        "passed": true,
        "input_data": "get(\"missing\") on empty cache",
        "expected_output": "None",
        "actual_output": "None",
        "stdout": "{\"passed\": true, \"input\": \"get(\\\"missing\\\") on empty cache\", \"expected\": \"None\", \"actual\": \"None\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 84.95
      },
      {
        "test_name": "delete_nonexistent_key",
        "passed": true,
        "input_data": "delete(\"missing\") on empty cache",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"delete(\\\"missing\\\") on empty cache\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 84.71
      },
      {
        "test_name": "negative_ttl_expires_immediately",
        "passed": true,
        "input_data": "put(\"a\", 1, ttl=-1.0), get(\"a\")",
        "expected_output": "None",
        "actual_output": "None",
        "stdout": "{\"passed\": true, \"input\": \"put(\\\"a\\\", 1, ttl=-1.0), get(\\\"a\\\")\", \"expected\": \"None\", \"actual\": \"None\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 83.72
      },
      {
        "test_name": "lazy_deletion_on_get_removes_expired_key",
        "passed": true,
        "input_data": "get(\"a\") after expiration checks if entry is deleted from internal dict",
        "expected_output": "0",
        "actual_output": "0",
        "stdout": "{\"passed\": true, \"input\": \"get(\\\"a\\\") after expiration checks if entry is deleted from internal dict\", \"expected\": \"0\", \"actual\": \"0\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 239.83
      }
    ],
    "fixed_code": "import time\nfrom collections import OrderedDict\n\n\nclass LRUCache:\n    \"\"\"Least Recently Used cache with TTL (Time To Live) support.\n    \n    Entries expire after `default_ttl` seconds and should not be returned\n    after expiration. The cache also evicts the least recently used entry\n    when capacity is reached.\n    \"\"\"\n    \n    def __init__(self, capacity: int, default_ttl: float = 60.0):\n        self.capacity = capacity\n        self.default_ttl = default_ttl\n        self._cache = OrderedDict()  # key -> (value, expiry_time)\n    \n    def get(self, key: str):\n        \"\"\"Get a value from the cache.\n        \n        Returns None if key doesn't exist or has expired.\n        Accessing a key makes it most recently used.\n        \"\"\"\n        if key not in self._cache:\n            return None\n        \n        value, expiry = self._cache[key]\n        \n        if time.time() >= expiry:\n            del self._cache[key]\n            return None\n        \n        # Move to end (most recently used)\n        self._cache.move_to_end(key)\n        \n        return value\n    \n    def put(self, key: str, value, ttl: float | None = None) -> None:\n        \"\"\"Add or update a cache entry.\n        \n        Args:\n            key: Cache key\n            value: Value to store\n            ttl: Time to live in seconds (uses default_ttl if None)\n        \"\"\"\n        ttl = ttl if ttl is not None else self.default_ttl\n        expiry = time.time() + ttl\n        \n        if key in self._cache:\n            self._cache.move_to_end(key)\n            self._cache[key] = (value, expiry)\n        else:\n            if len(self._cache) >= self.capacity:\n                self._cache.popitem(last=False)  # Remove LRU\n            self._cache[key] = (value, expiry)\n    \n    def delete(self, key: str) -> bool:\n        \"\"\"Remove an entry from the cache. Returns True if key existed.\"\"\"\n        if key in self._cache:\n            del self._cache[key]\n            return True\n        return False\n    \n    def size(self) -> int:\n        \"\"\"Return the number of valid (non-expired) entries in the cache.\"\"\"\n        now = time.time()\n        return sum(1 for _, expiry in self._cache.values() if now < expiry)\n    \n    def clear(self) -> None:\n        \"\"\"Remove all entries from the cache.\"\"\"\n        self._cache.clear()",
    "original_code": "\"\"\"\nCase 05: LRU Cache \u2014 Never evicts expired entries (memory leak)\n\nAn LRU cache with TTL support that correctly handles LRU eviction\nbut forgets to check TTL expiration when reading entries.\n\"\"\"\n\nimport time\nfrom collections import OrderedDict\n\n\nclass LRUCache:\n    \"\"\"Least Recently Used cache with TTL (Time To Live) support.\n    \n    Entries expire after `default_ttl` seconds and should not be returned\n    after expiration. The cache also evicts the least recently used entry\n    when capacity is reached.\n    \"\"\"\n    \n    def __init__(self, capacity: int, default_ttl: float = 60.0):\n        self.capacity = capacity\n        self.default_ttl = default_ttl\n        self._cache = OrderedDict()  # key -> (value, expiry_time)\n    \n    def get(self, key: str):\n        \"\"\"Get a value from the cache.\n        \n        Returns None if key doesn't exist or has expired.\n        Accessing a key makes it most recently used.\n        \"\"\"\n        if key not in self._cache:\n            return None\n        \n        value, expiry = self._cache[key]\n        \n        # Should check: if time.time() > expiry: delete and return None\n        \n        # Move to end (most recently used)\n        self._cache.move_to_end(key)\n        \n        return value\n    \n    def put(self, key: str, value, ttl: float | None = None) -> None:\n        \"\"\"Add or update a cache entry.\n        \n        Args:\n            key: Cache key\n            value: Value to store\n            ttl: Time to live in seconds (uses default_ttl if None)\n        \"\"\"\n        ttl = ttl if ttl is not None else self.default_ttl\n        expiry = time.time() + ttl\n        \n        if key in self._cache:\n            self._cache.move_to_end(key)\n            self._cache[key] = (value, expiry)\n        else:\n            if len(self._cache) >= self.capacity:\n                self._cache.popitem(last=False)  # Remove LRU\n            self._cache[key] = (value, expiry)\n    \n    def delete(self, key: str) -> bool:\n        \"\"\"Remove an entry from the cache. Returns True if key existed.\"\"\"\n        if key in self._cache:\n            del self._cache[key]\n            return True\n        return False\n    \n    def size(self) -> int:\n        \"\"\"Return the number of entries in the cache (including expired ones).\"\"\"\n        return len(self._cache)\n    \n    def clear(self) -> None:\n        \"\"\"Remove all entries from the cache.\"\"\"\n        self._cache.clear()\n",
    "total_time_seconds": 87.64,
    "trajectory": [
      {
        "timestamp": "2026-08-29T16:30:06Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior test engineer specializing in catching bugs in AI-generated code.\n\nYour job is to generate test cases that will EXECUTE against the provided code to verify it works correctly.\nFocus e...",
        "prompt_preview": "Analyze this code and its specification, then generate exactly 12 test cases.\n\n## SPECIFICATION (what the code SHOULD do):\n# LRU Cache with TTL Specification\n\n## LRUCache(capacity, default_ttl=60.0)\n\nA Least Recently Used (LRU) cache with Time To Live (TTL) support.\n\n### get(key) -> value or None\n- ...",
        "prompt_length": 4912,
        "response_preview": "[\n  {\n    \"name\": \"basic_put_get\",\n    \"category\": \"happy_path\",\n    \"test_code\": \"import json\\ncache = LRUCache(capacity=2, default_ttl=10.0)\\ncache.put('k1', 'v1')\\nactual = cache.get('k1')\\nexpected = 'v1'\\npassed = (actual == expected)\\nprint(json.dumps({'passed': passed, 'input': 'put(\\\"k1\\\", \\...",
        "response_length": 6646,
        "latency_seconds": 57.83,
        "temperature": 0.3,
        "request_number": 1
      },
      {
        "timestamp": "2026-08-29T16:30:17Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior debugging engineer. You are given:\n1. Source code that was generated by an AI\n2. A specification of what the code should do\n3. Test results showing which tests passed and which failed...",
        "prompt_preview": "Analyze these test failures for the code below.\n\n## SPECIFICATION:\n# LRU Cache with TTL Specification\n\n## LRUCache(capacity, default_ttl=60.0)\n\nA Least Recently Used (LRU) cache with Time To Live (TTL) support.\n\n### get(key) -> value or None\n- Returns the cached value if it exists **and has not expi...",
        "prompt_length": 9429,
        "response_preview": "[\n  {\n    \"bug_id\": \"BUG-001\",\n    \"root_cause\": \"The get() method retrieves cache entries without checking if the entry's expiration timestamp has passed (time.time() >= expiry). Consequently, expired entries are returned instead of None and are not lazily deleted from the cache.\",\n    \"severity\": ...",
        "response_length": 1443,
        "latency_seconds": 9.9,
        "temperature": 0.1,
        "request_number": 2
      },
      {
        "timestamp": "2026-08-29T16:30:33Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior software engineer fixing bugs in AI-generated code.\n\nYou are given:\n1. The original buggy code\n2. The specification of what it should do\n3. Diagnosed bugs with root causes and evidenc...",
        "prompt_preview": "Fix the bugs in this code.\n\n## SPECIFICATION:\n# LRU Cache with TTL Specification\n\n## LRUCache(capacity, default_ttl=60.0)\n\nA Least Recently Used (LRU) cache with Time To Live (TTL) support.\n\n### get(key) -> value or None\n- Returns the cached value if it exists **and has not expired**\n- Returns `None...",
        "prompt_length": 5382,
        "response_preview": "import time\nfrom collections import OrderedDict\n\n\nclass LRUCache:\n    \"\"\"Least Recently Used cache with TTL (Time To Live) support.\n    \n    Entries expire after `default_ttl` seconds and should not be returned\n    after expiration. The cache also evicts the least recently used entry\n    when capaci...",
        "response_length": 2290,
        "latency_seconds": 15.92,
        "temperature": 0.1,
        "request_number": 3
      }
    ]
  },
  {
    "case_id": "case_06_pagination",
    "spec_summary": "# Pagination Helper Specification\n\n## paginate(items, page, page_size) -> dict\n\nOffset-based pagination for a list of items.\n\n- `page` is 1-indexed (first page is 1)\n- `page_size` is the max items per",
    "total_tests": 12,
    "tests_passed": 11,
    "tests_failed": 1,
    "bugs_found": [
      {
        "bug_id": "BUG-001",
        "root_cause": "In `paginate_with_cursor`, negative cursor values are not clamped to 0 as required by the specification. When `cursor` is negative, Python list slicing `items[start:end]` uses negative index offsets relative to the end of the list, causing incorrect item slicing and invalid `next_cursor` calculations.",
        "severity": "high",
        "category": "missing_validation",
        "failing_tests": [
          "cursor_negative_value"
        ],
        "suggested_fix": "start = max(0, cursor) if cursor is not None else 0",
        "confidence": 1.0,
        "evidence": "Test 'cursor_negative_value' with cursor=-2 produced actual output: {'items': [], 'next_cursor': 0, 'has_more': True} instead of expected: {'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}."
      }
    ],
    "bug_count": 1,
    "severity_breakdown": {
      "high": 1
    },
    "fix_applied": true,
    "fix_improved": true,
    "post_fix_passed": 12,
    "post_fix_failed": 0,
    "test_results": [
      {
        "test_name": "paginate_first_page",
        "passed": true,
        "input_data": "items=[1, 2, 3, 4, 5], page=1, page_size=2",
        "expected_output": "{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': False}",
        "actual_output": "{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3, 4, 5], page=1, page_size=2\", \"expected\": \"{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': False}\", \"actual\": \"{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 90.97
      },
      {
        "test_name": "paginate_middle_page",
        "passed": true,
        "input_data": "items=[1, 2, 3, 4, 5], page=2, page_size=2",
        "expected_output": "{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': True}",
        "actual_output": "{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': True}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3, 4, 5], page=2, page_size=2\", \"expected\": \"{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': True}\", \"actual\": \"{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': True}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 83.15
      },
      {
        "test_name": "cursor_initial_fetch",
        "passed": true,
        "input_data": "items=[\"a\", \"b\", \"c\", \"d\"], cursor=None, limit=2",
        "expected_output": "{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}",
        "actual_output": "{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}",
        "stdout": "{\"passed\": true, \"input\": \"items=[\\\"a\\\", \\\"b\\\", \\\"c\\\", \\\"d\\\"], cursor=None, limit=2\", \"expected\": \"{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}\", \"actual\": \"{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 83.97
      },
      {
        "test_name": "cursor_negative_value",
        "passed": false,
        "input_data": "items=[\"a\", \"b\", \"c\"], cursor=-2, limit=2",
        "expected_output": "{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}",
        "actual_output": "{'items': [], 'next_cursor': 0, 'has_more': True}",
        "stdout": "{\"passed\": false, \"input\": \"items=[\\\"a\\\", \\\"b\\\", \\\"c\\\"], cursor=-2, limit=2\", \"expected\": \"{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}\", \"actual\": \"{'items': [], 'next_cursor': 0, 'has_more': True}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 82.26
      },
      {
        "test_name": "paginate_empty_items",
        "passed": true,
        "input_data": "items=[], page=1, page_size=5",
        "expected_output": "{'items': [], 'page': 1, 'page_size': 5, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}",
        "actual_output": "{'items': [], 'page': 1, 'page_size': 5, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[], page=1, page_size=5\", \"expected\": \"{'items': [], 'page': 1, 'page_size': 5, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}\", \"actual\": \"{'items': [], 'page': 1, 'page_size': 5, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 85.36
      },
      {
        "test_name": "cursor_empty_items",
        "passed": true,
        "input_data": "items=[], cursor=0, limit=5",
        "expected_output": "{'items': [], 'next_cursor': None, 'has_more': False}",
        "actual_output": "{'items': [], 'next_cursor': None, 'has_more': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[], cursor=0, limit=5\", \"expected\": \"{'items': [], 'next_cursor': None, 'has_more': False}\", \"actual\": \"{'items': [], 'next_cursor': None, 'has_more': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 96.36
      },
      {
        "test_name": "paginate_page_size_exceeds_total",
        "passed": true,
        "input_data": "items=[1, 2], page=1, page_size=10",
        "expected_output": "{'items': [1, 2], 'page': 1, 'page_size': 10, 'total_items': 2, 'total_pages': 1, 'has_next': False, 'has_previous': False}",
        "actual_output": "{'items': [1, 2], 'page': 1, 'page_size': 10, 'total_items': 2, 'total_pages': 1, 'has_next': False, 'has_previous': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2], page=1, page_size=10\", \"expected\": \"{'items': [1, 2], 'page': 1, 'page_size': 10, 'total_items': 2, 'total_pages': 1, 'has_next': False, 'has_previous': False}\", \"actual\": \"{'items': [1, 2], 'page': 1, 'page_size': 10, 'total_items': 2, 'total_pages': 1, 'has_next': False, 'has_previous': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 89.15
      },
      {
        "test_name": "paginate_page_high_out_of_range",
        "passed": true,
        "input_data": "items=[1, 2, 3, 4], page=99, page_size=2",
        "expected_output": "{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': False, 'has_previous': True}",
        "actual_output": "{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': False, 'has_previous': True}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3, 4], page=99, page_size=2\", \"expected\": \"{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': False, 'has_previous': True}\", \"actual\": \"{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': False, 'has_previous': True}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 88.07
      },
      {
        "test_name": "paginate_page_zero_or_negative",
        "passed": true,
        "input_data": "items=[1, 2, 3, 4], page=0, page_size=2",
        "expected_output": "{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': True, 'has_previous': False}",
        "actual_output": "{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': True, 'has_previous': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3, 4], page=0, page_size=2\", \"expected\": \"{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': True, 'has_previous': False}\", \"actual\": \"{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': True, 'has_previous': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 86.25
      },
      {
        "test_name": "cursor_beyond_list_length",
        "passed": true,
        "input_data": "items=[1, 2, 3], cursor=10, limit=2",
        "expected_output": "{'items': [], 'next_cursor': None, 'has_more': False}",
        "actual_output": "{'items': [], 'next_cursor': None, 'has_more': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3], cursor=10, limit=2\", \"expected\": \"{'items': [], 'next_cursor': None, 'has_more': False}\", \"actual\": \"{'items': [], 'next_cursor': None, 'has_more': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 84.85
      },
      {
        "test_name": "paginate_invalid_page_size",
        "passed": true,
        "input_data": "items=[1, 2, 3], page=1, page_size=0",
        "expected_output": "{'items': [], 'page': 1, 'page_size': 0, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}",
        "actual_output": "{'items': [], 'page': 1, 'page_size': 0, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3], page=1, page_size=0\", \"expected\": \"{'items': [], 'page': 1, 'page_size': 0, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}\", \"actual\": \"{'items': [], 'page': 1, 'page_size': 0, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 82.85
      },
      {
        "test_name": "cursor_invalid_limit",
        "passed": true,
        "input_data": "items=[1, 2, 3], cursor=0, limit=-1",
        "expected_output": "{'items': [], 'next_cursor': None, 'has_more': False}",
        "actual_output": "{'items': [], 'next_cursor': None, 'has_more': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3], cursor=0, limit=-1\", \"expected\": \"{'items': [], 'next_cursor': None, 'has_more': False}\", \"actual\": \"{'items': [], 'next_cursor': None, 'has_more': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 81.75
      }
    ],
    "post_fix_test_results": [
      {
        "test_name": "paginate_first_page",
        "passed": true,
        "input_data": "items=[1, 2, 3, 4, 5], page=1, page_size=2",
        "expected_output": "{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': False}",
        "actual_output": "{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3, 4, 5], page=1, page_size=2\", \"expected\": \"{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': False}\", \"actual\": \"{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 94.08
      },
      {
        "test_name": "paginate_middle_page",
        "passed": true,
        "input_data": "items=[1, 2, 3, 4, 5], page=2, page_size=2",
        "expected_output": "{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': True}",
        "actual_output": "{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': True}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3, 4, 5], page=2, page_size=2\", \"expected\": \"{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': True}\", \"actual\": \"{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': True}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 86.16
      },
      {
        "test_name": "cursor_initial_fetch",
        "passed": true,
        "input_data": "items=[\"a\", \"b\", \"c\", \"d\"], cursor=None, limit=2",
        "expected_output": "{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}",
        "actual_output": "{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}",
        "stdout": "{\"passed\": true, \"input\": \"items=[\\\"a\\\", \\\"b\\\", \\\"c\\\", \\\"d\\\"], cursor=None, limit=2\", \"expected\": \"{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}\", \"actual\": \"{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 81.97
      },
      {
        "test_name": "cursor_negative_value",
        "passed": true,
        "input_data": "items=[\"a\", \"b\", \"c\"], cursor=-2, limit=2",
        "expected_output": "{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}",
        "actual_output": "{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}",
        "stdout": "{\"passed\": true, \"input\": \"items=[\\\"a\\\", \\\"b\\\", \\\"c\\\"], cursor=-2, limit=2\", \"expected\": \"{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}\", \"actual\": \"{'items': ['a', 'b'], 'next_cursor': 2, 'has_more': True}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 82.49
      },
      {
        "test_name": "paginate_empty_items",
        "passed": true,
        "input_data": "items=[], page=1, page_size=5",
        "expected_output": "{'items': [], 'page': 1, 'page_size': 5, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}",
        "actual_output": "{'items': [], 'page': 1, 'page_size': 5, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[], page=1, page_size=5\", \"expected\": \"{'items': [], 'page': 1, 'page_size': 5, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}\", \"actual\": \"{'items': [], 'page': 1, 'page_size': 5, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 85.58
      },
      {
        "test_name": "cursor_empty_items",
        "passed": true,
        "input_data": "items=[], cursor=0, limit=5",
        "expected_output": "{'items': [], 'next_cursor': None, 'has_more': False}",
        "actual_output": "{'items': [], 'next_cursor': None, 'has_more': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[], cursor=0, limit=5\", \"expected\": \"{'items': [], 'next_cursor': None, 'has_more': False}\", \"actual\": \"{'items': [], 'next_cursor': None, 'has_more': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 82.19
      },
      {
        "test_name": "paginate_page_size_exceeds_total",
        "passed": true,
        "input_data": "items=[1, 2], page=1, page_size=10",
        "expected_output": "{'items': [1, 2], 'page': 1, 'page_size': 10, 'total_items': 2, 'total_pages': 1, 'has_next': False, 'has_previous': False}",
        "actual_output": "{'items': [1, 2], 'page': 1, 'page_size': 10, 'total_items': 2, 'total_pages': 1, 'has_next': False, 'has_previous': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2], page=1, page_size=10\", \"expected\": \"{'items': [1, 2], 'page': 1, 'page_size': 10, 'total_items': 2, 'total_pages': 1, 'has_next': False, 'has_previous': False}\", \"actual\": \"{'items': [1, 2], 'page': 1, 'page_size': 10, 'total_items': 2, 'total_pages': 1, 'has_next': False, 'has_previous': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 85.39
      },
      {
        "test_name": "paginate_page_high_out_of_range",
        "passed": true,
        "input_data": "items=[1, 2, 3, 4], page=99, page_size=2",
        "expected_output": "{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': False, 'has_previous': True}",
        "actual_output": "{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': False, 'has_previous': True}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3, 4], page=99, page_size=2\", \"expected\": \"{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': False, 'has_previous': True}\", \"actual\": \"{'items': [3, 4], 'page': 2, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': False, 'has_previous': True}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 81.96
      },
      {
        "test_name": "paginate_page_zero_or_negative",
        "passed": true,
        "input_data": "items=[1, 2, 3, 4], page=0, page_size=2",
        "expected_output": "{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': True, 'has_previous': False}",
        "actual_output": "{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': True, 'has_previous': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3, 4], page=0, page_size=2\", \"expected\": \"{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': True, 'has_previous': False}\", \"actual\": \"{'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 4, 'total_pages': 2, 'has_next': True, 'has_previous': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 87.22
      },
      {
        "test_name": "cursor_beyond_list_length",
        "passed": true,
        "input_data": "items=[1, 2, 3], cursor=10, limit=2",
        "expected_output": "{'items': [], 'next_cursor': None, 'has_more': False}",
        "actual_output": "{'items': [], 'next_cursor': None, 'has_more': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3], cursor=10, limit=2\", \"expected\": \"{'items': [], 'next_cursor': None, 'has_more': False}\", \"actual\": \"{'items': [], 'next_cursor': None, 'has_more': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 83.12
      },
      {
        "test_name": "paginate_invalid_page_size",
        "passed": true,
        "input_data": "items=[1, 2, 3], page=1, page_size=0",
        "expected_output": "{'items': [], 'page': 1, 'page_size': 0, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}",
        "actual_output": "{'items': [], 'page': 1, 'page_size': 0, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3], page=1, page_size=0\", \"expected\": \"{'items': [], 'page': 1, 'page_size': 0, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}\", \"actual\": \"{'items': [], 'page': 1, 'page_size': 0, 'total_items': 0, 'total_pages': 0, 'has_next': False, 'has_previous': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 88.83
      },
      {
        "test_name": "cursor_invalid_limit",
        "passed": true,
        "input_data": "items=[1, 2, 3], cursor=0, limit=-1",
        "expected_output": "{'items': [], 'next_cursor': None, 'has_more': False}",
        "actual_output": "{'items': [], 'next_cursor': None, 'has_more': False}",
        "stdout": "{\"passed\": true, \"input\": \"items=[1, 2, 3], cursor=0, limit=-1\", \"expected\": \"{'items': [], 'next_cursor': None, 'has_more': False}\", \"actual\": \"{'items': [], 'next_cursor': None, 'has_more': False}\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 85.08
      }
    ],
    "fixed_code": "def paginate(items: list, page: int, page_size: int) -> dict:\n    \"\"\"Paginate a list of items.\n    \n    Args:\n        items: The full list to paginate\n        page: The page number (1-indexed)\n        page_size: Number of items per page\n    \n    Returns:\n        dict with:\n            - items: list of items for the requested page\n            - page: current page number\n            - page_size: items per page\n            - total_items: total number of items\n            - total_pages: total number of pages\n            - has_next: bool\n            - has_previous: bool\n    \"\"\"\n    if not items or page_size <= 0:\n        return {\n            \"items\": [],\n            \"page\": 1,\n            \"page_size\": page_size,\n            \"total_items\": 0,\n            \"total_pages\": 0,\n            \"has_next\": False,\n            \"has_previous\": False,\n        }\n    \n    total_items = len(items)\n    total_pages = (total_items + page_size - 1) // page_size\n    \n    # Clamp page to valid range\n    page = max(1, min(page, total_pages))\n    \n    start = (page - 1) * page_size\n    end = start + page_size\n    \n    page_items = items[start:end]\n    \n    return {\n        \"items\": page_items,\n        \"page\": page,\n        \"page_size\": page_size,\n        \"total_items\": total_items,\n        \"total_pages\": total_pages,\n        \"has_next\": page < total_pages,\n        \"has_previous\": page > 1,\n    }\n\n\ndef paginate_with_cursor(items: list, cursor: int | None, limit: int) -> dict:\n    \"\"\"Cursor-based pagination.\n    \n    Args:\n        items: The full sorted list\n        cursor: The index to start from (None for beginning)\n        limit: Maximum number of items to return\n    \n    Returns:\n        dict with items, next_cursor, has_more\n    \"\"\"\n    if not items or limit <= 0:\n        return {\"items\": [], \"next_cursor\": None, \"has_more\": False}\n    \n    start = max(0, cursor) if cursor is not None else 0\n    \n    end = start + limit\n    page_items = items[start:end]\n    \n    has_more = end < len(items)\n    next_cursor = end if has_more else None\n    \n    return {\n        \"items\": page_items,\n        \"next_cursor\": next_cursor,\n        \"has_more\": has_more,\n    }",
    "original_code": "\"\"\"\nCase 06: Pagination Helper \u2014 Returns duplicate items at page boundaries\n\nA pagination utility that calculates offsets incorrectly, causing\nitems to appear on two consecutive pages.\n\"\"\"\n\n\ndef paginate(items: list, page: int, page_size: int) -> dict:\n    \"\"\"Paginate a list of items.\n    \n    Args:\n        items: The full list to paginate\n        page: The page number (1-indexed)\n        page_size: Number of items per page\n    \n    Returns:\n        dict with:\n            - items: list of items for the requested page\n            - page: current page number\n            - page_size: items per page\n            - total_items: total number of items\n            - total_pages: total number of pages\n            - has_next: bool\n            - has_previous: bool\n    \"\"\"\n    if not items or page_size <= 0:\n        return {\n            \"items\": [],\n            \"page\": 1,\n            \"page_size\": page_size,\n            \"total_items\": 0,\n            \"total_pages\": 0,\n            \"has_next\": False,\n            \"has_previous\": False,\n        }\n    \n    total_items = len(items)\n    total_pages = (total_items + page_size - 1) // page_size\n    \n    # Clamp page to valid range\n    page = max(1, min(page, total_pages))\n    \n    # For page=1, page_size=10: start should be 0, but (1-1)*10 = 0 \u2713\n    # For page=2, page_size=10: start should be 10, but (2-1)*10 = 10 \u2713\n    # Actually the start is correct, but end is inclusive causing overlap\n    start = (page - 1) * page_size\n    end = start + page_size  # This is correct for Python slicing\n    \n    page_items = items[start:end]\n    \n    return {\n        \"items\": page_items,\n        \"page\": page,\n        \"page_size\": page_size,\n        \"total_items\": total_items,\n        \"total_pages\": total_pages,\n        \"has_next\": page < total_pages,\n        \"has_previous\": page > 1,\n    }\n\n\ndef paginate_with_cursor(items: list, cursor: int | None, limit: int) -> dict:\n    \"\"\"Cursor-based pagination.\n    \n    Args:\n        items: The full sorted list\n        cursor: The index to start from (None for beginning)\n        limit: Maximum number of items to return\n    \n    Returns:\n        dict with items, next_cursor, has_more\n    \"\"\"\n    if not items or limit <= 0:\n        return {\"items\": [], \"next_cursor\": None, \"has_more\": False}\n    \n    start = cursor if cursor is not None else 0\n    \n    # If cursor > len(items), should return empty\n    \n    end = start + limit\n    page_items = items[start:end]\n    \n    has_more = end < len(items)\n    next_cursor = end if has_more else None\n    \n    return {\n        \"items\": page_items,\n        \"next_cursor\": next_cursor,\n        \"has_more\": has_more,\n    }\n",
    "total_time_seconds": 82.25,
    "trajectory": [
      {
        "timestamp": "2026-08-29T16:31:30Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior test engineer specializing in catching bugs in AI-generated code.\n\nYour job is to generate test cases that will EXECUTE against the provided code to verify it works correctly.\nFocus e...",
        "prompt_preview": "Analyze this code and its specification, then generate exactly 12 test cases.\n\n## SPECIFICATION (what the code SHOULD do):\n# Pagination Helper Specification\n\n## paginate(items, page, page_size) -> dict\n\nOffset-based pagination for a list of items.\n\n- `page` is 1-indexed (first page is 1)\n- `page_siz...",
        "prompt_length": 4916,
        "response_preview": "[\n  {\n    \"name\": \"paginate_first_page\",\n    \"category\": \"happy_path\",\n    \"test_code\": \"res = paginate([1, 2, 3, 4, 5], 1, 2)\\nexpected = {'items': [1, 2], 'page': 1, 'page_size': 2, 'total_items': 5, 'total_pages': 3, 'has_next': True, 'has_previous': False}\\npassed = (res == expected)\\nprint(json...",
        "response_length": 5974,
        "latency_seconds": 54.85,
        "temperature": 0.3,
        "request_number": 4
      },
      {
        "timestamp": "2026-08-29T16:31:41Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior debugging engineer. You are given:\n1. Source code that was generated by an AI\n2. A specification of what the code should do\n3. Test results showing which tests passed and which failed...",
        "prompt_preview": "Analyze these test failures for the code below.\n\n## SPECIFICATION:\n# Pagination Helper Specification\n\n## paginate(items, page, page_size) -> dict\n\nOffset-based pagination for a list of items.\n\n- `page` is 1-indexed (first page is 1)\n- `page_size` is the max items per page\n- If `page` is out of range...",
        "prompt_length": 13540,
        "response_preview": "[\n  {\n    \"bug_id\": \"BUG-001\",\n    \"root_cause\": \"In `paginate_with_cursor`, negative cursor values are not clamped to 0 as required by the specification. When `cursor` is negative, Python list slicing `items[start:end]` uses negative index offsets relative to the end of the list, causing incorrect ...",
        "response_length": 797,
        "latency_seconds": 9.63,
        "temperature": 0.1,
        "request_number": 5
      },
      {
        "timestamp": "2026-08-29T16:31:57Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior software engineer fixing bugs in AI-generated code.\n\nYou are given:\n1. The original buggy code\n2. The specification of what it should do\n3. Diagnosed bugs with root causes and evidenc...",
        "prompt_preview": "Fix the bugs in this code.\n\n## SPECIFICATION:\n# Pagination Helper Specification\n\n## paginate(items, page, page_size) -> dict\n\nOffset-based pagination for a list of items.\n\n- `page` is 1-indexed (first page is 1)\n- `page_size` is the max items per page\n- If `page` is out of range, clamp to [1, total_...",
        "prompt_length": 4740,
        "response_preview": "def paginate(items: list, page: int, page_size: int) -> dict:\n    \"\"\"Paginate a list of items.\n    \n    Args:\n        items: The full list to paginate\n        page: The page number (1-indexed)\n        page_size: Number of items per page\n    \n    Returns:\n        dict with:\n            - items: list ...",
        "response_length": 2158,
        "latency_seconds": 15.69,
        "temperature": 0.1,
        "request_number": 6
      }
    ]
  },
  {
    "case_id": "case_07_retry",
    "spec_summary": "# Retry with Backoff Specification\n\n## retry_with_backoff(func, max_retries=3, base_delay=1.0, max_delay=30.0, jitter=True, retryable_exceptions=(Exception,))\n\nExecutes a function with exponential bac",
    "total_tests": 12,
    "tests_passed": 10,
    "tests_failed": 2,
    "bugs_found": [
      {
        "bug_id": "BUG-001",
        "root_cause": "The `retry_decorator` inner function `wrapper` is not decorated with `functools.wraps(func)`, causing decorated functions to lose metadata like `__name__` and `__doc__`.",
        "severity": "medium",
        "category": "logic_error",
        "failing_tests": [
          "edge_case_retry_decorator_preserves_metadata"
        ],
        "suggested_fix": "import functools\n\ndef retry_decorator(max_retries=3, base_delay=0.1):\n    \"\"\"Decorator version of retry_with_backoff.\"\"\"\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            return retry_with_backoff(\n                lambda: func(*args, **kwargs),\n                max_retries=max_retries,\n                base_delay=base_delay,\n            )\n        return wrapper\n    return decorator",
        "confidence": 1.0,
        "evidence": "actual_output: \"name='wrapper', doc='None'\", expected_output: \"name='sample_function', doc='Docstring for sample function.'\""
      },
      {
        "bug_id": "BUG-002",
        "root_cause": "When `CircuitBreaker` is in the `half_open` state and execution fails, `self.state` is not updated to `open` unless `self.failure_count` reaches `self.failure_threshold`. The specification requires any failure in `half_open` state to immediately transition back to `open`.",
        "severity": "high",
        "category": "state_bug",
        "failing_tests": [
          "edge_case_circuit_breaker_half_open_failure_state"
        ],
        "suggested_fix": "        except Exception as e:\n            self.failure_count += 1\n            self.last_failure_time = time.time()\n            \n            if self.state == \"half_open\" or self.failure_count >= self.failure_threshold:\n                self.state = \"open\"\n            \n            raise",
        "confidence": 1.0,
        "evidence": "actual_output: \"state='half_open'\", expected_output: \"state='open'\""
      }
    ],
    "bug_count": 2,
    "severity_breakdown": {
      "medium": 1,
      "high": 1
    },
    "fix_applied": true,
    "fix_improved": true,
    "post_fix_passed": 12,
    "post_fix_failed": 0,
    "test_results": [
      {
        "test_name": "happy_path_retry_success_first_try",
        "passed": true,
        "input_data": "my_func succeeds on 1st attempt",
        "expected_output": "result='ok', calls=1",
        "actual_output": "result='ok', calls=1",
        "stdout": "{\"passed\": true, \"input\": \"my_func succeeds on 1st attempt\", \"expected\": \"result='ok', calls=1\", \"actual\": \"result='ok', calls=1\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 90.05
      },
      {
        "test_name": "happy_path_retry_success_after_retries",
        "passed": true,
        "input_data": "func fails 2 times then succeeds",
        "expected_output": "result='success', calls=3",
        "actual_output": "result='success', calls=3",
        "stdout": "{\"passed\": true, \"input\": \"func fails 2 times then succeeds\", \"expected\": \"result='success', calls=3\", \"actual\": \"result='success', calls=3\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 100.64
      },
      {
        "test_name": "happy_path_circuit_breaker_closed_state",
        "passed": true,
        "input_data": "2 successful calls on closed CircuitBreaker",
        "expected_output": "res1=42, res2=100, state='closed', failure_count=0",
        "actual_output": "res1=42, res2=100, state='closed', failure_count=0",
        "stdout": "{\"passed\": true, \"input\": \"2 successful calls on closed CircuitBreaker\", \"expected\": \"res1=42, res2=100, state='closed', failure_count=0\", \"actual\": \"res1=42, res2=100, state='closed', failure_count=0\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 87.41
      },
      {
        "test_name": "edge_case_retry_decorator_preserves_metadata",
        "passed": false,
        "input_data": "Function decorated with @retry_decorator",
        "expected_output": "name='sample_function', doc='Docstring for sample function.'",
        "actual_output": "name='wrapper', doc='None'",
        "stdout": "{\"passed\": false, \"input\": \"Function decorated with @retry_decorator\", \"expected\": \"name='sample_function', doc='Docstring for sample function.'\", \"actual\": \"name='wrapper', doc='None'\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 88.44
      },
      {
        "test_name": "edge_case_non_retryable_exception_propagates",
        "passed": true,
        "input_data": "retryable_exceptions=(KeyError,), func raises TypeError",
        "expected_output": "TypeError caught immediately, calls=1",
        "actual_output": "TypeError caught=True, calls=1",
        "stdout": "{\"passed\": true, \"input\": \"retryable_exceptions=(KeyError,), func raises TypeError\", \"expected\": \"TypeError caught immediately, calls=1\", \"actual\": \"TypeError caught=True, calls=1\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 101.99
      },
      {
        "test_name": "edge_case_max_retries_zero",
        "passed": true,
        "input_data": "max_retries=0, func fails",
        "expected_output": "ValueError caught, calls=1",
        "actual_output": "ValueError caught=True, calls=1",
        "stdout": "{\"passed\": true, \"input\": \"max_retries=0, func fails\", \"expected\": \"ValueError caught, calls=1\", \"actual\": \"ValueError caught=True, calls=1\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 96.19
      },
      {
        "test_name": "edge_case_circuit_breaker_half_open_failure_state",
        "passed": false,
        "input_data": "CircuitBreaker failure in half_open state with threshold=5",
        "expected_output": "state='open'",
        "actual_output": "state='half_open'",
        "stdout": "{\"passed\": false, \"input\": \"CircuitBreaker failure in half_open state with threshold=5\", \"expected\": \"state='open'\", \"actual\": \"state='half_open'\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 115.68
      },
      {
        "test_name": "boundary_max_retries_exact_attempts",
        "passed": true,
        "input_data": "max_retries=3, func always fails",
        "expected_output": "total calls=4",
        "actual_output": "total calls=4",
        "stdout": "{\"passed\": true, \"input\": \"max_retries=3, func always fails\", \"expected\": \"total calls=4\", \"actual\": \"total calls=4\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 102.18
      },
      {
        "test_name": "boundary_delay_capped_at_max_delay",
        "passed": true,
        "input_data": "base_delay=10.0, max_delay=0.05",
        "expected_output": "elapsed < 1.0 seconds",
        "actual_output": "elapsed=0.050 seconds",
        "stdout": "{\"passed\": true, \"input\": \"base_delay=10.0, max_delay=0.05\", \"expected\": \"elapsed < 1.0 seconds\", \"actual\": \"elapsed=0.050 seconds\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 152.4
      },
      {
        "test_name": "boundary_circuit_breaker_threshold",
        "passed": true,
        "input_data": "3 failures with failure_threshold=3",
        "expected_output": "state after 2: 'closed', state after 3: 'open'",
        "actual_output": "state after 2: 'closed', state after 3: 'open'",
        "stdout": "{\"passed\": true, \"input\": \"3 failures with failure_threshold=3\", \"expected\": \"state after 2: 'closed', state after 3: 'open'\", \"actual\": \"state after 2: 'closed', state after 3: 'open'\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 91.34
      },
      {
        "test_name": "error_handling_all_retries_fail_raises_last_exception",
        "passed": true,
        "input_data": "Func fails 3 times raising unique messages",
        "expected_output": "attempt_3",
        "actual_output": "attempt_3",
        "stdout": "{\"passed\": true, \"input\": \"Func fails 3 times raising unique messages\", \"expected\": \"attempt_3\", \"actual\": \"attempt_3\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 98.29
      },
      {
        "test_name": "error_handling_circuit_breaker_open_raises_runtime_error",
        "passed": true,
        "input_data": "Call function while circuit breaker is open",
        "expected_output": "RuntimeError('Circuit breaker is open')",
        "actual_output": "raised_runtime=True, state='open'",
        "stdout": "{\"passed\": true, \"input\": \"Call function while circuit breaker is open\", \"expected\": \"RuntimeError('Circuit breaker is open')\", \"actual\": \"raised_runtime=True, state='open'\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 89.23
      }
    ],
    "post_fix_test_results": [
      {
        "test_name": "happy_path_retry_success_first_try",
        "passed": true,
        "input_data": "my_func succeeds on 1st attempt",
        "expected_output": "result='ok', calls=1",
        "actual_output": "result='ok', calls=1",
        "stdout": "{\"passed\": true, \"input\": \"my_func succeeds on 1st attempt\", \"expected\": \"result='ok', calls=1\", \"actual\": \"result='ok', calls=1\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 119.56
      },
      {
        "test_name": "happy_path_retry_success_after_retries",
        "passed": true,
        "input_data": "func fails 2 times then succeeds",
        "expected_output": "result='success', calls=3",
        "actual_output": "result='success', calls=3",
        "stdout": "{\"passed\": true, \"input\": \"func fails 2 times then succeeds\", \"expected\": \"result='success', calls=3\", \"actual\": \"result='success', calls=3\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 92.92
      },
      {
        "test_name": "happy_path_circuit_breaker_closed_state",
        "passed": true,
        "input_data": "2 successful calls on closed CircuitBreaker",
        "expected_output": "res1=42, res2=100, state='closed', failure_count=0",
        "actual_output": "res1=42, res2=100, state='closed', failure_count=0",
        "stdout": "{\"passed\": true, \"input\": \"2 successful calls on closed CircuitBreaker\", \"expected\": \"res1=42, res2=100, state='closed', failure_count=0\", \"actual\": \"res1=42, res2=100, state='closed', failure_count=0\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 93.29
      },
      {
        "test_name": "edge_case_retry_decorator_preserves_metadata",
        "passed": true,
        "input_data": "Function decorated with @retry_decorator",
        "expected_output": "name='sample_function', doc='Docstring for sample function.'",
        "actual_output": "name='sample_function', doc='Docstring for sample function.'",
        "stdout": "{\"passed\": true, \"input\": \"Function decorated with @retry_decorator\", \"expected\": \"name='sample_function', doc='Docstring for sample function.'\", \"actual\": \"name='sample_function', doc='Docstring for sample function.'\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 92.07
      },
      {
        "test_name": "edge_case_non_retryable_exception_propagates",
        "passed": true,
        "input_data": "retryable_exceptions=(KeyError,), func raises TypeError",
        "expected_output": "TypeError caught immediately, calls=1",
        "actual_output": "TypeError caught=True, calls=1",
        "stdout": "{\"passed\": true, \"input\": \"retryable_exceptions=(KeyError,), func raises TypeError\", \"expected\": \"TypeError caught immediately, calls=1\", \"actual\": \"TypeError caught=True, calls=1\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 89.5
      },
      {
        "test_name": "edge_case_max_retries_zero",
        "passed": true,
        "input_data": "max_retries=0, func fails",
        "expected_output": "ValueError caught, calls=1",
        "actual_output": "ValueError caught=True, calls=1",
        "stdout": "{\"passed\": true, \"input\": \"max_retries=0, func fails\", \"expected\": \"ValueError caught, calls=1\", \"actual\": \"ValueError caught=True, calls=1\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 87.11
      },
      {
        "test_name": "edge_case_circuit_breaker_half_open_failure_state",
        "passed": true,
        "input_data": "CircuitBreaker failure in half_open state with threshold=5",
        "expected_output": "state='open'",
        "actual_output": "state='open'",
        "stdout": "{\"passed\": true, \"input\": \"CircuitBreaker failure in half_open state with threshold=5\", \"expected\": \"state='open'\", \"actual\": \"state='open'\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 117.06
      },
      {
        "test_name": "boundary_max_retries_exact_attempts",
        "passed": true,
        "input_data": "max_retries=3, func always fails",
        "expected_output": "total calls=4",
        "actual_output": "total calls=4",
        "stdout": "{\"passed\": true, \"input\": \"max_retries=3, func always fails\", \"expected\": \"total calls=4\", \"actual\": \"total calls=4\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 109.91
      },
      {
        "test_name": "boundary_delay_capped_at_max_delay",
        "passed": true,
        "input_data": "base_delay=10.0, max_delay=0.05",
        "expected_output": "elapsed < 1.0 seconds",
        "actual_output": "elapsed=0.051 seconds",
        "stdout": "{\"passed\": true, \"input\": \"base_delay=10.0, max_delay=0.05\", \"expected\": \"elapsed < 1.0 seconds\", \"actual\": \"elapsed=0.051 seconds\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 154.95
      },
      {
        "test_name": "boundary_circuit_breaker_threshold",
        "passed": true,
        "input_data": "3 failures with failure_threshold=3",
        "expected_output": "state after 2: 'closed', state after 3: 'open'",
        "actual_output": "state after 2: 'closed', state after 3: 'open'",
        "stdout": "{\"passed\": true, \"input\": \"3 failures with failure_threshold=3\", \"expected\": \"state after 2: 'closed', state after 3: 'open'\", \"actual\": \"state after 2: 'closed', state after 3: 'open'\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 94.11
      },
      {
        "test_name": "error_handling_all_retries_fail_raises_last_exception",
        "passed": true,
        "input_data": "Func fails 3 times raising unique messages",
        "expected_output": "attempt_3",
        "actual_output": "attempt_3",
        "stdout": "{\"passed\": true, \"input\": \"Func fails 3 times raising unique messages\", \"expected\": \"attempt_3\", \"actual\": \"attempt_3\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 89.47
      },
      {
        "test_name": "error_handling_circuit_breaker_open_raises_runtime_error",
        "passed": true,
        "input_data": "Call function while circuit breaker is open",
        "expected_output": "RuntimeError('Circuit breaker is open')",
        "actual_output": "raised_runtime=True, state='open'",
        "stdout": "{\"passed\": true, \"input\": \"Call function while circuit breaker is open\", \"expected\": \"RuntimeError('Circuit breaker is open')\", \"actual\": \"raised_runtime=True, state='open'\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 89.42
      }
    ],
    "fixed_code": "import functools\nimport random\nimport time\n\n\ndef retry_with_backoff(\n    func,\n    max_retries: int = 3,\n    base_delay: float = 1.0,\n    max_delay: float = 30.0,\n    jitter: bool = True,\n    retryable_exceptions: tuple = (Exception,),\n):\n    \"\"\"Execute a function with exponential backoff retry logic.\n    \n    Args:\n        func: Callable to execute\n        max_retries: Maximum number of retry attempts\n        base_delay: Initial delay in seconds\n        max_delay: Maximum delay between retries\n        jitter: Add random jitter to prevent thundering herd\n        retryable_exceptions: Tuple of exception types to retry on\n    \n    Returns:\n        The return value of func() on success\n    \n    Raises:\n        The last exception if all retries are exhausted\n    \"\"\"\n    attempt = 0\n    last_exception = None\n    \n    while True:\n        try:\n            return func()\n        except retryable_exceptions as e:\n            last_exception = e\n            attempt += 1\n            \n            if attempt > max_retries:\n                break\n            \n            # Calculate delay with exponential backoff\n            delay = min(base_delay * (2 ** (attempt - 1)), max_delay)\n            \n            if jitter:\n                delay = delay * (0.5 + random.random() * 0.5)\n            \n            time.sleep(delay)\n    \n    raise last_exception\n\n\ndef retry_decorator(max_retries=3, base_delay=0.1):\n    \"\"\"Decorator version of retry_with_backoff.\"\"\"\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            return retry_with_backoff(\n                lambda: func(*args, **kwargs),\n                max_retries=max_retries,\n                base_delay=base_delay,\n            )\n        return wrapper\n    return decorator\n\n\nclass CircuitBreaker:\n    \"\"\"Simple circuit breaker pattern.\n    \n    Opens the circuit after `failure_threshold` consecutive failures.\n    Allows a retry after `recovery_timeout` seconds.\n    \"\"\"\n    \n    def __init__(self, failure_threshold: int = 5, recovery_timeout: float = 30.0):\n        self.failure_threshold = failure_threshold\n        self.recovery_timeout = recovery_timeout\n        self.failure_count = 0\n        self.last_failure_time = None\n        self.state = \"closed\"  # closed = normal, open = failing, half_open = testing\n    \n    def call(self, func):\n        \"\"\"Execute func through the circuit breaker.\"\"\"\n        if self.state == \"open\":\n            if self.last_failure_time and \\\n               time.time() - self.last_failure_time > self.recovery_timeout:\n                self.state = \"half_open\"\n            else:\n                raise RuntimeError(\"Circuit breaker is open\")\n        \n        try:\n            result = func()\n            if self.state == \"half_open\":\n                self.state = \"closed\"\n            self.failure_count = 0\n            return result\n        except Exception as e:\n            self.failure_count += 1\n            self.last_failure_time = time.time()\n            \n            if self.state == \"half_open\" or self.failure_count >= self.failure_threshold:\n                self.state = \"open\"\n            \n            raise",
    "original_code": "\"\"\"\nCase 07: Retry with Exponential Backoff \u2014 Infinite loop on permanent failures\n\nA retry decorator that loops forever if max_retries is not properly enforced.\n\"\"\"\n\nimport time\nimport random\n\n\ndef retry_with_backoff(\n    func,\n    max_retries: int = 3,\n    base_delay: float = 1.0,\n    max_delay: float = 30.0,\n    jitter: bool = True,\n    retryable_exceptions: tuple = (Exception,),\n):\n    \"\"\"Execute a function with exponential backoff retry logic.\n    \n    Args:\n        func: Callable to execute\n        max_retries: Maximum number of retry attempts\n        base_delay: Initial delay in seconds\n        max_delay: Maximum delay between retries\n        jitter: Add random jitter to prevent thundering herd\n        retryable_exceptions: Tuple of exception types to retry on\n    \n    Returns:\n        The return value of func() on success\n    \n    Raises:\n        The last exception if all retries are exhausted\n    \"\"\"\n    attempt = 0\n    last_exception = None\n    \n    while True:\n        try:\n            return func()\n        except retryable_exceptions as e:\n            last_exception = e\n            attempt += 1\n            \n            if attempt > max_retries:\n                break\n            \n            # Calculate delay with exponential backoff\n            delay = min(base_delay * (2 ** (attempt - 1)), max_delay)\n            \n            if jitter:\n                delay = delay * (0.5 + random.random() * 0.5)\n            \n            time.sleep(delay)\n    \n    raise last_exception\n\n\ndef retry_decorator(max_retries=3, base_delay=0.1):\n    \"\"\"Decorator version of retry_with_backoff.\"\"\"\n    def decorator(func):\n        def wrapper(*args, **kwargs):\n            return retry_with_backoff(\n                lambda: func(*args, **kwargs),\n                max_retries=max_retries,\n                base_delay=base_delay,\n            )\n        return wrapper\n    return decorator\n\n\nclass CircuitBreaker:\n    \"\"\"Simple circuit breaker pattern.\n    \n    Opens the circuit after `failure_threshold` consecutive failures.\n    Allows a retry after `recovery_timeout` seconds.\n    \"\"\"\n    \n    def __init__(self, failure_threshold: int = 5, recovery_timeout: float = 30.0):\n        self.failure_threshold = failure_threshold\n        self.recovery_timeout = recovery_timeout\n        self.failure_count = 0\n        self.last_failure_time = None\n        self.state = \"closed\"  # closed = normal, open = failing, half_open = testing\n    \n    def call(self, func):\n        \"\"\"Execute func through the circuit breaker.\"\"\"\n        if self.state == \"open\":\n            if self.last_failure_time and \\\n               time.time() - self.last_failure_time > self.recovery_timeout:\n                self.state = \"half_open\"\n            else:\n                raise RuntimeError(\"Circuit breaker is open\")\n        \n        try:\n            result = func()\n            if self.state == \"half_open\":\n                self.state = \"closed\"\n            self.failure_count = 0  # Actually this is here, but...\n            return result\n        except Exception as e:\n            self.failure_count += 1\n            self.last_failure_time = time.time()\n            \n            if self.failure_count >= self.failure_threshold:\n                self.state = \"open\"\n            \n            raise\n",
    "total_time_seconds": 80.13,
    "trajectory": [
      {
        "timestamp": "2026-08-29T16:32:45Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior test engineer specializing in catching bugs in AI-generated code.\n\nYour job is to generate test cases that will EXECUTE against the provided code to verify it works correctly.\nFocus e...",
        "prompt_preview": "Analyze this code and its specification, then generate exactly 12 test cases.\n\n## SPECIFICATION (what the code SHOULD do):\n# Retry with Backoff Specification\n\n## retry_with_backoff(func, max_retries=3, base_delay=1.0, max_delay=30.0, jitter=True, retryable_exceptions=(Exception,))\n\nExecutes a functi...",
        "prompt_length": 6293,
        "response_preview": "[\n  {\n    \"name\": \"happy_path_retry_success_first_try\",\n    \"category\": \"happy_path\",\n    \"test_code\": \"import json\\n\\ncalls = 0\\ndef my_func():\\n    global calls\\n    calls += 1\\n    return \\\"ok\\\"\\n\\nres = retry_with_backoff(my_func, max_retries=3, base_delay=0.01)\\npassed = (res == \\\"ok\\\" and call...",
        "response_length": 9275,
        "latency_seconds": 47.84,
        "temperature": 0.3,
        "request_number": 7
      },
      {
        "timestamp": "2026-08-29T16:32:58Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior debugging engineer. You are given:\n1. Source code that was generated by an AI\n2. A specification of what the code should do\n3. Test results showing which tests passed and which failed...",
        "prompt_preview": "Analyze these test failures for the code below.\n\n## SPECIFICATION:\n# Retry with Backoff Specification\n\n## retry_with_backoff(func, max_retries=3, base_delay=1.0, max_delay=30.0, jitter=True, retryable_exceptions=(Exception,))\n\nExecutes a function with exponential backoff retry logic.\n\n### Behavior:\n...",
        "prompt_length": 12023,
        "response_preview": "[\n  {\n    \"bug_id\": \"BUG-001\",\n    \"root_cause\": \"The `retry_decorator` inner function `wrapper` is not decorated with `functools.wraps(func)`, causing decorated functions to lose metadata like `__name__` and `__doc__`.\",\n    \"severity\": \"medium\",\n    \"category\": \"logic_error\",\n    \"failing_tests\": ...",
        "response_length": 1922,
        "latency_seconds": 11.58,
        "temperature": 0.1,
        "request_number": 8
      },
      {
        "timestamp": "2026-08-29T16:33:16Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior software engineer fixing bugs in AI-generated code.\n\nYou are given:\n1. The original buggy code\n2. The specification of what it should do\n3. Diagnosed bugs with root causes and evidenc...",
        "prompt_preview": "Fix the bugs in this code.\n\n## SPECIFICATION:\n# Retry with Backoff Specification\n\n## retry_with_backoff(func, max_retries=3, base_delay=1.0, max_delay=30.0, jitter=True, retryable_exceptions=(Exception,))\n\nExecutes a function with exponential backoff retry logic.\n\n### Behavior:\n- Calls `func()` and ...",
        "prompt_length": 7242,
        "response_preview": "import functools\nimport random\nimport time\n\n\ndef retry_with_backoff(\n    func,\n    max_retries: int = 3,\n    base_delay: float = 1.0,\n    max_delay: float = 30.0,\n    jitter: bool = True,\n    retryable_exceptions: tuple = (Exception,),\n):\n    \"\"\"Execute a function with exponential backoff retry logi...",
        "response_length": 3159,
        "latency_seconds": 18.23,
        "temperature": 0.1,
        "request_number": 9
      }
    ]
  },
  {
    "case_id": "case_08_date_utils",
    "spec_summary": "# Date Range Calculator Specification\n\n## days_between(date1_str, date2_str, fmt=\"%Y-%m-%d\") -> int\nReturns the absolute number of days between two dates.\n\n## add_months(date_str, months, fmt=\"%Y-%m-%",
    "total_tests": 12,
    "tests_passed": 9,
    "tests_failed": 3,
    "bugs_found": [
      {
        "bug_id": "BUG-001",
        "root_cause": "In `get_date_range`, the loop condition `while current < end:` excludes the `end` date. According to the specification, the date range must be inclusive of both start and end endpoints.",
        "severity": "high",
        "category": "off_by_one",
        "failing_tests": [
          "get_date_range_includes_end_date",
          "get_date_range_same_start_and_end",
          "get_date_range_swapped_dates"
        ],
        "suggested_fix": "while current <= end:",
        "confidence": 1.0,
        "evidence": "Input '2024-01-01 to 2024-01-03' produced actual_output: \"['2024-01-01', '2024-01-02']\" instead of expected_output: \"['2024-01-01', '2024-01-02', '2024-01-03']\""
      }
    ],
    "bug_count": 1,
    "severity_breakdown": {
      "high": 1
    },
    "fix_applied": true,
    "fix_improved": true,
    "post_fix_passed": 12,
    "post_fix_failed": 0,
    "test_results": [
      {
        "test_name": "days_between_happy_path",
        "passed": true,
        "input_data": "2024-01-01 to 2024-01-10",
        "expected_output": "9",
        "actual_output": "9",
        "stdout": "{\"passed\": true, \"input\": \"2024-01-01 to 2024-01-10\", \"expected\": \"9\", \"actual\": \"9\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 109.02
      },
      {
        "test_name": "add_months_happy_path",
        "passed": true,
        "input_data": "2024-05-15 + 3 months",
        "expected_output": "2024-08-15",
        "actual_output": "2024-08-15",
        "stdout": "{\"passed\": true, \"input\": \"2024-05-15 + 3 months\", \"expected\": \"2024-08-15\", \"actual\": \"2024-08-15\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 93.39
      },
      {
        "test_name": "is_business_day_happy_path",
        "passed": true,
        "input_data": "2024-03-15 (Friday)",
        "expected_output": "True",
        "actual_output": "True",
        "stdout": "{\"passed\": true, \"input\": \"2024-03-15 (Friday)\", \"expected\": \"True\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 94.21
      },
      {
        "test_name": "get_date_range_includes_end_date",
        "passed": false,
        "input_data": "2024-01-01 to 2024-01-03",
        "expected_output": "['2024-01-01', '2024-01-02', '2024-01-03']",
        "actual_output": "['2024-01-01', '2024-01-02']",
        "stdout": "{\"passed\": false, \"input\": \"2024-01-01 to 2024-01-03\", \"expected\": \"['2024-01-01', '2024-01-02', '2024-01-03']\", \"actual\": \"['2024-01-01', '2024-01-02']\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 99.53
      },
      {
        "test_name": "get_date_range_same_start_and_end",
        "passed": false,
        "input_data": "2024-01-01 to 2024-01-01",
        "expected_output": "['2024-01-01']",
        "actual_output": "[]",
        "stdout": "{\"passed\": false, \"input\": \"2024-01-01 to 2024-01-01\", \"expected\": \"['2024-01-01']\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 93.9
      },
      {
        "test_name": "add_months_leap_year_clamp",
        "passed": true,
        "input_data": "2024-01-31 + 1 month in leap year",
        "expected_output": "2024-02-29",
        "actual_output": "2024-02-29",
        "stdout": "{\"passed\": true, \"input\": \"2024-01-31 + 1 month in leap year\", \"expected\": \"2024-02-29\", \"actual\": \"2024-02-29\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 92.96
      },
      {
        "test_name": "get_date_range_swapped_dates",
        "passed": false,
        "input_data": "start=2024-01-03, end=2024-01-01",
        "expected_output": "['2024-01-01', '2024-01-02', '2024-01-03']",
        "actual_output": "['2024-01-01', '2024-01-02']",
        "stdout": "{\"passed\": false, \"input\": \"start=2024-01-03, end=2024-01-01\", \"expected\": \"['2024-01-01', '2024-01-02', '2024-01-03']\", \"actual\": \"['2024-01-01', '2024-01-02']\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 94.35
      },
      {
        "test_name": "add_months_non_leap_year_clamp",
        "passed": true,
        "input_data": "2023-01-31 + 1 month in non-leap year",
        "expected_output": "2023-02-28",
        "actual_output": "2023-02-28",
        "stdout": "{\"passed\": true, \"input\": \"2023-01-31 + 1 month in non-leap year\", \"expected\": \"2023-02-28\", \"actual\": \"2023-02-28\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 94.94
      },
      {
        "test_name": "next_business_day_friday_to_monday",
        "passed": true,
        "input_data": "2024-03-15 (Friday)",
        "expected_output": "2024-03-18",
        "actual_output": "2024-03-18",
        "stdout": "{\"passed\": true, \"input\": \"2024-03-15 (Friday)\", \"expected\": \"2024-03-18\", \"actual\": \"2024-03-18\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 91.76
      },
      {
        "test_name": "days_between_across_leap_day",
        "passed": true,
        "input_data": "2024-02-28 to 2024-03-01",
        "expected_output": "2",
        "actual_output": "2",
        "stdout": "{\"passed\": true, \"input\": \"2024-02-28 to 2024-03-01\", \"expected\": \"2\", \"actual\": \"2\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 91.94
      },
      {
        "test_name": "days_between_invalid_format",
        "passed": true,
        "input_data": "date1_str=\"invalid-date\"",
        "expected_output": "ValueError raised",
        "actual_output": "ValueError raised",
        "stdout": "{\"passed\": true, \"input\": \"date1_str=\\\"invalid-date\\\"\", \"expected\": \"ValueError raised\", \"actual\": \"ValueError raised\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 108.85
      },
      {
        "test_name": "add_months_invalid_month_out_of_range",
        "passed": true,
        "input_data": "date_str=\"2024-13-01\"",
        "expected_output": "ValueError raised",
        "actual_output": "ValueError raised",
        "stdout": "{\"passed\": true, \"input\": \"date_str=\\\"2024-13-01\\\"\", \"expected\": \"ValueError raised\", \"actual\": \"ValueError raised\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 111.2
      }
    ],
    "post_fix_test_results": [
      {
        "test_name": "days_between_happy_path",
        "passed": true,
        "input_data": "2024-01-01 to 2024-01-10",
        "expected_output": "9",
        "actual_output": "9",
        "stdout": "{\"passed\": true, \"input\": \"2024-01-01 to 2024-01-10\", \"expected\": \"9\", \"actual\": \"9\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 103.61
      },
      {
        "test_name": "add_months_happy_path",
        "passed": true,
        "input_data": "2024-05-15 + 3 months",
        "expected_output": "2024-08-15",
        "actual_output": "2024-08-15",
        "stdout": "{\"passed\": true, \"input\": \"2024-05-15 + 3 months\", \"expected\": \"2024-08-15\", \"actual\": \"2024-08-15\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 90.07
      },
      {
        "test_name": "is_business_day_happy_path",
        "passed": true,
        "input_data": "2024-03-15 (Friday)",
        "expected_output": "True",
        "actual_output": "True",
        "stdout": "{\"passed\": true, \"input\": \"2024-03-15 (Friday)\", \"expected\": \"True\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 89.45
      },
      {
        "test_name": "get_date_range_includes_end_date",
        "passed": true,
        "input_data": "2024-01-01 to 2024-01-03",
        "expected_output": "['2024-01-01', '2024-01-02', '2024-01-03']",
        "actual_output": "['2024-01-01', '2024-01-02', '2024-01-03']",
        "stdout": "{\"passed\": true, \"input\": \"2024-01-01 to 2024-01-03\", \"expected\": \"['2024-01-01', '2024-01-02', '2024-01-03']\", \"actual\": \"['2024-01-01', '2024-01-02', '2024-01-03']\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 91.04
      },
      {
        "test_name": "get_date_range_same_start_and_end",
        "passed": true,
        "input_data": "2024-01-01 to 2024-01-01",
        "expected_output": "['2024-01-01']",
        "actual_output": "['2024-01-01']",
        "stdout": "{\"passed\": true, \"input\": \"2024-01-01 to 2024-01-01\", \"expected\": \"['2024-01-01']\", \"actual\": \"['2024-01-01']\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 88.34
      },
      {
        "test_name": "add_months_leap_year_clamp",
        "passed": true,
        "input_data": "2024-01-31 + 1 month in leap year",
        "expected_output": "2024-02-29",
        "actual_output": "2024-02-29",
        "stdout": "{\"passed\": true, \"input\": \"2024-01-31 + 1 month in leap year\", \"expected\": \"2024-02-29\", \"actual\": \"2024-02-29\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 93.23
      },
      {
        "test_name": "get_date_range_swapped_dates",
        "passed": true,
        "input_data": "start=2024-01-03, end=2024-01-01",
        "expected_output": "['2024-01-01', '2024-01-02', '2024-01-03']",
        "actual_output": "['2024-01-01', '2024-01-02', '2024-01-03']",
        "stdout": "{\"passed\": true, \"input\": \"start=2024-01-03, end=2024-01-01\", \"expected\": \"['2024-01-01', '2024-01-02', '2024-01-03']\", \"actual\": \"['2024-01-01', '2024-01-02', '2024-01-03']\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 105.91
      },
      {
        "test_name": "add_months_non_leap_year_clamp",
        "passed": true,
        "input_data": "2023-01-31 + 1 month in non-leap year",
        "expected_output": "2023-02-28",
        "actual_output": "2023-02-28",
        "stdout": "{\"passed\": true, \"input\": \"2023-01-31 + 1 month in non-leap year\", \"expected\": \"2023-02-28\", \"actual\": \"2023-02-28\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 90.94
      },
      {
        "test_name": "next_business_day_friday_to_monday",
        "passed": true,
        "input_data": "2024-03-15 (Friday)",
        "expected_output": "2024-03-18",
        "actual_output": "2024-03-18",
        "stdout": "{\"passed\": true, \"input\": \"2024-03-15 (Friday)\", \"expected\": \"2024-03-18\", \"actual\": \"2024-03-18\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 91.36
      },
      {
        "test_name": "days_between_across_leap_day",
        "passed": true,
        "input_data": "2024-02-28 to 2024-03-01",
        "expected_output": "2",
        "actual_output": "2",
        "stdout": "{\"passed\": true, \"input\": \"2024-02-28 to 2024-03-01\", \"expected\": \"2\", \"actual\": \"2\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 106.1
      },
      {
        "test_name": "days_between_invalid_format",
        "passed": true,
        "input_data": "date1_str=\"invalid-date\"",
        "expected_output": "ValueError raised",
        "actual_output": "ValueError raised",
        "stdout": "{\"passed\": true, \"input\": \"date1_str=\\\"invalid-date\\\"\", \"expected\": \"ValueError raised\", \"actual\": \"ValueError raised\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 89.28
      },
      {
        "test_name": "add_months_invalid_month_out_of_range",
        "passed": true,
        "input_data": "date_str=\"2024-13-01\"",
        "expected_output": "ValueError raised",
        "actual_output": "ValueError raised",
        "stdout": "{\"passed\": true, \"input\": \"date_str=\\\"2024-13-01\\\"\", \"expected\": \"ValueError raised\", \"actual\": \"ValueError raised\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 90.86
      }
    ],
    "fixed_code": "from datetime import datetime, timedelta\nimport calendar\n\n\ndef days_between(date1_str: str, date2_str: str, fmt: str = \"%Y-%m-%d\") -> int:\n    \"\"\"Calculate the number of days between two dates.\n    \n    Args:\n        date1_str: First date string\n        date2_str: Second date string\n        fmt: Date format string\n    \n    Returns:\n        Absolute number of days between the two dates\n    \"\"\"\n    d1 = datetime.strptime(date1_str, fmt)\n    d2 = datetime.strptime(date2_str, fmt)\n    return abs((d2 - d1).days)\n\n\ndef add_months(date_str: str, months: int, fmt: str = \"%Y-%m-%d\") -> str:\n    \"\"\"Add a number of months to a date.\n    \n    If the resulting day doesn't exist in the target month (e.g., Jan 31 + 1 month),\n    clamp to the last day of the target month.\n    \n    Args:\n        date_str: Starting date string\n        months: Number of months to add (can be negative)\n        fmt: Date format string\n    \n    Returns:\n        The resulting date string\n    \"\"\"\n    dt = datetime.strptime(date_str, fmt)\n    \n    total_months = dt.month + months - 1\n    new_year = dt.year + total_months // 12\n    new_month = total_months % 12 + 1\n    \n    max_day = calendar.monthrange(new_year, new_month)[1]\n    new_day = min(dt.day, max_day)\n    \n    result = dt.replace(year=new_year, month=new_month, day=new_day)\n    return result.strftime(fmt)\n\n\ndef get_date_range(start_str: str, end_str: str, fmt: str = \"%Y-%m-%d\") -> list[str]:\n    \"\"\"Generate a list of all dates between start and end (inclusive).\n    \n    Args:\n        start_str: Start date string\n        end_str: End date string\n        fmt: Date format string\n    \n    Returns:\n        List of date strings from start to end (inclusive)\n    \"\"\"\n    start = datetime.strptime(start_str, fmt)\n    end = datetime.strptime(end_str, fmt)\n    \n    if start > end:\n        start, end = end, start\n    \n    dates = []\n    current = start\n    while current <= end:\n        dates.append(current.strftime(fmt))\n        current += timedelta(days=1)\n    \n    return dates\n\n\ndef is_business_day(date_str: str, fmt: str = \"%Y-%m-%d\") -> bool:\n    \"\"\"Check if a date is a business day (Monday-Friday).\"\"\"\n    dt = datetime.strptime(date_str, fmt)\n    return dt.weekday() < 5\n\n\ndef next_business_day(date_str: str, fmt: str = \"%Y-%m-%d\") -> str:\n    \"\"\"Get the next business day after the given date.\"\"\"\n    dt = datetime.strptime(date_str, fmt)\n    dt += timedelta(days=1)\n    while dt.weekday() >= 5:\n        dt += timedelta(days=1)\n    return dt.strftime(fmt)",
    "original_code": "\"\"\"\nCase 08: Date Range Calculator \u2014 Wrong output for leap years and month boundaries\n\nDate utilities that handle most cases but fail on leap year edge cases\nand month boundary calculations.\n\"\"\"\n\nfrom datetime import datetime, timedelta\n\n\ndef days_between(date1_str: str, date2_str: str, fmt: str = \"%Y-%m-%d\") -> int:\n    \"\"\"Calculate the number of days between two dates.\n    \n    Args:\n        date1_str: First date string\n        date2_str: Second date string\n        fmt: Date format string\n    \n    Returns:\n        Absolute number of days between the two dates\n    \"\"\"\n    d1 = datetime.strptime(date1_str, fmt)\n    d2 = datetime.strptime(date2_str, fmt)\n    return abs((d2 - d1).days)\n\n\ndef add_months(date_str: str, months: int, fmt: str = \"%Y-%m-%d\") -> str:\n    \"\"\"Add a number of months to a date.\n    \n    If the resulting day doesn't exist in the target month (e.g., Jan 31 + 1 month),\n    clamp to the last day of the target month.\n    \n    Args:\n        date_str: Starting date string\n        months: Number of months to add (can be negative)\n        fmt: Date format string\n    \n    Returns:\n        The resulting date string\n    \"\"\"\n    dt = datetime.strptime(date_str, fmt)\n    \n    # Calculate new month and year\n    total_months = dt.month + months - 1\n    new_year = dt.year + total_months // 12\n    new_month = total_months % 12 + 1\n    \n    # When months is negative and total_months goes below 0,\n    # Python's // and % handle negatives differently than expected\n    # E.g., month=1, months=-1: total_months = -1\n    # -1 // 12 = -1 (not 0), -1 % 12 = 11 (not -1)\n    # So new_year = year - 1, new_month = 12 \u2014 which is actually correct for this case\n    # But month=1, months=-13: total_months = -13\n    # -13 // 12 = -2, -13 % 12 = 11 \u2192 year-2, month 12 \u2014 should be year-2, month 12 \u2713\n    # Actually the math works for negatives in Python! Let me add a different bug...\n    \n    # Clamp day to valid range for the new month\n    import calendar\n    max_day = calendar.monthrange(new_year, new_month)[1]\n    new_day = min(dt.day, max_day)\n    \n    result = dt.replace(year=new_year, month=new_month, day=new_day)\n    return result.strftime(fmt)\n\n\ndef get_date_range(start_str: str, end_str: str, fmt: str = \"%Y-%m-%d\") -> list[str]:\n    \"\"\"Generate a list of all dates between start and end (inclusive).\n    \n    Args:\n        start_str: Start date string\n        end_str: End date string\n        fmt: Date format string\n    \n    Returns:\n        List of date strings from start to end (inclusive)\n    \"\"\"\n    start = datetime.strptime(start_str, fmt)\n    end = datetime.strptime(end_str, fmt)\n    \n    if start > end:\n        start, end = end, start\n    \n    dates = []\n    current = start\n    while current < end:\n        dates.append(current.strftime(fmt))\n        current += timedelta(days=1)\n    \n    return dates\n\n\ndef is_business_day(date_str: str, fmt: str = \"%Y-%m-%d\") -> bool:\n    \"\"\"Check if a date is a business day (Monday-Friday).\"\"\"\n    dt = datetime.strptime(date_str, fmt)\n    return dt.weekday() < 5  # 0=Monday, 4=Friday\n\n\ndef next_business_day(date_str: str, fmt: str = \"%Y-%m-%d\") -> str:\n    \"\"\"Get the next business day after the given date.\"\"\"\n    dt = datetime.strptime(date_str, fmt)\n    dt += timedelta(days=1)\n    while dt.weekday() >= 5:\n        dt += timedelta(days=1)\n    return dt.strftime(fmt)\n",
    "total_time_seconds": 47.35,
    "trajectory": [
      {
        "timestamp": "2026-08-29T16:33:43Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior test engineer specializing in catching bugs in AI-generated code.\n\nYour job is to generate test cases that will EXECUTE against the provided code to verify it works correctly.\nFocus e...",
        "prompt_preview": "Analyze this code and its specification, then generate exactly 12 test cases.\n\n## SPECIFICATION (what the code SHOULD do):\n# Date Range Calculator Specification\n\n## days_between(date1_str, date2_str, fmt=\"%Y-%m-%d\") -> int\nReturns the absolute number of days between two dates.\n\n## add_months(date_st...",
        "prompt_length": 5828,
        "response_preview": "[\n  {\n    \"name\": \"days_between_happy_path\",\n    \"category\": \"happy_path\",\n    \"test_code\": \"actual = days_between('2024-01-01', '2024-01-10')\\nexpected = 9\\npassed = actual == expected\\nprint(json.dumps({'passed': passed, 'input': '2024-01-01 to 2024-01-10', 'expected': str(expected), 'actual': str...",
        "response_length": 5594,
        "latency_seconds": 25.38,
        "temperature": 0.3,
        "request_number": 10
      },
      {
        "timestamp": "2026-08-29T16:33:50Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior debugging engineer. You are given:\n1. Source code that was generated by an AI\n2. A specification of what the code should do\n3. Test results showing which tests passed and which failed...",
        "prompt_preview": "Analyze these test failures for the code below.\n\n## SPECIFICATION:\n# Date Range Calculator Specification\n\n## days_between(date1_str, date2_str, fmt=\"%Y-%m-%d\") -> int\nReturns the absolute number of days between two dates.\n\n## add_months(date_str, months, fmt=\"%Y-%m-%d\") -> str\nAdds months to a date....",
        "prompt_length": 10376,
        "response_preview": "[\n  {\n    \"bug_id\": \"BUG-001\",\n    \"root_cause\": \"In `get_date_range`, the loop condition `while current < end:` excludes the `end` date. According to the specification, the date range must be inclusive of both start and end endpoints.\",\n    \"severity\": \"high\",\n    \"category\": \"off_by_one\",\n    \"fai...",
        "response_length": 701,
        "latency_seconds": 5.93,
        "temperature": 0.1,
        "request_number": 11
      },
      {
        "timestamp": "2026-08-29T16:34:04Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior software engineer fixing bugs in AI-generated code.\n\nYou are given:\n1. The original buggy code\n2. The specification of what it should do\n3. Diagnosed bugs with root causes and evidenc...",
        "prompt_preview": "Fix the bugs in this code.\n\n## SPECIFICATION:\n# Date Range Calculator Specification\n\n## days_between(date1_str, date2_str, fmt=\"%Y-%m-%d\") -> int\nReturns the absolute number of days between two dates.\n\n## add_months(date_str, months, fmt=\"%Y-%m-%d\") -> str\nAdds months to a date. Handles month-end cl...",
        "prompt_length": 5556,
        "response_preview": "from datetime import datetime, timedelta\nimport calendar\n\n\ndef days_between(date1_str: str, date2_str: str, fmt: str = \"%Y-%m-%d\") -> int:\n    \"\"\"Calculate the number of days between two dates.\n    \n    Args:\n        date1_str: First date string\n        date2_str: Second date string\n        fmt: Dat...",
        "response_length": 2506,
        "latency_seconds": 13.71,
        "temperature": 0.1,
        "request_number": 12
      }
    ]
  },
  {
    "case_id": "case_09_permissions",
    "spec_summary": "# Permission Checker Specification\n\n## PermissionChecker(custom_roles=None)\n\nRole-based access control (RBAC) system.\n\n### has_permission(role, action) -> bool\n- Returns True if the given role has the",
    "total_tests": 12,
    "tests_passed": 10,
    "tests_failed": 2,
    "bugs_found": [
      {
        "bug_id": "BUG-001",
        "root_cause": "The ownership check uses `if user_id == owner_id:`, which evaluates to `True` when both `user_id` and `owner_id` are `None` (or missing from the dictionary). This violates the requirement that unauthenticated users (`id=None`) must not be treated as owners of unowned resources (`owner_id=None`).",
        "severity": "high",
        "category": "logic_error",
        "failing_tests": [
          "none_user_none_owner_access",
          "missing_user_id_missing_owner_id"
        ],
        "suggested_fix": "if user_id is not None and user_id == owner_id:\n    return {\"allowed\": True, \"reason\": \"Resource owner\"}",
        "confidence": 1.0,
        "evidence": "test_name: none_user_none_owner_access, expected: False, actual: True; test_name: missing_user_id_missing_owner_id, expected: False, actual: True"
      }
    ],
    "bug_count": 1,
    "severity_breakdown": {
      "high": 1
    },
    "fix_applied": true,
    "fix_improved": true,
    "post_fix_passed": 12,
    "post_fix_failed": 0,
    "test_results": [
      {
        "test_name": "admin_read_access",
        "passed": true,
        "input_data": "admin reading private resource",
        "expected_output": "True",
        "actual_output": "True",
        "stdout": "{\"passed\": true, \"input\": \"admin reading private resource\", \"expected\": \"True\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 93.43
      },
      {
        "test_name": "public_resource_read",
        "passed": true,
        "input_data": "guest reading public resource",
        "expected_output": "True",
        "actual_output": "True",
        "stdout": "{\"passed\": true, \"input\": \"guest reading public resource\", \"expected\": \"True\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 86.42
      },
      {
        "test_name": "owner_resource_access",
        "passed": true,
        "input_data": "owner deleting own resource",
        "expected_output": "True",
        "actual_output": "True",
        "stdout": "{\"passed\": true, \"input\": \"owner deleting own resource\", \"expected\": \"True\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 84.54
      },
      {
        "test_name": "none_user_none_owner_access",
        "passed": false,
        "input_data": "user id=None, owner_id=None, action=delete",
        "expected_output": "False",
        "actual_output": "True",
        "stdout": "{\"passed\": false, \"input\": \"user id=None, owner_id=None, action=delete\", \"expected\": \"False\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 86.3
      },
      {
        "test_name": "missing_user_id_missing_owner_id",
        "passed": false,
        "input_data": "missing user id and missing owner id",
        "expected_output": "False",
        "actual_output": "True",
        "stdout": "{\"passed\": false, \"input\": \"missing user id and missing owner id\", \"expected\": \"False\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 83.5
      },
      {
        "test_name": "unknown_role_access",
        "passed": true,
        "input_data": "unknown role super_hacker",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"unknown role super_hacker\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 83.4
      },
      {
        "test_name": "empty_string_role_access",
        "passed": true,
        "input_data": "empty string role",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"empty string role\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 81.2
      },
      {
        "test_name": "public_resource_write_denied",
        "passed": true,
        "input_data": "guest writing to public resource",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"guest writing to public resource\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 86.75
      },
      {
        "test_name": "custom_roles_constructor",
        "passed": true,
        "input_data": "custom role auditor with permission audit",
        "expected_output": "True",
        "actual_output": "True",
        "stdout": "{\"passed\": true, \"input\": \"custom role auditor with permission audit\", \"expected\": \"True\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 100.61
      },
      {
        "test_name": "viewer_delete_denied",
        "passed": true,
        "input_data": "viewer deleting non-owned resource",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"viewer deleting non-owned resource\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 82.54
      },
      {
        "test_name": "missing_role_key_denied",
        "passed": true,
        "input_data": "user dict missing role key",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"user dict missing role key\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 81.85
      },
      {
        "test_name": "explicit_none_role_denied",
        "passed": true,
        "input_data": "user dict with explicit role=None",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"user dict with explicit role=None\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 84.71
      }
    ],
    "post_fix_test_results": [
      {
        "test_name": "admin_read_access",
        "passed": true,
        "input_data": "admin reading private resource",
        "expected_output": "True",
        "actual_output": "True",
        "stdout": "{\"passed\": true, \"input\": \"admin reading private resource\", \"expected\": \"True\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 98.86
      },
      {
        "test_name": "public_resource_read",
        "passed": true,
        "input_data": "guest reading public resource",
        "expected_output": "True",
        "actual_output": "True",
        "stdout": "{\"passed\": true, \"input\": \"guest reading public resource\", \"expected\": \"True\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 89.88
      },
      {
        "test_name": "owner_resource_access",
        "passed": true,
        "input_data": "owner deleting own resource",
        "expected_output": "True",
        "actual_output": "True",
        "stdout": "{\"passed\": true, \"input\": \"owner deleting own resource\", \"expected\": \"True\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 84.33
      },
      {
        "test_name": "none_user_none_owner_access",
        "passed": true,
        "input_data": "user id=None, owner_id=None, action=delete",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"user id=None, owner_id=None, action=delete\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 95.52
      },
      {
        "test_name": "missing_user_id_missing_owner_id",
        "passed": true,
        "input_data": "missing user id and missing owner id",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"missing user id and missing owner id\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 103.47
      },
      {
        "test_name": "unknown_role_access",
        "passed": true,
        "input_data": "unknown role super_hacker",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"unknown role super_hacker\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 106.51
      },
      {
        "test_name": "empty_string_role_access",
        "passed": true,
        "input_data": "empty string role",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"empty string role\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 100.68
      },
      {
        "test_name": "public_resource_write_denied",
        "passed": true,
        "input_data": "guest writing to public resource",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"guest writing to public resource\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 93.13
      },
      {
        "test_name": "custom_roles_constructor",
        "passed": true,
        "input_data": "custom role auditor with permission audit",
        "expected_output": "True",
        "actual_output": "True",
        "stdout": "{\"passed\": true, \"input\": \"custom role auditor with permission audit\", \"expected\": \"True\", \"actual\": \"True\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 92.23
      },
      {
        "test_name": "viewer_delete_denied",
        "passed": true,
        "input_data": "viewer deleting non-owned resource",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"viewer deleting non-owned resource\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 89.86
      },
      {
        "test_name": "missing_role_key_denied",
        "passed": true,
        "input_data": "user dict missing role key",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"user dict missing role key\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 92.85
      },
      {
        "test_name": "explicit_none_role_denied",
        "passed": true,
        "input_data": "user dict with explicit role=None",
        "expected_output": "False",
        "actual_output": "False",
        "stdout": "{\"passed\": true, \"input\": \"user dict with explicit role=None\", \"expected\": \"False\", \"actual\": \"False\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 100.5
      }
    ],
    "fixed_code": "class PermissionChecker:\n    \"\"\"Role-based access control (RBAC) system.\n    \n    Manages roles and their permissions, checking if a user\n    with a given role has access to perform specific actions.\n    \"\"\"\n    \n    # Default role hierarchy\n    ROLE_HIERARCHY = {\n        \"admin\": [\"read\", \"write\", \"delete\", \"manage_users\", \"view_analytics\"],\n        \"editor\": [\"read\", \"write\", \"delete\"],\n        \"viewer\": [\"read\"],\n        \"guest\": [\"read\"],  # Limited read access\n    }\n    \n    def __init__(self, custom_roles: dict | None = None):\n        self.roles = dict(self.ROLE_HIERARCHY)\n        if custom_roles:\n            self.roles.update(custom_roles)\n    \n    def has_permission(self, role: str, action: str) -> bool:\n        \"\"\"Check if a role has permission to perform an action.\n        \n        Args:\n            role: The user's role\n            action: The action to check (e.g., \"read\", \"write\", \"delete\")\n        \n        Returns:\n            True if the role has the permission, False otherwise\n        \"\"\"\n        if not role:\n            return False\n        permissions = self.roles.get(role, [])\n        return action in permissions\n    \n    def check_access(self, user: dict, resource: dict, action: str) -> dict:\n        \"\"\"Check if a user can perform an action on a resource.\n        \n        Args:\n            user: dict with 'role' and 'id' keys\n            resource: dict with 'owner_id' and 'public' keys\n            action: The action to check\n        \n        Returns:\n            dict with 'allowed' (bool) and 'reason' (str)\n        \"\"\"\n        role = user.get(\"role\", \"\")\n        user_id = user.get(\"id\")\n        owner_id = resource.get(\"owner_id\")\n        is_public = resource.get(\"public\", False)\n        \n        # Public resources are readable by anyone\n        if is_public and action == \"read\":\n            return {\"allowed\": True, \"reason\": \"Public resource\"}\n        \n        # Owner can do anything to their own resource\n        if user_id is not None and user_id == owner_id:\n            return {\"allowed\": True, \"reason\": \"Resource owner\"}\n        \n        if self.has_permission(role, action):\n            return {\"allowed\": True, \"reason\": f\"Role '{role}' has '{action}' permission\"}\n        \n        return {\"allowed\": False, \"reason\": f\"Role '{role}' lacks '{action}' permission\"}\n    \n    def get_permissions(self, role: str) -> list[str]:\n        \"\"\"Get all permissions for a given role.\"\"\"\n        if not role:\n            return []\n        return list(self.roles.get(role, []))\n    \n    def add_role(self, role: str, permissions: list[str]) -> None:\n        \"\"\"Add or update a role with the given permissions.\"\"\"\n        self.roles[role] = permissions",
    "original_code": "\"\"\"\nCase 09: Permission Checker \u2014 Returns True for undefined roles (privilege escalation)\n\nA role-based access control system where undefined roles silently\nget access instead of being denied.\n\"\"\"\n\n\nclass PermissionChecker:\n    \"\"\"Role-based access control (RBAC) system.\n    \n    Manages roles and their permissions, checking if a user\n    with a given role has access to perform specific actions.\n    \"\"\"\n    \n    # Default role hierarchy\n    ROLE_HIERARCHY = {\n        \"admin\": [\"read\", \"write\", \"delete\", \"manage_users\", \"view_analytics\"],\n        \"editor\": [\"read\", \"write\", \"delete\"],\n        \"viewer\": [\"read\"],\n        \"guest\": [\"read\"],  # Limited read access\n    }\n    \n    def __init__(self, custom_roles: dict | None = None):\n        self.roles = dict(self.ROLE_HIERARCHY)\n        if custom_roles:\n            self.roles.update(custom_roles)\n    \n    def has_permission(self, role: str, action: str) -> bool:\n        \"\"\"Check if a role has permission to perform an action.\n        \n        Args:\n            role: The user's role\n            action: The action to check (e.g., \"read\", \"write\", \"delete\")\n        \n        Returns:\n            True if the role has the permission, False otherwise\n        \"\"\"\n        # `action in permissions` check below... but wait, let me make\n        # the bug more subtle\n        \n        permissions = self.roles.get(role, [])\n        return action in permissions\n    \n    def check_access(self, user: dict, resource: dict, action: str) -> dict:\n        \"\"\"Check if a user can perform an action on a resource.\n        \n        Args:\n            user: dict with 'role' and 'id' keys\n            resource: dict with 'owner_id' and 'public' keys\n            action: The action to check\n        \n        Returns:\n            dict with 'allowed' (bool) and 'reason' (str)\n        \"\"\"\n        role = user.get(\"role\", \"\")\n        user_id = user.get(\"id\")\n        owner_id = resource.get(\"owner_id\")\n        is_public = resource.get(\"public\", False)\n        \n        # Public resources are readable by anyone\n        if is_public and action == \"read\":\n            return {\"allowed\": True, \"reason\": \"Public resource\"}\n        \n        # Owner can do anything to their own resource\n        if user_id == owner_id:\n            return {\"allowed\": True, \"reason\": \"Resource owner\"}\n        \n        # so has_permission returns False. But if user has role=None...\n        # self.roles.get(None, []) returns [] \u2014 so that's fine.\n        \n        # they match! So an unauthenticated user (id=None) gets owner access\n        # to resources with no owner (owner_id=None)\n        \n        if self.has_permission(role, action):\n            return {\"allowed\": True, \"reason\": f\"Role '{role}' has '{action}' permission\"}\n        \n        return {\"allowed\": False, \"reason\": f\"Role '{role}' lacks '{action}' permission\"}\n    \n    def get_permissions(self, role: str) -> list[str]:\n        \"\"\"Get all permissions for a given role.\"\"\"\n        return list(self.roles.get(role, []))\n    \n    def add_role(self, role: str, permissions: list[str]) -> None:\n        \"\"\"Add or update a role with the given permissions.\"\"\"\n        self.roles[role] = permissions\n",
    "total_time_seconds": 160.03,
    "trajectory": [
      {
        "timestamp": "2026-08-29T16:34:43Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior test engineer specializing in catching bugs in AI-generated code.\n\nYour job is to generate test cases that will EXECUTE against the provided code to verify it works correctly.\nFocus e...",
        "prompt_preview": "Analyze this code and its specification, then generate exactly 12 test cases.\n\n## SPECIFICATION (what the code SHOULD do):\n# Permission Checker Specification\n\n## PermissionChecker(custom_roles=None)\n\nRole-based access control (RBAC) system.\n\n### has_permission(role, action) -> bool\n- Returns True if...",
        "prompt_length": 5981,
        "response_preview": "[\n  {\n    \"name\": \"admin_read_access\",\n    \"category\": \"happy_path\",\n    \"test_code\": \"checker = PermissionChecker()\\nuser = {\\\"id\\\": \\\"user2\\\", \\\"role\\\": \\\"admin\\\"}\\nresource = {\\\"owner_id\\\": \\\"user1\\\", \\\"public\\\": False}\\nres = checker.check_access(user, resource, \\\"read\\\")\\nactual = res.get(\\\"all...",
        "response_length": 6907,
        "latency_seconds": 38.24,
        "temperature": 0.3,
        "request_number": 13
      },
      {
        "timestamp": "2026-08-29T16:36:25Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior debugging engineer. You are given:\n1. Source code that was generated by an AI\n2. A specification of what the code should do\n3. Test results showing which tests passed and which failed...",
        "prompt_preview": "Analyze these test failures for the code below.\n\n## SPECIFICATION:\n# Permission Checker Specification\n\n## PermissionChecker(custom_roles=None)\n\nRole-based access control (RBAC) system.\n\n### has_permission(role, action) -> bool\n- Returns True if the given role has the specified permission\n- Unknown r...",
        "prompt_length": 10170,
        "response_preview": "[\n  {\n    \"bug_id\": \"BUG-001\",\n    \"root_cause\": \"The ownership check uses `if user_id == owner_id:`, which evaluates to `True` when both `user_id` and `owner_id` are `None` (or missing from the dictionary). This violates the requirement that unauthenticated users (`id=None`) must not be treated as ...",
        "response_length": 840,
        "latency_seconds": 100.17,
        "temperature": 0.1,
        "request_number": 14
      },
      {
        "timestamp": "2026-08-29T16:36:44Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior software engineer fixing bugs in AI-generated code.\n\nYou are given:\n1. The original buggy code\n2. The specification of what it should do\n3. Diagnosed bugs with root causes and evidenc...",
        "prompt_preview": "Fix the bugs in this code.\n\n## SPECIFICATION:\n# Permission Checker Specification\n\n## PermissionChecker(custom_roles=None)\n\nRole-based access control (RBAC) system.\n\n### has_permission(role, action) -> bool\n- Returns True if the given role has the specified permission\n- Unknown roles should return Fa...",
        "prompt_length": 5848,
        "response_preview": "class PermissionChecker:\n    \"\"\"Role-based access control (RBAC) system.\n    \n    Manages roles and their permissions, checking if a user\n    with a given role has access to perform specific actions.\n    \"\"\"\n    \n    # Default role hierarchy\n    ROLE_HIERARCHY = {\n        \"admin\": [\"read\", \"write\", ...",
        "response_length": 2699,
        "latency_seconds": 19.4,
        "temperature": 0.1,
        "request_number": 15
      }
    ]
  },
  {
    "case_id": "case_10_data_transformer",
    "spec_summary": "# Data Transformer Pipeline Specification\n\n## transform_records(records, transformations) -> list[dict]\n\nApplies a sequence of transformations to a list of records (dicts).\n\n### Transformation types:\n",
    "total_tests": 12,
    "tests_passed": 8,
    "tests_failed": 4,
    "bugs_found": [
      {
        "bug_id": "BUG-001",
        "root_cause": "The filter transformation silently drops records whose filter field is None because comparison operators like '>' raise a TypeError with None, which is caught by a try-except block that passes without keeping the record. The specification requires keeping records with None in the filter field unless evaluating 'eq' or 'neq'.",
        "severity": "high",
        "category": "logic_error",
        "failing_tests": [
          "filter_keeps_none_values"
        ],
        "suggested_fix": "filtered = []\nfor record in result:\n    record_value = record.get(field)\n    if record_value is None:\n        if operator == \"eq\" and value is None:\n            filtered.append(record)\n        elif operator == \"neq\" and value is not None:\n            filtered.append(record)\n        elif operator not in (\"eq\", \"neq\"):\n            filtered.append(record)\n    else:\n        try:\n            if operator == \"eq\" and record_value == value:\n                filtered.append(record)\n            elif operator == \"neq\" and record_value != value:\n                filtered.append(record)\n            elif operator == \"gt\" and record_value > value:\n                filtered.append(record)\n            elif operator == \"lt\" and record_value < value:\n                filtered.append(record)\n            elif operator == \"gte\" and record_value >= value:\n                filtered.append(record)\n            elif operator == \"lte\" and record_value <= value:\n                filtered.append(record)\n            elif operator == \"contains\" and value in str(record_value):\n                filtered.append(record)\n        except TypeError:\n            pass\nresult = filtered",
        "confidence": 0.95,
        "evidence": "expected: \"[{'age': None}, {'age': 20}]\", actual: \"[{'age': 20}]\""
      },
      {
        "bug_id": "BUG-002",
        "root_cause": "When evaluating a compute expression that raises an exception (e.g. when operating on a None value), the exception handler uses 'pass', which leaves the field unset on the record instead of setting record[field] to None as required by the specification.",
        "severity": "high",
        "category": "logic_error",
        "failing_tests": [
          "compute_sets_none_when_field_none"
        ],
        "suggested_fix": "field = params[\"field\"]\nexpression = params[\"expression\"]\nfor record in result:\n    try:\n        record[field] = eval(expression, {\"__builtins__\": {}}, record)\n    except Exception:\n        record[field] = None",
        "confidence": 0.95,
        "evidence": "expected: \"[{'price': None, 'quantity': 2, 'total': None}]\", actual: \"[{'price': None, 'quantity': 2}]\""
      },
      {
        "bug_id": "BUG-003",
        "root_cause": "The aggregation functions (sum, avg, min, max) operate directly on the raw list of values containing None elements. Calling sum() or comparisons on None causes a TypeError, which triggers the outer exception block and sets the entire result field to None instead of filtering out None values first.",
        "severity": "high",
        "category": "logic_error",
        "failing_tests": [
          "aggregate_sum_skips_none",
          "aggregate_avg_skips_none"
        ],
        "suggested_fix": "values = [r.get(field) for r in group_records]\nvalid_values = [v for v in values if v is not None]\nif func == \"count\":\n    row[output_field] = len(values)\nelif not valid_values:\n    row[output_field] = None\nelif func == \"sum\":\n    row[output_field] = sum(valid_values)\nelif func == \"avg\":\n    row[output_field] = sum(valid_values) / len(valid_values)\nelif func == \"min\":\n    row[output_field] = min(valid_values)\nelif func == \"max\":\n    row[output_field] = max(valid_values)",
        "confidence": 0.95,
        "evidence": "sum([1, None, 3]) expected: \"[{'g': 1, 'sum_v': 4}]\", actual: \"[{'g': 1, 'sum_v': None}]\""
      }
    ],
    "bug_count": 3,
    "severity_breakdown": {
      "high": 3
    },
    "fix_applied": true,
    "fix_improved": true,
    "post_fix_passed": 12,
    "post_fix_failed": 0,
    "test_results": [
      {
        "test_name": "rename_field_happy_path",
        "passed": true,
        "input_data": "rename old_name -> new_name",
        "expected_output": "[{'new_name': 10}]",
        "actual_output": "[{'new_name': 10}]",
        "stdout": "{\"passed\": true, \"input\": \"rename old_name -> new_name\", \"expected\": \"[{'new_name': 10}]\", \"actual\": \"[{'new_name': 10}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 105.66
      },
      {
        "test_name": "default_field_happy_path",
        "passed": true,
        "input_data": "set default status=active",
        "expected_output": "[{'val': 1, 'status': 'active'}, {'status': 'active'}]",
        "actual_output": "[{'val': 1, 'status': 'active'}, {'status': 'active'}]",
        "stdout": "{\"passed\": true, \"input\": \"set default status=active\", \"expected\": \"[{'val': 1, 'status': 'active'}, {'status': 'active'}]\", \"actual\": \"[{'val': 1, 'status': 'active'}, {'status': 'active'}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 95.0
      },
      {
        "test_name": "aggregate_count_happy_path",
        "passed": true,
        "input_data": "count records including None values",
        "expected_output": "[{'cat': 'A', 'total': 2}]",
        "actual_output": "[{'cat': 'A', 'total': 2}]",
        "stdout": "{\"passed\": true, \"input\": \"count records including None values\", \"expected\": \"[{'cat': 'A', 'total': 2}]\", \"actual\": \"[{'cat': 'A', 'total': 2}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 89.74
      },
      {
        "test_name": "filter_keeps_none_values",
        "passed": false,
        "input_data": "filter age > 18 with None present",
        "expected_output": "[{'age': None}, {'age': 20}]",
        "actual_output": "[{'age': 20}]",
        "stdout": "{\"passed\": false, \"input\": \"filter age > 18 with None present\", \"expected\": \"[{'age': None}, {'age': 20}]\", \"actual\": \"[{'age': 20}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 91.31
      },
      {
        "test_name": "compute_sets_none_when_field_none",
        "passed": false,
        "input_data": "compute price * quantity with price=None",
        "expected_output": "[{'price': None, 'quantity': 2, 'total': None}]",
        "actual_output": "[{'price': None, 'quantity': 2}]",
        "stdout": "{\"passed\": false, \"input\": \"compute price * quantity with price=None\", \"expected\": \"[{'price': None, 'quantity': 2, 'total': None}]\", \"actual\": \"[{'price': None, 'quantity': 2}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 85.88
      },
      {
        "test_name": "aggregate_sum_skips_none",
        "passed": false,
        "input_data": "sum([1, None, 3])",
        "expected_output": "[{'g': 1, 'sum_v': 4}]",
        "actual_output": "[{'g': 1, 'sum_v': None}]",
        "stdout": "{\"passed\": false, \"input\": \"sum([1, None, 3])\", \"expected\": \"[{'g': 1, 'sum_v': 4}]\", \"actual\": \"[{'g': 1, 'sum_v': None}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 87.4
      },
      {
        "test_name": "aggregate_avg_skips_none",
        "passed": false,
        "input_data": "avg([1, None, 3])",
        "expected_output": "[{'g': 1, 'avg_v': 2.0}]",
        "actual_output": "[{'g': 1, 'avg_v': None}]",
        "stdout": "{\"passed\": false, \"input\": \"avg([1, None, 3])\", \"expected\": \"[{'g': 1, 'avg_v': 2.0}]\", \"actual\": \"[{'g': 1, 'avg_v': None}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 84.79
      },
      {
        "test_name": "transform_empty_records_list",
        "passed": true,
        "input_data": "transform empty records list",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"transform empty records list\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 83.88
      },
      {
        "test_name": "aggregate_empty_records_list",
        "passed": true,
        "input_data": "aggregate empty records list",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"aggregate empty records list\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 93.84
      },
      {
        "test_name": "filter_neq_with_none",
        "passed": true,
        "input_data": "filter neq 5 with record with None field",
        "expected_output": "[{'x': None}]",
        "actual_output": "[{'x': None}]",
        "stdout": "{\"passed\": true, \"input\": \"filter neq 5 with record with None field\", \"expected\": \"[{'x': None}]\", \"actual\": \"[{'x': None}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 97.79
      },
      {
        "test_name": "compute_disallows_eval_builtins",
        "passed": true,
        "input_data": "compute expression calling __import__",
        "expected_output": "None",
        "actual_output": "None",
        "stdout": "{\"passed\": true, \"input\": \"compute expression calling __import__\", \"expected\": \"None\", \"actual\": \"None\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 97.46
      },
      {
        "test_name": "aggregate_all_none_group",
        "passed": true,
        "input_data": "avg with all None values in group",
        "expected_output": "[{'g': 1, 'avg_v': None}]",
        "actual_output": "[{'g': 1, 'avg_v': None}]",
        "stdout": "{\"passed\": true, \"input\": \"avg with all None values in group\", \"expected\": \"[{'g': 1, 'avg_v': None}]\", \"actual\": \"[{'g': 1, 'avg_v': None}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 88.63
      }
    ],
    "post_fix_test_results": [
      {
        "test_name": "rename_field_happy_path",
        "passed": true,
        "input_data": "rename old_name -> new_name",
        "expected_output": "[{'new_name': 10}]",
        "actual_output": "[{'new_name': 10}]",
        "stdout": "{\"passed\": true, \"input\": \"rename old_name -> new_name\", \"expected\": \"[{'new_name': 10}]\", \"actual\": \"[{'new_name': 10}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 108.66
      },
      {
        "test_name": "default_field_happy_path",
        "passed": true,
        "input_data": "set default status=active",
        "expected_output": "[{'val': 1, 'status': 'active'}, {'status': 'active'}]",
        "actual_output": "[{'val': 1, 'status': 'active'}, {'status': 'active'}]",
        "stdout": "{\"passed\": true, \"input\": \"set default status=active\", \"expected\": \"[{'val': 1, 'status': 'active'}, {'status': 'active'}]\", \"actual\": \"[{'val': 1, 'status': 'active'}, {'status': 'active'}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 96.3
      },
      {
        "test_name": "aggregate_count_happy_path",
        "passed": true,
        "input_data": "count records including None values",
        "expected_output": "[{'cat': 'A', 'total': 2}]",
        "actual_output": "[{'cat': 'A', 'total': 2}]",
        "stdout": "{\"passed\": true, \"input\": \"count records including None values\", \"expected\": \"[{'cat': 'A', 'total': 2}]\", \"actual\": \"[{'cat': 'A', 'total': 2}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 91.99
      },
      {
        "test_name": "filter_keeps_none_values",
        "passed": true,
        "input_data": "filter age > 18 with None present",
        "expected_output": "[{'age': None}, {'age': 20}]",
        "actual_output": "[{'age': None}, {'age': 20}]",
        "stdout": "{\"passed\": true, \"input\": \"filter age > 18 with None present\", \"expected\": \"[{'age': None}, {'age': 20}]\", \"actual\": \"[{'age': None}, {'age': 20}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 90.86
      },
      {
        "test_name": "compute_sets_none_when_field_none",
        "passed": true,
        "input_data": "compute price * quantity with price=None",
        "expected_output": "[{'price': None, 'quantity': 2, 'total': None}]",
        "actual_output": "[{'price': None, 'quantity': 2, 'total': None}]",
        "stdout": "{\"passed\": true, \"input\": \"compute price * quantity with price=None\", \"expected\": \"[{'price': None, 'quantity': 2, 'total': None}]\", \"actual\": \"[{'price': None, 'quantity': 2, 'total': None}]\"}",
        "stderr": "C:\\Users\\USERPC~1\\AppData\\Local\\Temp\\tmpm2r7r9tp.py:28: DeprecationWarning: ast.Num is deprecated and will be removed in Python 3.14; use ast.Constant instead\n  elif isinstance(node, ast.Num):\nC:\\Users\\USERPC~1\\AppData\\Local\\Temp\\tmpm2r7r9tp.py:30: DeprecationWarning: ast.Str is deprecated and will be removed in Python 3.14; use ast.Constant instead\n  elif isinstance(node, ast.Str):",
        "error": null,
        "runtime_ms": 92.59
      },
      {
        "test_name": "aggregate_sum_skips_none",
        "passed": true,
        "input_data": "sum([1, None, 3])",
        "expected_output": "[{'g': 1, 'sum_v': 4}]",
        "actual_output": "[{'g': 1, 'sum_v': 4}]",
        "stdout": "{\"passed\": true, \"input\": \"sum([1, None, 3])\", \"expected\": \"[{'g': 1, 'sum_v': 4}]\", \"actual\": \"[{'g': 1, 'sum_v': 4}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 93.09
      },
      {
        "test_name": "aggregate_avg_skips_none",
        "passed": true,
        "input_data": "avg([1, None, 3])",
        "expected_output": "[{'g': 1, 'avg_v': 2.0}]",
        "actual_output": "[{'g': 1, 'avg_v': 2.0}]",
        "stdout": "{\"passed\": true, \"input\": \"avg([1, None, 3])\", \"expected\": \"[{'g': 1, 'avg_v': 2.0}]\", \"actual\": \"[{'g': 1, 'avg_v': 2.0}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 91.93
      },
      {
        "test_name": "transform_empty_records_list",
        "passed": true,
        "input_data": "transform empty records list",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"transform empty records list\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 94.77
      },
      {
        "test_name": "aggregate_empty_records_list",
        "passed": true,
        "input_data": "aggregate empty records list",
        "expected_output": "[]",
        "actual_output": "[]",
        "stdout": "{\"passed\": true, \"input\": \"aggregate empty records list\", \"expected\": \"[]\", \"actual\": \"[]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 94.48
      },
      {
        "test_name": "filter_neq_with_none",
        "passed": true,
        "input_data": "filter neq 5 with record with None field",
        "expected_output": "[{'x': None}]",
        "actual_output": "[{'x': None}]",
        "stdout": "{\"passed\": true, \"input\": \"filter neq 5 with record with None field\", \"expected\": \"[{'x': None}]\", \"actual\": \"[{'x': None}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 91.75
      },
      {
        "test_name": "compute_disallows_eval_builtins",
        "passed": true,
        "input_data": "compute expression calling __import__",
        "expected_output": "None",
        "actual_output": "None",
        "stdout": "{\"passed\": true, \"input\": \"compute expression calling __import__\", \"expected\": \"None\", \"actual\": \"None\"}",
        "stderr": "C:\\Users\\USERPC~1\\AppData\\Local\\Temp\\tmpfc679nvo.py:28: DeprecationWarning: ast.Num is deprecated and will be removed in Python 3.14; use ast.Constant instead\n  elif isinstance(node, ast.Num):\nC:\\Users\\USERPC~1\\AppData\\Local\\Temp\\tmpfc679nvo.py:30: DeprecationWarning: ast.Str is deprecated and will be removed in Python 3.14; use ast.Constant instead\n  elif isinstance(node, ast.Str):",
        "error": null,
        "runtime_ms": 98.84
      },
      {
        "test_name": "aggregate_all_none_group",
        "passed": true,
        "input_data": "avg with all None values in group",
        "expected_output": "[{'g': 1, 'avg_v': None}]",
        "actual_output": "[{'g': 1, 'avg_v': None}]",
        "stdout": "{\"passed\": true, \"input\": \"avg with all None values in group\", \"expected\": \"[{'g': 1, 'avg_v': None}]\", \"actual\": \"[{'g': 1, 'avg_v': None}]\"}",
        "stderr": "",
        "error": null,
        "runtime_ms": 115.42
      }
    ],
    "fixed_code": "import ast\nimport operator\n\n_SAFE_OPERATORS = {\n    ast.Add: operator.add,\n    ast.Sub: operator.sub,\n    ast.Mult: operator.mul,\n    ast.Div: operator.truediv,\n    ast.FloorDiv: operator.floordiv,\n    ast.Mod: operator.mod,\n    ast.Pow: operator.pow,\n    ast.USub: operator.neg,\n    ast.UAdd: operator.pos,\n}\n\n\ndef _eval_node(node, record):\n    if isinstance(node, ast.Expression):\n        return _eval_node(node.body, record)\n    elif isinstance(node, ast.Constant):\n        return node.value\n    elif isinstance(node, ast.Num):\n        return node.n\n    elif isinstance(node, ast.Str):\n        return node.s\n    elif isinstance(node, ast.Name):\n        if node.id in record:\n            val = record[node.id]\n            if val is None:\n                raise ValueError(\"Referenced field is None\")\n            return val\n        else:\n            raise ValueError(f\"Field {node.id} not in record\")\n    elif isinstance(node, ast.BinOp):\n        left = _eval_node(node.left, record)\n        right = _eval_node(node.right, record)\n        op_type = type(node.op)\n        if op_type not in _SAFE_OPERATORS:\n            raise ValueError(\"Unsupported operator\")\n        return _SAFE_OPERATORS[op_type](left, right)\n    elif isinstance(node, ast.UnaryOp):\n        operand = _eval_node(node.operand, record)\n        op_type = type(node.op)\n        if op_type not in _SAFE_OPERATORS:\n            raise ValueError(\"Unsupported operator\")\n        return _SAFE_OPERATORS[op_type](operand)\n    else:\n        raise ValueError(\"Unsupported AST node\")\n\n\ndef safe_compute(expression: str, record: dict):\n    try:\n        tree = ast.parse(expression, mode=\"eval\")\n        return _eval_node(tree, record)\n    except Exception:\n        return None\n\n\ndef transform_records(\n    records: list[dict],\n    transformations: list[dict],\n) -> list[dict]:\n    \"\"\"Apply a sequence of transformations to a list of records.\n\n    Args:\n        records: List of dictionaries to transform\n        transformations: List of transformation specs, each with:\n            - type: \"rename\", \"compute\", \"filter\", \"default\"\n            - params: transformation-specific parameters\n\n    Returns:\n        Transformed list of records\n    \"\"\"\n    result = [dict(r) for r in records]\n\n    for transform in transformations:\n        t_type = transform.get(\"type\")\n        params = transform.get(\"params\", {})\n\n        if t_type == \"rename\":\n            old_name = params[\"from\"]\n            new_name = params[\"to\"]\n            for record in result:\n                if old_name in record:\n                    record[new_name] = record.pop(old_name)\n\n        elif t_type == \"compute\":\n            field = params[\"field\"]\n            expression = params[\"expression\"]\n            for record in result:\n                record[field] = safe_compute(expression, record)\n\n        elif t_type == \"filter\":\n            field = params[\"field\"]\n            operator_name = params[\"operator\"]\n            value = params[\"value\"]\n\n            filtered = []\n            for record in result:\n                record_value = record.get(field)\n\n                if record_value is None:\n                    if operator_name == \"eq\" and value is None:\n                        filtered.append(record)\n                    elif operator_name == \"neq\" and value is not None:\n                        filtered.append(record)\n                    elif operator_name not in (\"eq\", \"neq\"):\n                        filtered.append(record)\n                else:\n                    try:\n                        if operator_name == \"eq\" and record_value == value:\n                            filtered.append(record)\n                        elif operator_name == \"neq\" and record_value != value:\n                            filtered.append(record)\n                        elif operator_name == \"gt\" and record_value > value:\n                            filtered.append(record)\n                        elif operator_name == \"lt\" and record_value < value:\n                            filtered.append(record)\n                        elif operator_name == \"gte\" and record_value >= value:\n                            filtered.append(record)\n                        elif operator_name == \"lte\" and record_value <= value:\n                            filtered.append(record)\n                        elif operator_name == \"contains\" and str(value) in str(record_value):\n                            filtered.append(record)\n                    except TypeError:\n                        pass\n\n            result = filtered\n\n        elif t_type == \"default\":\n            field = params[\"field\"]\n            default_value = params[\"value\"]\n            for record in result:\n                if field not in record or record[field] is None:\n                    record[field] = default_value\n\n    return result\n\n\ndef aggregate_records(\n    records: list[dict],\n    group_by: str,\n    aggregations: dict,\n) -> list[dict]:\n    \"\"\"Group records and compute aggregations.\n\n    Args:\n        records: List of dicts\n        group_by: Field name to group by\n        aggregations: dict mapping output field names to {\"field\": ..., \"func\": \"sum\"|\"avg\"|\"count\"|\"min\"|\"max\"}\n\n    Returns:\n        List of grouped/aggregated records\n    \"\"\"\n    groups = {}\n    for record in records:\n        key = record.get(group_by)\n        if key not in groups:\n            groups[key] = []\n        groups[key].append(record)\n\n    result = []\n    for key, group_records in groups.items():\n        row = {group_by: key}\n\n        for output_field, agg_spec in aggregations.items():\n            field = agg_spec[\"field\"]\n            func = agg_spec[\"func\"]\n\n            values = [r.get(field) for r in group_records]\n            valid_values = [v for v in values if v is not None]\n\n            if func == \"count\":\n                row[output_field] = len(values)\n            elif not valid_values:\n                row[output_field] = None\n            elif func == \"sum\":\n                row[output_field] = sum(valid_values)\n            elif func == \"avg\":\n                row[output_field] = sum(valid_values) / len(valid_values)\n            elif func == \"min\":\n                row[output_field] = min(valid_values)\n            elif func == \"max\":\n                row[output_field] = max(valid_values)\n            else:\n                row[output_field] = None\n\n        result.append(row)\n\n    return result",
    "original_code": "\"\"\"\nCase 10: Data Transformer Pipeline \u2014 Silently drops records with null fields\n\nAn ETL-style data pipeline that processes records but silently drops\nany record containing a None/null field instead of handling them properly.\n\"\"\"\n\n\ndef transform_records(\n    records: list[dict],\n    transformations: list[dict],\n) -> list[dict]:\n    \"\"\"Apply a sequence of transformations to a list of records.\n    \n    Args:\n        records: List of dictionaries to transform\n        transformations: List of transformation specs, each with:\n            - type: \"rename\", \"compute\", \"filter\", \"default\"\n            - params: transformation-specific parameters\n    \n    Returns:\n        Transformed list of records\n    \"\"\"\n    result = [dict(r) for r in records]  # shallow copy\n    \n    for transform in transformations:\n        t_type = transform.get(\"type\")\n        params = transform.get(\"params\", {})\n        \n        if t_type == \"rename\":\n            # Rename a field\n            old_name = params[\"from\"]\n            new_name = params[\"to\"]\n            for record in result:\n                if old_name in record:\n                    record[new_name] = record.pop(old_name)\n        \n        elif t_type == \"compute\":\n            # Add a computed field\n            field = params[\"field\"]\n            expression = params[\"expression\"]  # e.g., \"price * quantity\"\n            for record in result:\n                try:\n                    # crashes on None values instead of handling them\n                    record[field] = eval(expression, {\"__builtins__\": {}}, record)\n                except Exception:\n                    pass\n        \n        elif t_type == \"filter\":\n            # Filter records matching a condition\n            field = params[\"field\"]\n            operator = params[\"operator\"]\n            value = params[\"value\"]\n            \n            filtered = []\n            for record in result:\n                record_value = record.get(field)\n                \n                # or produce wrong results (None < 5 raises TypeError in Python 3)\n                try:\n                    if operator == \"eq\" and record_value == value:\n                        filtered.append(record)\n                    elif operator == \"neq\" and record_value != value:\n                        filtered.append(record)\n                    elif operator == \"gt\" and record_value > value:\n                        filtered.append(record)\n                    elif operator == \"lt\" and record_value < value:\n                        filtered.append(record)\n                    elif operator == \"gte\" and record_value >= value:\n                        filtered.append(record)\n                    elif operator == \"lte\" and record_value <= value:\n                        filtered.append(record)\n                    elif operator == \"contains\" and value in str(record_value):\n                        filtered.append(record)\n                except TypeError:\n                    # during comparison, instead of being included/excluded\n                    # based on a defined null-handling policy\n                    pass\n            \n            result = filtered\n        \n        elif t_type == \"default\":\n            # Set default values for missing/None fields\n            field = params[\"field\"]\n            default_value = params[\"value\"]\n            for record in result:\n                if field not in record or record[field] is None:\n                    record[field] = default_value\n    \n    return result\n\n\ndef aggregate_records(\n    records: list[dict],\n    group_by: str,\n    aggregations: dict,\n) -> list[dict]:\n    \"\"\"Group records and compute aggregations.\n    \n    Args:\n        records: List of dicts\n        group_by: Field name to group by\n        aggregations: dict mapping output field names to {\"field\": ..., \"func\": \"sum\"|\"avg\"|\"count\"|\"min\"|\"max\"}\n    \n    Returns:\n        List of grouped/aggregated records\n    \"\"\"\n    groups = {}\n    for record in records:\n        key = record.get(group_by)\n        if key not in groups:\n            groups[key] = []\n        groups[key].append(record)\n    \n    result = []\n    for key, group_records in groups.items():\n        row = {group_by: key}\n        \n        for output_field, agg_spec in aggregations.items():\n            field = agg_spec[\"field\"]\n            func = agg_spec[\"func\"]\n            \n            values = [r.get(field) for r in group_records]\n            # sum([1, None, 3]) raises TypeError\n            \n            try:\n                if func == \"sum\":\n                    row[output_field] = sum(values)\n                elif func == \"avg\":\n                    row[output_field] = sum(values) / len(values)\n                elif func == \"count\":\n                    row[output_field] = len(values)\n                elif func == \"min\":\n                    row[output_field] = min(values)\n                elif func == \"max\":\n                    row[output_field] = max(values)\n            except (TypeError, ZeroDivisionError):\n                row[output_field] = None\n                                          # computing on non-None values\n        \n        result.append(row)\n    \n    return result\n",
    "total_time_seconds": 80.96,
    "trajectory": [
      {
        "timestamp": "2026-08-29T16:37:12Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior test engineer specializing in catching bugs in AI-generated code.\n\nYour job is to generate test cases that will EXECUTE against the provided code to verify it works correctly.\nFocus e...",
        "prompt_preview": "Analyze this code and its specification, then generate exactly 12 test cases.\n\n## SPECIFICATION (what the code SHOULD do):\n# Data Transformer Pipeline Specification\n\n## transform_records(records, transformations) -> list[dict]\n\nApplies a sequence of transformations to a list of records (dicts).\n\n###...",
        "prompt_length": 8246,
        "response_preview": "[\n  {\n    \"name\": \"rename_field_happy_path\",\n    \"category\": \"happy_path\",\n    \"test_code\": \"import json\\nrecords = [{'old_name': 10}]\\ntransformations = [{'type': 'rename', 'params': {'from': 'old_name', 'to': 'new_name'}}]\\nactual = transform_records(records, transformations)\\nexpected = [{'new_na...",
        "response_length": 7165,
        "latency_seconds": 27.0,
        "temperature": 0.3,
        "request_number": 16
      },
      {
        "timestamp": "2026-08-29T16:37:28Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior debugging engineer. You are given:\n1. Source code that was generated by an AI\n2. A specification of what the code should do\n3. Test results showing which tests passed and which failed...",
        "prompt_preview": "Analyze these test failures for the code below.\n\n## SPECIFICATION:\n# Data Transformer Pipeline Specification\n\n## transform_records(records, transformations) -> list[dict]\n\nApplies a sequence of transformations to a list of records (dicts).\n\n### Transformation types:\n\n**rename**: Rename a field\n- par...",
        "prompt_length": 13234,
        "response_preview": "[\n  {\n    \"bug_id\": \"BUG-001\",\n    \"root_cause\": \"The filter transformation silently drops records whose filter field is None because comparison operators like '>' raise a TypeError with None, which is caught by a try-except block that passes without keeping the record. The specification requires ke...",
        "response_length": 3841,
        "latency_seconds": 14.46,
        "temperature": 0.1,
        "request_number": 17
      },
      {
        "timestamp": "2026-08-29T16:38:05Z",
        "model": "gemini-3.6-flash",
        "system_instruction": "You are a senior software engineer fixing bugs in AI-generated code.\n\nYou are given:\n1. The original buggy code\n2. The specification of what it should do\n3. Diagnosed bugs with root causes and evidenc...",
        "prompt_preview": "Fix the bugs in this code.\n\n## SPECIFICATION:\n# Data Transformer Pipeline Specification\n\n## transform_records(records, transformations) -> list[dict]\n\nApplies a sequence of transformations to a list of records (dicts).\n\n### Transformation types:\n\n**rename**: Rename a field\n- params: `{\"from\": \"old_n...",
        "prompt_length": 11114,
        "response_preview": "import ast\nimport operator\n\n_SAFE_OPERATORS = {\n    ast.Add: operator.add,\n    ast.Sub: operator.sub,\n    ast.Mult: operator.mul,\n    ast.Div: operator.truediv,\n    ast.FloorDiv: operator.floordiv,\n    ast.Mod: operator.mod,\n    ast.Pow: operator.pow,\n    ast.USub: operator.neg,\n    ast.UAdd: operat...",
        "response_length": 6384,
        "latency_seconds": 37.2,
        "temperature": 0.1,
        "request_number": 18
      }
    ]
  }
];
