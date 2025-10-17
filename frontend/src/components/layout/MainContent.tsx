import React, { useState } from 'react';
import { View } from '../../types';
import { ViewSwitcher } from '../ui/ViewSwitcher';
import { UploadForm } from '../forms/UploadForm';
import { DownloadForm } from '../forms/DownloadForm';
import { SuccessPopup } from '../ui/SuccessPopup';
import { UploadResult } from '../../types';

export function MainContent() {
  const [currentView, setCurrentView] = useState<View>('upload');
  const [successPopup, setSuccessPopup] = useState<{
    isOpen: boolean;
    result: UploadResult | null;
  }>({ isOpen: false, result: null });

  const handleUploadSuccess = (result: UploadResult) => {
    setSuccessPopup({ isOpen: true, result });
  };

  const handleCloseSuccessPopup = () => {
    setSuccessPopup({ isOpen: false, result: null });
  };

  const handleCopyCode = async () => {
    if (successPopup.result) {
      try {
        await navigator.clipboard.writeText(successPopup.result.code);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    }
  };

  return (
    <>
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          {/* Header section */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold font-mono tracking-tight text-gray-900">
                Share files quickly and securely
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-mono">
                Upload a file, pick retention, share a 4‑character code. Files auto‑expire.
              </p>
            </div>
            <ViewSwitcher 
              currentView={currentView} 
              onViewChange={setCurrentView}
              className="hidden sm:flex"
            />
          </div>

          {/* Mobile view switcher */}
          <div className="mb-6 sm:hidden">
            <ViewSwitcher 
              currentView={currentView} 
              onViewChange={setCurrentView}
              className="w-full"
            />
          </div>

          {/* Content area with smooth transitions */}
          <div className="relative min-h-[400px]">
            <div className={`transition-all duration-300 ease-in-out transform ${
              currentView === 'upload' 
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 translate-x-4 scale-95 absolute inset-0 pointer-events-none'
            }`}>
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <UploadForm onUploadSuccess={handleUploadSuccess} />
              </div>
            </div>
            
            <div className={`transition-all duration-300 ease-in-out transform ${
              currentView === 'download' 
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 -translate-x-4 scale-95 absolute inset-0 pointer-events-none'
            }`}>
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <DownloadForm />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-8">
            Files auto‑deleted after 10/20/30 minutes. Avoid sensitive data.
          </p>
        </div>
      </main>

      {/* Success popup */}
      <SuccessPopup
        isOpen={successPopup.isOpen}
        result={successPopup.result}
        onClose={handleCloseSuccessPopup}
        onCopy={handleCopyCode}
      />
    </>
  );
}
