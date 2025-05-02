from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Task, User
from .serializers import (
    TaskSerializer,
    TaskUpdateSerializer,
    TaskReportSerializer,
    UserSerializer,
)
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminOrSuperAdmin, IsSuperAdmin, IsTaskOwnerOrAdmin


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ["ADMIN", "SUPERADMIN"]:
            return Task.objects.all()
        return Task.objects.filter(assigned_to=user)

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsAdminOrSuperAdmin()]
        elif self.action == "report":
            return [IsAuthenticated(), IsAdminOrSuperAdmin()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(assigned_by=self.request.user)

    @action(detail=True, methods=["put"])
    def update_status(self, request, pk=None):
        task = self.get_object()
        if task.assigned_to != request.user and request.user.role not in [
            "ADMIN",
            "SUPERADMIN",
        ]:
            return Response(
                {"detail": "Not authorized to update this task."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = TaskUpdateSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def report(self, request, pk=None):
        task = self.get_object()
        if task.status != "COMPLETED":
            return Response(
                {"detail": "Task is not completed."}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = TaskReportSerializer(task)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(self.request.data.get("password"))
        user.save()
