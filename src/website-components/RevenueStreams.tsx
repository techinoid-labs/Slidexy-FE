import React from 'react';

interface RevenueStreamsProps {
  className?: string;
}

const RevenueStreams: React.FC<RevenueStreamsProps> = ({ className = '' }) => {
  return (
    <div className={`revenue-streams-section ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Revenue Streams</h2>
      <p className="text-gray-600 mb-6">
        Multiple ways to generate revenue with your application.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="revenue-card p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Subscriptions</h3>
          <p className="text-sm text-gray-600">Recurring monthly revenue</p>
        </div>
        <div className="revenue-card p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">One-time Purchases</h3>
          <p className="text-sm text-gray-600">Direct sales and downloads</p>
        </div>
        <div className="revenue-card p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Freemium</h3>
          <p className="text-sm text-gray-600">Free tier with premium features</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueStreams;
