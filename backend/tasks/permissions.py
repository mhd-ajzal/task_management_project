from rest_framework.permissions import BasePermission


class IsAdminOrSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ["ADMIN", "SUPERADMIN"]


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "SUPERADMIN"


class IsTaskOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role in ["ADMIN", "SUPERADMIN"]:
            return True
        return obj.assigned_to == request.user
