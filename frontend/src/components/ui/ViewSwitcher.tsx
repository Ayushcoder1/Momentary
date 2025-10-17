import React from 'react';
import { View } from '../../types';

interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
  className?: string;
}

export function ViewSwitcher({ currentView, onViewChange, className = "" }: ViewSwitcherProps) {
  return (
    <div className={`inline-flex rounded-md shadow-sm ${className}`} role="group">
      <button
        className={`px-4 py-2 text-sm font-medium border transition-all duration-200 ${
          currentView === 'upload'
            ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        } rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:z-10`}
        onClick={() => {
          console.log('Upload button clicked');
          onViewChange('upload');
        }}
      >
        Upload
      </button>
      <button
        className={`px-4 py-2 text-sm font-medium border -ml-px transition-all duration-200 ${
          currentView === 'download'
            ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        } rounded-r-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:z-10`}
        onClick={() => {
          console.log('Download button clicked');
          onViewChange('download');
        }}
      >
        Download
      </button>
    </div>
  );
}
