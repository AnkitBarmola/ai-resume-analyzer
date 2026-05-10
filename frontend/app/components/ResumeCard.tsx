import { Link } from "react-router";
import type { Resume } from "~/types";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback } }: { resume: Resume }) => {
  const handleDelete = async () => {
    if (confirm('Delete this resume?')) {
      console.log('Deleted resume', id);
    }
  };

  return (
    <div className="flex flex-col gap-8 min-h-[220px] w-[350px] lg:w-[430px] xl:w-[490px] bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-row gap-4 justify-between items-start">
        <div className="flex flex-col gap-2 flex-1">
          <h3 className="text-xl font-semibold text-gray-900 m-0">{companyName}</h3>
          <p className="text-sm text-gray-600 m-0">{jobTitle}</p>
        </div>
        <div className="flex items-center justify-center w-20 h-20 rounded-full text-white flex-shrink-0" style={{ background: 'linear-gradient(to bottom, #8e98ff, #606beb)' }}>
          <div className="text-center">
            <span className="text-lg font-bold">{feedback ? feedback.overallScore : "—"}</span>
            <span className="text-xs block">/100</span>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-auto">
        <Link
          to={`/resume/${id}`}
          className="flex-1 text-white rounded-lg px-4 py-2 text-sm font-semibold text-center cursor-pointer transition-all"
          style={{ background: 'linear-gradient(to bottom, #8e98ff, #606beb)' }}
        >
          View Details
        </Link>
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-50 text-red-600 rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-red-100 transition-colors border border-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;