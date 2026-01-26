import { Link } from 'react-router'
import ScoreCircle from './ScoreCircle'

const ResumeCard = ({resume}: {resume: Resume}) => {
  return (
    <div>
      <Link to={`/resume/${resume.id}`} className="resume-card animate-in fade-in duration-500"> 
         <div className="resume-card-header">
           <div className="flex flex-col gap-2">
              <h2 className='text-black font-bold break-words'>{resume.jobTitle}</h2>
              <h3 className='text-lg text-gray-600 break-words'>{resume.companyName}</h3>
           </div>
           <div className='flex-shrink-0'>
             <ScoreCircle score={resume.feedback.overallScore} />
           </div>
         </div>
         <div className='gradient-border animate-in fade-in duration-1000'>
           <div className='w-full h-full'>
            <img
              src={resume.imagePath}
              alt={`${resume.companyName} Resume`}
              className='w-full h-87.5 max-sm:h-50 object-cover object-top rounded-md'
            />
           </div>
         </div>
      </Link>
    </div>
  )
}

export default ResumeCard
