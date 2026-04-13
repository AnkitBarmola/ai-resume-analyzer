import fitz  # PyMuPDF
import google.generativeai as genai
from django.conf import settings
import json


def extract_text_from_pdf(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()


def analyze_resume_with_ai(pdf_path: str, job_title: str, job_description: str, company_name: str) -> dict:
    resume_text = extract_text_from_pdf(pdf_path)

    if not resume_text:
        raise ValueError("Could not extract text from PDF")

    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""
You are an expert resume reviewer and ATS (Applicant Tracking System) specialist.

Analyze the following resume against the job description and return ONLY a JSON object with this exact structure, no extra text, no markdown, no code blocks:

{{
  "overallScore": <0-100>,
  "ATS": {{
    "score": <0-100>,
    "tips": [
      {{"type": "good" or "improve", "tip": "<tip text>"}}
    ]
  }},
  "toneAndStyle": {{
    "score": <0-100>,
    "tips": [
      {{"type": "good" or "improve", "tip": "<tip text>", "explanation": "<explanation>"}}
    ]
  }},
  "content": {{
    "score": <0-100>,
    "tips": [
      {{"type": "good" or "improve", "tip": "<tip text>", "explanation": "<explanation>"}}
    ]
  }},
  "structure": {{
    "score": <0-100>,
    "tips": [
      {{"type": "good" or "improve", "tip": "<tip text>", "explanation": "<explanation>"}}
    ]
  }},
  "skills": {{
    "score": <0-100>,
    "tips": [
      {{"type": "good" or "improve", "tip": "<tip text>", "explanation": "<explanation>"}}
    ]
  }}
}}

Job Title: {job_title}
Company: {company_name}
Job Description:
{job_description}

Resume:
{resume_text}
"""

    response = model.generate_content(prompt)
    response_text = response.text.strip()

    # Strip markdown code blocks if present
    if response_text.startswith("```"):
        response_text = response_text.split("```")[1]
        if response_text.startswith("json"):
            response_text = response_text[4:]
        response_text = response_text.strip()

    return json.loads(response_text)