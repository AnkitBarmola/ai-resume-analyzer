import React from 'react';

interface SummaryProps {
    feedback: any;
}

const Summary: React.FC<SummaryProps> = ({ feedback }) => {
    return (
        <div>
            <h3>Summary</h3>
            {/* Add summary content here */}
        </div>
    );
};

export default Summary;
