from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Resume
from .serializers import ResumeSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_resumes(request):
    resumes = Resume.objects.filter(user=request.user).order_by("-uploaded_at")
    serializer = ResumeSerializer(resumes, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_resume(request, resume_id):
    try:
        resume = Resume.objects.get(id=resume_id, user=request.user)
    except Resume.DoesNotExist:
        return Response({"error": "Resume not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ResumeSerializer(resume)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_resume(request):
    pdf_file = request.FILES.get("pdf_file")
    if not pdf_file:
        return Response({"error": "No PDF file provided"}, status=status.HTTP_400_BAD_REQUEST)

    resume = Resume.objects.create(
        user=request.user,
        pdf_file=pdf_file,
        company_name=request.data.get("company_name", ""),
        job_title=request.data.get("job_title", ""),
        job_description=request.data.get("job_description", ""),
    )

    return Response({
        "resume_id": resume.id,
        "pdf_path": resume.pdf_file.url,
    }, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_resume(request, resume_id):
    try:
        resume = Resume.objects.get(id=resume_id, user=request.user)
    except Resume.DoesNotExist:
        return Response({"error": "Resume not found"}, status=status.HTTP_404_NOT_FOUND)

    resume.pdf_file.delete()  # delete file from disk
    resume.delete()
    return Response({"message": "Resume deleted"}, status=status.HTTP_204_NO_CONTENT)