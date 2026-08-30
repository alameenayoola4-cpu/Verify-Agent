"""
Strip bug-revealing comments from evaluation case code files.

Removes comments containing BUG:, HACK:, TODO: fix, FIXME, etc.
so that the agent has to find bugs through execution, not reading labels.
"""
import re
from pathlib import Path


def strip_bug_comments(code: str) -> str:
    """Remove lines or inline comments that reveal the bug."""
    lines = code.split('\n')
    cleaned = []
    
    # Patterns that give away the bug
    bug_patterns = [
        r'#\s*BUG:',
        r'#\s*HACK:',
        r'#\s*FIXME',
        r'#\s*TODO:\s*fix',
        r'#\s*BROKEN',
        r'#\s*should be\b',
        r'#\s*wrong',
        r'#\s*incorrect',
        r'#\s*adds item every time',
        r'#\s*doesn\'t reset',
        r'#\s*never evicts',
        r'#\s*silently',
        r'#\s*missing',
        r'#\s*privilege',
    ]
    combined = '|'.join(f'({p})' for p in bug_patterns)
    
    for line in lines:
        # Check if the line has a bug-revealing comment
        if re.search(combined, line, re.IGNORECASE):
            # Remove just the comment part, keep the code
            code_part = line.split('#')[0].rstrip()
            if code_part.strip():  # There's actual code before the comment
                cleaned.append(code_part)
            # If the entire line was a comment, skip it
        else:
            cleaned.append(line)
    
    return '\n'.join(cleaned)


def main():
    cases_dir = Path("evaluation/cases")
    for case_dir in sorted(cases_dir.iterdir()):
        code_path = case_dir / "code.py"
        if code_path.exists():
            original = code_path.read_text(encoding="utf-8")
            cleaned = strip_bug_comments(original)
            
            if original != cleaned:
                code_path.write_text(cleaned, encoding="utf-8")
                removed = len(original) - len(cleaned)
                print(f"  [cleaned] {case_dir.name}: removed {removed} chars of bug hints")
            else:
                print(f"  [ok] {case_dir.name}: no bug hints found")


if __name__ == "__main__":
    main()
