from rest_framework import serializers
from .models import Resume


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            "id",
            "company_name",
            "job_title",
            "job_description",
            "pdf_file",
            "feedback",
            "uploaded_at",
        ]
        read_only_fields = ["id", "uploaded_at", "feedback"]