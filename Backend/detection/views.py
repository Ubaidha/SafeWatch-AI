from rest_framework import generics, permissions
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Alert, Camera
from .serializers import AlertSerializer, CameraSerializer
from django.contrib.auth.models import User

class AlertListCreateView(generics.ListCreateAPIView):
    serializer_class = AlertSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return alerts belonging to the current user
        return Alert.objects.filter(user=self.request.user)

class CameraListCreateView(generics.ListCreateAPIView):
    serializer_class = CameraSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Camera.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_create(self, serializer):
        # Check if 'username' is provided in the body (for Postman testing)
        if 'username' in self.request.data:
            try:
                user = User.objects.get(username=self.request.data['username'])
                serializer.save(user=user)
            except User.DoesNotExist:
                # Fallback to request.user if username provided is invalid
                serializer.save(user=self.request.user)
        else:
            # Default: assign to the authenticated user
            serializer.save(user=self.request.user)
import time

CONFIDENCE_THRESHOLD = 0.80
COOLDOWN_SECONDS = 5
LAST_ALERT_TIME = 0


def apply_alert_logic(predicted_class, confidence):
    global LAST_ALERT_TIME
    now = time.time()

    if predicted_class in ["knife", "gun"] and confidence >= CONFIDENCE_THRESHOLD:
        if now - LAST_ALERT_TIME >= COOLDOWN_SECONDS:
            LAST_ALERT_TIME = now
            return predicted_class, True

    return "none", False


@csrf_exempt
def detect_weapon(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    # ✅ STEP 1: Check image exists
    if 'image' not in request.FILES:
        return JsonResponse({"error": "Image not provided"}, status=400)

    image = request.FILES['image']

    # 🔹 TEMPORARY DUMMY MODEL OUTPUT
    # (Replace this when your friend gives model code)
    predicted_class = "knife"
    confidence = 0.92

    # 🔹 Apply backend logic
    weapon, alert = apply_alert_logic(predicted_class, confidence)

    return JsonResponse({
        "weapon": weapon,
        "confidence": round(confidence, 2),
        "alert": alert
    })

from django.http import StreamingHttpResponse, HttpResponseServerError
import cv2
import threading

import numpy as np

def get_placeholder_frame():
    # Create a black image (360p)
    img = np.zeros((360, 640, 3), dtype=np.uint8)
    # Add text "NO SIGNAL" (requires opencv)
    cv2.putText(img, "NO SIGNAL", (200, 180), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    ret, buffer = cv2.imencode('.jpg', img)
    return buffer.tobytes()

def gen_frames(camera_url):
    print(f"DEBUG: Attempting to connect to {camera_url}")
    
    # Use FFMPEG backend explicitly
    cap = cv2.VideoCapture(camera_url, cv2.CAP_FFMPEG)
    
    if not cap.isOpened():
        print("DEBUG: Failed to open video capture (Invalid URL or Offline)")
        # Yield error frame
        frame = get_placeholder_frame()
        while True:
            # Keep sending the placeholder so the connection acts "live"
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            time.sleep(1) # Send every 1s
    
    print("DEBUG: Camera opened. Reading frames...")
    
    frame_count = 0
    while True:
        success, frame = cap.read()
        if not success:
            print("DEBUG: Failed to read frame (Stream ended, timeout, or packet loss)")
            # Yield placeholder instead of crashing
            frame = get_placeholder_frame()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            time.sleep(1) # Avoid tight loop on error
            
            # Optional: Try to reconnect logic could go here
            # For now, we continue yielding placeholder until page refresh
        else:
            if frame_count % 30 == 0:
                 print(f"DEBUG: Successfully read frame {frame_count}")
            frame_count += 1
            
            # Encode frame as JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            
            # Yield frame in MJPEG format
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

def video_feed(request, camera_id):
    try:
        # Check authentication (Header OR Query Param)
        user = request.user
        print(f"DEBUG: Initial user: {user}, is_authenticated: {user.is_authenticated}")
        
        if not user.is_authenticated:
            token_key = request.GET.get('token')
            print(f"DEBUG: Token from URL: {token_key}")
            if token_key:
                try:
                    from rest_framework.authtoken.models import Token
                    token = Token.objects.get(key=token_key)
                    user = token.user
                    print(f"DEBUG: User found from token: {user}")
                except Token.DoesNotExist:
                    print("DEBUG: Token does not exist")
                    pass
        
        if not user.is_authenticated:
             print("DEBUG: Returning 403 Unauthorized")
             return JsonResponse({'error': 'Unauthorized'}, status=403)

        camera = Camera.objects.get(id=camera_id)
        # Verify user has access to this camera
        if camera.user != user:
            return JsonResponse({'error': 'Unauthorized'}, status=403)
            
        return StreamingHttpResponse(gen_frames(camera.source_url),
                                     content_type='multipart/x-mixed-replace; boundary=frame')
    except Camera.DoesNotExist:
        return JsonResponse({'error': 'Camera not found'}, status=404)
    except Exception as e:
        print(f"Error in video_feed: {e}")
        return HttpResponseServerError("Stream error")
