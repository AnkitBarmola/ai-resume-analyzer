import React from 'react';

interface ATSProps {
    feedback: any;
}

const ATS: React.FC<ATSProps> = ({ feedback }) => {
    return (
        <div>
            <h3>ATS Feedback</h3>
            {/* Add ATS feedback content here */}
        </div>
    );
};

export default ATS;