import { type FormEvent, useState, useEffect } from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import type { Feedback } from "~/types";
import { useNavigate } from "react-router";
import { prepareInstructions, AIResponseFormat } from "../../constants";
import { analyzeResume, uploadResume, isAuthenticated } from "~/lib/api";

const isTipType = (value: unknown): value is "good" | "improve" =>
  value === "good" || value === "improve";

const normalizeTips = (
  tips: unknown,
  requireExplanation: boolean
): { type: "good" | "improve"; tip: string; explanation?: string }[] => {
  if (!Array.isArray(tips)) return [];

  return tips
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const tipType = (item as { type?: unknown }).type;
      const tipText = (item as { tip?: unknown }).tip;
      const explanation = (item as { explanation?: unknown }).explanation;

      if (!isTipType(tipType) || typeof tipText !== "string") return null;
      if (requireExplanation && typeof explanation !== "string") return null;

      if (requireExplanation) {
        return { type: tipType, tip: tipText, explanation };
      }
      return { type: tipType, tip: tipText };
    })
    .filter((tip): tip is { type: "good" | "improve"; tip: string; explanation?: string } => tip !== null);
};

const normalizeFeedback = (raw: unknown): Feedback | null => {
  if (!raw || typeof raw !== "object") return null;

  const root = raw as Record<string, unknown>;
  const section = (name: keyof Feedback) => root[name] as Record<string, unknown> | undefined;

  const toValidScore = (value: unknown): number | null => {
    if (typeof value !== "number" || Number.isNaN(value)) return null;
    const clamped = Math.max(0, Math.min(100, value));
    return Math.round(clamped);
  };

  const overallScore = toValidScore(root.overallScore);
  const ats = section("ATS");
  const toneAndStyle = section("toneAndStyle");
  const content = section("content");
  const structure = section("structure");
  const skills = section("skills");

  if (overallScore === null || !ats || !toneAndStyle || !content || !structure || !skills) return null;

  const atsScore = toValidScore(ats.score);
  const toneScore = toValidScore(toneAndStyle.score);
  const contentScore = toValidScore(content.score);
  const structureScore = toValidScore(structure.score);
  const skillsScore = toValidScore(skills.score);

  if (
    atsScore === null ||
    toneScore === null ||
    contentScore === null ||
    structureScore === null ||
    skillsScore === null
  ) {
    return null;
  }

  return {
    overallScore,
    ATS: {
      score: atsScore,
      tips: normalizeTips(ats.tips, false) as Feedback["ATS"]["tips"],
    },
    toneAndStyle: {
      score: toneScore,
      tips: normalizeTips(toneAndStyle.tips, true) as Feedback["toneAndStyle"]["tips"],
    },
    content: {
      score: contentScore,
      tips: normalizeTips(content.tips, true) as Feedback["content"]["tips"],
    },
    structure: {
      score: structureScore,
      tips: normalizeTips(structure.tips, true) as Feedback["structure"]["tips"],
    },
    skills: {
      score: skillsScore,
      tips: normalizeTips(skills.tips, true) as Feedback["skills"]["tips"],
    },
  };
};

const Upload = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

 // useEffect(() => {
   // if (!isAuthenticated()) {
     // navigate("/auth?next=/upload");
    //}
  //}, [navigate]);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string; jobTitle: string; jobDescription: string; file: File }) => {
    setIsProcessing(true);
    setError(null);

    try {
      
      setStatusText("Uploading resume and image...");
      const uploadedResume = await uploadResume(file, {
        company_name: companyName,
        job_title: jobTitle,
        job_description: jobDescription,
      });

      setStatusText("Analyzing...");
      const feedbackResponse = await analyzeResume(uploadedResume.id, prepareInstructions({ jobTitle, jobDescription, AIResponseFormat }));

      const rawContent = feedbackResponse.feedback || feedbackResponse?.message?.content;
      const feedbackText = typeof rawContent === "string"
        ? rawContent
        : Array.isArray(rawContent)
          ? rawContent[0]?.text ?? JSON.stringify(rawContent)
          : JSON.stringify(rawContent);

      const parsedFeedback = typeof rawContent === "object" && !Array.isArray(rawContent)
        ? rawContent
        : JSON.parse(feedbackText);

      const normalized = normalizeFeedback(parsedFeedback);
      if (!normalized) {
        throw new Error("AI response format mismatch");
      }

      setStatusText("Analysis complete, redirecting...");
      navigate(`/resume/${uploadedResume.id}`);
    } catch (err) {
      setError((err as Error).message);
      setStatusText("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return setError("Please select a resume file.");

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!isProcessing && (
            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
