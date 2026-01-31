import React from 'react';

interface DetailsProps {
    feedback: any;
}

const Details: React.FC<DetailsProps> = ({ feedback }) => {
    return (
        <div>
            <h3>Details</h3>
            {/* Add details content here */}
        </div>
    );
};

export default Details;
