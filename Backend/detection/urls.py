from django.urls import path
from . import views

urlpatterns = [
    path('detect/', views.detect_weapon, name='detect_weapon'),
    path('alerts/', views.AlertListCreateView.as_view(), name='alert-list-create'),
    path('cameras/', views.CameraListCreateView.as_view(), name='camera-list-create'),
    path('feed/<int:camera_id>/', views.video_feed, name='video-feed'),
]
