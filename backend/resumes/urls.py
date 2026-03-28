from django.urls import path
from . import views

app_name = 'resumes'

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('resumes/', views.ResumeListCreateView.as_view(), name='resumes'),
    path('resumes/<str:pk>/', views.ResumeRetrieveUpdateDestroyView.as_view(), name='resume_detail'),
    path('analyze/', views.AnalyzeView.as_view(), name='analyze'),
    path('resumes/upload/', views.file_upload, name='file_upload'),
    path('resumes/file/<path:path>/', views.file_serve, name='file_serve'),
]

