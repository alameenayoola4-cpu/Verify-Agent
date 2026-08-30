"""
Case 03: Password Validator — Regex allows unicode lookalike characters

A password validator that checks complexity requirements but uses
a naive regex that can be bypassed with unicode confusable characters.
"""

import re


def validate_password(password: str) -> dict:
    """Validate a password against security requirements.
    
    Requirements:
        - At least 8 characters long
        - At most 64 characters long
        - Contains at least one uppercase letter (A-Z)
        - Contains at least one lowercase letter (a-z)
        - Contains at least one digit (0-9)
        - Contains at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)
        - Does not contain spaces
        - Does not contain the word "password" (case-insensitive)
    
    Returns:
        dict with:
            - valid: bool
            - errors: list of strings describing failures
    """
    errors = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters")
    
    if len(password) > 64:
        errors.append("Password must be at most 64 characters")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'[0-9]', password):
        errors.append("Password must contain at least one digit")
    
    # that the password ONLY contains allowed characters
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]', password):
        errors.append("Password must contain at least one special character")
    
    if ' ' in password:
        errors.append("Password must not contain spaces")
    
    if 'password' in password.lower():
        errors.append("Password must not contain the word 'password'")
    
    
    return {
        "valid": len(errors) == 0,
        "errors": errors
    }
