import React from 'react';

interface ThrivingProps {
  className?: string;
}

const Thriving: React.FC<ThrivingProps> = ({ className = '' }) => {
  return (
    <div className={`thriving-section ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Thriving Business</h2>
      <p className="text-gray-600 mb-6">
        Build a thriving business with the right tools and strategies.
      </p>
      <div className="success-metrics grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric text-center">
          <div className="text-2xl font-bold text-blue-600">10K+</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
        <div className="metric text-center">
          <div className="text-2xl font-bold text-green-600">99.9%</div>
          <div className="text-sm text-gray-600">Uptime</div>
        </div>
        <div className="metric text-center">
          <div className="text-2xl font-bold text-purple-600">50+</div>
          <div className="text-sm text-gray-600">Countries</div>
        </div>
        <div className="metric text-center">
          <div className="text-2xl font-bold text-orange-600">24/7</div>
          <div className="text-sm text-gray-600">Support</div>
        </div>
      </div>
    </div>
  );
};

export default Thriving;
