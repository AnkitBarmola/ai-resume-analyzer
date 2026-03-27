import { Link } from "react-router";
import { useMockStore } from "~/lib/mockStore";
import { useState, useEffect } from "react";
import type { Resume } from "~/types";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
  const { fs } = useMockStore();
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    // Mock image load - use public path
    setResumeUrl(imagePath);
  }, [imagePath]);

  const handleDelete = async () => {
    if (confirm('Delete this resume?')) {
      // Mock delete
      console.log('Deleted resume', id);
    }
  };

  return (
    <div className="resume-card">
      <div className="resume-header">
        <div className="company-job">
          <h3>{companyName}</h3>
          <p>{jobTitle}</p>
        </div>
        <div className="score-circle">
          <div className="score-text">
            {feedback.overallScore}
            <span>/100</span>
          </div>
        </div>
      </div>
      <div className="resume-footer">
        <Link to={`/resume/${id}`} className="view-btn">
          View Details
        </Link>
        <button onClick={handleDelete} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;

