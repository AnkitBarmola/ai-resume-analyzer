import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

// Types are defined in types/index.d.ts

interface ResumeData {
    resumePath: string;
    imagePath: string;
    feedback: Feedback;
}

export const meta = () => ([
    { title: 'Resumind | Review' },
    { name: 'description', content: 'Detailed overview of your resume' },
]);

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams<{ id: string }>();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [resumeUrl, setResumeUrl] = useState<string>('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate(`/auth?next=/resume/${id}`);
        }
    }, [isLoading, auth.isAuthenticated, navigate, id]);

    useEffect(() => {
        const loadResume = async () => {
            if (!id) return;

            const resume = await kv.get(`resume:${id}`);
            if (!resume) return;

            const data: ResumeData = JSON.parse(resume);

            // Load PDF
            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(pdfUrl);

            // Load image
            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            
            const imgUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imgUrl);

            setFeedback(data.feedback);
            console.log({ resumeUrl: pdfUrl, imageUrl: imgUrl, feedback: data.feedback });
        };

        loadResume();

        // Cleanup URLs on unmount
        return () => {
            if (resumeUrl) URL.revokeObjectURL(resumeUrl);
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [id, fs, kv]);

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
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    alt="Resume preview"
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl text-black! font-bold">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips as any || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" alt="Loading..." className="w-full" />
                    )}
                </section>
            </div>
        </main>
    );
};

export default Resume;