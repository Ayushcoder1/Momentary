import React, { useEffect } from 'react';
import { SuccessPopupProps } from '../../types';

export function SuccessPopup({ isOpen, result, onClose, onCopy }: SuccessPopupProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 10000); // Auto close after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success content */}
        <div className="text-center">
          {/* Green tick icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success message */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Successful!</h3>
          <p className="text-sm text-gray-600 mb-6">Your file has been uploaded successfully</p>

          {/* Generated code */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Share this code:</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-2xl font-mono tracking-[0.3em] font-bold text-gray-900 bg-white px-4 py-2 rounded border">
                {result.code}
              </p>
              <button
                onClick={onCopy}
                className="px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Expiry info */}
          <p className="text-xs text-gray-500">
            Expires at {new Date(result.expiresAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}





