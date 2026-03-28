from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import FileResponse
from django.conf import settings
import openai
import json
import os
from .serializers import RegisterSerializer, ResumeSerializer
from .models import Resume
import uuid

User = get_user_model()

openai.api_key = settings.OPENAI_API_KEY

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            },
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)

class ResumeListCreateView(generics.ListCreateAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ResumeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

class AnalyzeView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        path = request.data.get('path')
        message = request.data.get('message')
        
        if not path or not message:
            return Response({'error': 'path and message required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": message}],
                temperature=0.3
            )
            content = response.choices[0].message.content
            return Response({'message': {'content': content}})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def file_upload(request):
    if request.method == 'POST':
        form_data = request.FILES
        if form_data:
            file = list(form_data.values())[0]
            # Save to media/resumes/
            path = f'resumes/{uuid.uuid4()}-{file.name}'
            full_path = os.path.join(settings.MEDIA_ROOT, path)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            return Response({'id': path, 'path': path})
    return Response({'error': 'POST file required'}, status=status.HTTP_400_BAD_REQUEST)

def file_serve(request, path):
    full_path = os.path.join(settings.MEDIA_ROOT, path)
    if os.path.exists(full_path):
        with open(full_path, 'rb') as f:
            response = FileResponse(f.read(), content_type='application/pdf' if path.endswith('.pdf') else 'image/png')
            return response
    return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

