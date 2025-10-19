import React from 'react';

interface HowToProps {
  className?: string;
}

const HowTo: React.FC<HowToProps> = ({ className = '' }) => {
  return (
    <div className={`how-to-section ${className}`}>
      <h2 className="text-2xl font-bold mb-4">How It Works</h2>
      <div className="space-y-4">
        <div className="step">
          <h3 className="text-lg font-semibold">Step 1</h3>
          <p className="text-gray-600">Describe what you want to build</p>
        </div>
        <div className="step">
          <h3 className="text-lg font-semibold">Step 2</h3>
          <p className="text-gray-600">AI generates your application</p>
        </div>
        <div className="step">
          <h3 className="text-lg font-semibold">Step 3</h3>
          <p className="text-gray-600">Preview and customize your app</p>
        </div>
      </div>
    </div>
  );
};

export default HowTo;
