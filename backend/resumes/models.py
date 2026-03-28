from django.db import models
from django.contrib.auth.models import User

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    id = models.CharField(max_length=36, primary_key=True)  # UUID
    company_name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    job_description = models.TextField()
    pdf_file = models.FileField(upload_to='resumes/pdf/')
    image_file = models.FileField(upload_to='resumes/images/', blank=True)
    feedback = models.JSONField()  # { overallScore, ATS, etc. }
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.company_name} - {self.job_title}"

