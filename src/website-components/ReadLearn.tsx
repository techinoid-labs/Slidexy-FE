import React from 'react';

interface ReadLearnProps {
  className?: string;
}

const ReadLearn: React.FC<ReadLearnProps> = ({ className = '' }) => {
  return (
    <div className={`read-learn-section ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Read & Learn</h2>
      <p className="text-gray-600 mb-6">
        Expand your knowledge with our comprehensive resources and guides.
      </p>
      <div className="resources-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="resource-card p-4 border rounded-lg hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2">Documentation</h3>
          <p className="text-sm text-gray-600 mb-3">
            Comprehensive guides and API references
          </p>
          <a href="#" className="text-blue-600 text-sm hover:underline">
            Read More →
          </a>
        </div>
        <div className="resource-card p-4 border rounded-lg hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2">Tutorials</h3>
          <p className="text-sm text-gray-600 mb-3">
            Step-by-step tutorials for beginners
          </p>
          <a href="#" className="text-blue-600 text-sm hover:underline">
            Learn More →
          </a>
        </div>
        <div className="resource-card p-4 border rounded-lg hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2">Best Practices</h3>
          <p className="text-sm text-gray-600 mb-3">
            Industry best practices and tips
          </p>
          <a href="#" className="text-blue-600 text-sm hover:underline">
            Explore →
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReadLearn;
