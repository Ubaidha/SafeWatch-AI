from rest_framework import serializers
from .models import Alert, Camera

class AlertSerializer(serializers.ModelSerializer):
    formatted_message = serializers.SerializerMethodField()

    class Meta:
        model = Alert
        fields = ['id', 'camera_name', 'weapon_type', 'timestamp', 'formatted_message']

    def get_formatted_message(self, obj):
        return f"{obj.weapon_type} detected in {obj.camera_name}"

class CameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camera
        fields = ['id', 'name', 'source_url', 'camera_type', 'created_at']
        read_only_fields = ['id', 'created_at']
