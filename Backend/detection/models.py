from django.db import models

# Create your models here.
class Alert(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, null=True, blank=True)
    camera_name = models.CharField(max_length=100)
    weapon_type = models.CharField(max_length=50) # e.g., 'Knife', 'Gun'
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.weapon_type} detected at {self.camera_name}"

    class Meta:
        ordering = ['-timestamp']

class Camera(models.Model):
    CAMERA_TYPES = [
        ('RTSP', 'RTSP (Real-Time Streaming Protocol)'),
        ('HLS', 'HLS (HTTP Live Streaming)'),
    ]
    
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    source_url = models.CharField(max_length=500) # RTSP or HLS link
    camera_type = models.CharField(max_length=10, choices=CAMERA_TYPES, default='RTSP')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.camera_type})"
