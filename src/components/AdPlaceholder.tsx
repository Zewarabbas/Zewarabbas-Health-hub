import React from 'react';

interface AdPlaceholderProps {
  location: 'header' | 'sidebar' | 'in-article' | 'footer';
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ location, className = '' }) => {
  const getDimensions = () => {
    switch (location) {
      case 'header':
        return 'h-24 w-full max-w-4xl';
      case 'sidebar':
        return 'h-[600px] w-full';
      case 'in-article':
        return 'h-64 w-full';
      case 'footer':
        return 'h-32 w-full max-w-4xl';
      default:
        return 'h-24 w-full';
    }
  };

  const getLabel = () => {
    switch (location) {
      case 'header':
        return 'Google AdSense - Top Leaderboard';
      case 'sidebar':
        return 'Google AdSense - Sidebar Skyscraper';
      case 'in-article':
        return 'Google AdSense - In-Article Banner';
      case 'footer':
        return 'Google AdSense - Bottom Leaderboard';
      default:
        return 'Advertisement';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center my-8 ${className}`}>
      <span className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 font-medium">Advertisement</span>
      <div className={`${getDimensions()} bg-slate-100 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs text-center p-4`}>
        {getLabel()}
      </div>
    </div>
  );
};

export default AdPlaceholder;
