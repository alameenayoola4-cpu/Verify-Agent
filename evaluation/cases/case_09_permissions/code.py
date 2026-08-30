"""
Case 09: Permission Checker — Returns True for undefined roles (privilege escalation)

A role-based access control system where undefined roles silently
get access instead of being denied.
"""


class PermissionChecker:
    """Role-based access control (RBAC) system.
    
    Manages roles and their permissions, checking if a user
    with a given role has access to perform specific actions.
    """
    
    # Default role hierarchy
    ROLE_HIERARCHY = {
        "admin": ["read", "write", "delete", "manage_users", "view_analytics"],
        "editor": ["read", "write", "delete"],
        "viewer": ["read"],
        "guest": ["read"],  # Limited read access
    }
    
    def __init__(self, custom_roles: dict | None = None):
        self.roles = dict(self.ROLE_HIERARCHY)
        if custom_roles:
            self.roles.update(custom_roles)
    
    def has_permission(self, role: str, action: str) -> bool:
        """Check if a role has permission to perform an action.
        
        Args:
            role: The user's role
            action: The action to check (e.g., "read", "write", "delete")
        
        Returns:
            True if the role has the permission, False otherwise
        """
        # `action in permissions` check below... but wait, let me make
        # the bug more subtle
        
        permissions = self.roles.get(role, [])
        return action in permissions
    
    def check_access(self, user: dict, resource: dict, action: str) -> dict:
        """Check if a user can perform an action on a resource.
        
        Args:
            user: dict with 'role' and 'id' keys
            resource: dict with 'owner_id' and 'public' keys
            action: The action to check
        
        Returns:
            dict with 'allowed' (bool) and 'reason' (str)
        """
        role = user.get("role", "")
        user_id = user.get("id")
        owner_id = resource.get("owner_id")
        is_public = resource.get("public", False)
        
        # Public resources are readable by anyone
        if is_public and action == "read":
            return {"allowed": True, "reason": "Public resource"}
        
        # Owner can do anything to their own resource
        if user_id == owner_id:
            return {"allowed": True, "reason": "Resource owner"}
        
        # so has_permission returns False. But if user has role=None...
        # self.roles.get(None, []) returns [] — so that's fine.
        
        # they match! So an unauthenticated user (id=None) gets owner access
        # to resources with no owner (owner_id=None)
        
        if self.has_permission(role, action):
            return {"allowed": True, "reason": f"Role '{role}' has '{action}' permission"}
        
        return {"allowed": False, "reason": f"Role '{role}' lacks '{action}' permission"}
    
    def get_permissions(self, role: str) -> list[str]:
        """Get all permissions for a given role."""
        return list(self.roles.get(role, []))
    
    def add_role(self, role: str, permissions: list[str]) -> None:
        """Add or update a role with the given permissions."""
        self.roles[role] = permissions
