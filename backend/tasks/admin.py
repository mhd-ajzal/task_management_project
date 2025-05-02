from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Task


class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "role", "is_staff")
    list_filter = ("role", "is_staff")
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "role",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "password1", "password2", "role"),
            },
        ),
    )


class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "assigned_to", "status", "due_date")
    list_filter = ("status", "assigned_to__role")
    search_fields = ("title", "description")
    readonly_fields = ("assigned_by", "created_at", "updated_at")

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.role == "ADMIN":
            return qs.filter(assigned_to__created_by=request.user)
        return qs


admin.site.register(User, CustomUserAdmin)
admin.site.register(Task, TaskAdmin)
