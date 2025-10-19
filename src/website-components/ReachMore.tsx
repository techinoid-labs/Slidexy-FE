import React from 'react';

interface ReachMoreProps {
  className?: string;
}

const ReachMore: React.FC<ReachMoreProps> = ({ className = '' }) => {
  return (
    <div className={`reach-more-section ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Reach More Customers</h2>
      <p className="text-gray-600 mb-4">
        Expand your reach and connect with more customers through our platform.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="feature-card p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Global Reach</h3>
          <p className="text-sm text-gray-600">Connect with customers worldwide</p>
        </div>
        <div className="feature-card p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Smart Targeting</h3>
          <p className="text-sm text-gray-600">AI-powered customer targeting</p>
        </div>
      </div>
    </div>
  );
};

export default ReachMore;
