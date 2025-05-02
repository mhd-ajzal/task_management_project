from rest_framework import serializers
from .models import Task, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "first_name", "last_name"]
        read_only_fields = ["role"]


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    assigned_by = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = ["assigned_by", "created_at", "updated_at"]


class TaskUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["status", "completion_report", "worked_hours"]

    def validate(self, data):
        if data.get("status") == "COMPLETED":
            if not data.get("completion_report"):
                raise serializers.ValidationError(
                    "Completion report is required when marking task as completed."
                )
            if not data.get("worked_hours"):
                raise serializers.ValidationError(
                    "Worked hours is required when marking task as completed."
                )
        return data


class TaskReportSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = ["id", "title", "completion_report", "worked_hours", "assigned_to"]
