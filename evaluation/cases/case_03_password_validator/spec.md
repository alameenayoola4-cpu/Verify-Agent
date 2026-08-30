# Password Validator Specification

## validate_password(password: str) -> dict

Validates a password against the following security requirements:

### Requirements:
1. At least 8 characters long
2. At most 64 characters long
3. Contains at least one ASCII uppercase letter (A-Z, English alphabet only)
4. Contains at least one ASCII lowercase letter (a-z, English alphabet only)
5. Contains at least one ASCII digit (0-9)
6. Contains at least one special character from this set: `!@#$%^&*()_+-=[]{}|;:,.<>?`
7. Does not contain any whitespace characters (spaces, tabs, newlines, etc.)
8. Does not contain the word "password" (case-insensitive)

### Returns:
A dict with:
- `valid`: True if all requirements are met, False otherwise
- `errors`: list of human-readable error messages for each failed requirement

### Expected Behavior:
- `validate_password("Str0ng!Pass")` → `{"valid": True, "errors": []}`
- `validate_password("weak")` → `{"valid": False, "errors": [...]}`  (multiple errors)
- `validate_password("Has\tTab!1")` → `{"valid": False, "errors": [...]}` (tab is whitespace)
- `validate_password("Ab1!Ab1!")` → `{"valid": True, "errors": []}`
