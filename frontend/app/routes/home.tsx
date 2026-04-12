import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { Resume } from "~/types";
import { isAuthenticated, listResumes } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CareerMate" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  //useEffect(() => {
    //if (!isAuthenticated()) navigate('/auth?next=/');
  //}, [navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      setLoadError(null);

      try {
        const resumesList = await listResumes();
        setResumes(resumesList);
      } catch (err) {
        setLoadError((err as Error).message);
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
          {loadError && <p className="text-sm text-red-600">{loadError}</p>}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-50" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
