import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions, AIResponseFormat} from "../../constants";

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
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: null as Feedback | null,
        }

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription, AIResponseFormat })
        )
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        try {
            const parsedFeedback = JSON.parse(feedbackText);
            const normalized = normalizeFeedback(parsedFeedback);
            if (!normalized) {
                console.error('AI response does not match Feedback schema:', parsedFeedback);
                return setStatusText('Error: AI response format mismatch');
            }
            data.feedback = normalized;
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', parseError);
            console.error('Raw response:', feedbackText);
            return setStatusText('Error: Invalid response format from AI');
        }
        if (!data.feedback) return setStatusText('Error: Failed to generate feedback');
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

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
    )
}
export default Upload
