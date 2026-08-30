# Permission Checker Specification

## PermissionChecker(custom_roles=None)

Role-based access control (RBAC) system.

### has_permission(role, action) -> bool
- Returns True if the given role has the specified permission
- Unknown roles should return False (deny by default)

### check_access(user, resource, action) -> dict
- `user`: dict with `id` (unique identifier) and `role` (string)
- `resource`: dict with `owner_id` (unique identifier) and `public` (bool)
- Returns `{"allowed": bool, "reason": str}`

### Access rules (evaluated in order):
1. Public resources allow "read" to anyone
2. Resource owners can perform any action on their own resources
3. Role-based permissions apply for all other cases
4. Default deny — if no rule matches, access is denied

### Security requirements:
- Unauthenticated users (user with id=None or missing id) must NOT be treated as owners of resources with owner_id=None
- The owner check must use identity comparison, not just equality — None == None should NOT grant owner access
- Unknown or missing roles must be denied by default (fail-closed)
- Empty string roles should be treated as invalid/unknown

### Examples:
```python
checker = PermissionChecker()
checker.check_access({"id": "user1", "role": "editor"}, {"owner_id": "user1", "public": False}, "delete")
# → {"allowed": True, "reason": "Resource owner"}

checker.check_access({"id": None, "role": "guest"}, {"owner_id": None, "public": False}, "delete")  
# → {"allowed": False, ...}  (None user should NOT match None owner)
```
