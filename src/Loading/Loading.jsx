import React from 'react';

const Loading = () => {
  return (
    <div className="flex  items-center justify-center h-screen space-y-4">
      <span className="loading loading-ring loading-lg"></span>
      <span className="loading loading-ring loading-xl"></span>
      <span className="loading loading-ring loading-lg"></span>
      <span className="loading loading-ring loading-xl"></span>
      <span className="loading loading-ring loading-lg"></span>
      <span className="loading loading-ring loading-xl"></span>
    </div>
  );
};

export default Loading;
