import React from 'react';
import { useSelector } from 'react-redux';

const GlobalAuthLoader = () => {
  const { isRefreshingData } = useSelector(state => state.auth);

  if (!isRefreshingData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium">Updating session...</p>
      </div>
    </div>
  );
};

export default GlobalAuthLoader;