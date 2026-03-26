import React from "react";

interface PitchHeaderProps {
    title: string;
}

const PitchHeader: React.FC<PitchHeaderProps> = ({ title }) => {
    return (
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
                {title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>
    );
};

export default PitchHeader;
