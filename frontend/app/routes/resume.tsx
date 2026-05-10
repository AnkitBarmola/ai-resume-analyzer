import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Feedback } from "~/types";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import { getResume, fetchFile, isAuthenticated } from "~/lib/api";

export const meta = () => ([
  { title: 'CareerMate | Review' },
  { name: 'description', content: 'Detailed overview of your resume' },
]);

const ResumePage = () => {
  const { id } = useParams<{ id: string }>();
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [navigate, id]);

  useEffect(() => {
    const loadResume = async () => {
      if (!id) return;

      try {
        const resume = await getResume(id);
        setFeedback(resume.feedback);

        // ✅ fetch PDF and show it directly
        const resumeBlob = await fetchFile(resume.resumePath);
        const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
        setResumeUrl(URL.createObjectURL(pdfBlob));

      } catch (err) {
        setLoadError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadResume();

    return () => {
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    };
  }, [id]);

  return (
    <main className="pt-0!">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="Back" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-screen sticky top-0 items-center justify-center">
          {/* ✅ show PDF in iframe instead of image */}
          {resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] w-full">
              <iframe
                src={resumeUrl}
                className="w-full h-full rounded-2xl"
                title="Resume preview"
              />
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl text-black! font-bold">Resume Review</h2>
          {loading ? (
            <img src="/images/resume-scan-2.gif" alt="Loading..." className="w-full" />
          ) : loadError ? (
            <p className="text-sm text-red-600">{loadError}</p>
          ) : feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS score={feedback.ATS.score} suggestions={feedback.ATS.tips as any || []} />
              <Details feedback={feedback} />
            </div>
          ) : (
            <p className="text-sm text-gray-600">No feedback available.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default ResumePage;