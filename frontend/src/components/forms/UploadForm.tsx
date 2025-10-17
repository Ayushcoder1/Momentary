import React from 'react';
import { Label } from '../ui/Label';
import { SectionTitle } from '../ui/SectionTitle';
import { useFileUpload } from '../../hooks/useFileUpload';

interface UploadFormProps {
  onUploadSuccess?: (result: any) => void;
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const {
    formData,
    result,
    submitting,
    canSubmit,
    setFile,
    setTtl,
    upload,
    copyCode
  } = useFileUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Upload form submitted');
    try {
      const uploadResult = await upload();
      if (uploadResult && onUploadSuccess) {
        onUploadSuccess(uploadResult);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  return (
    <div>
      <SectionTitle title="Upload" subtitle="Select a file and retention period" />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>File</Label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-gray-900 file:text-white hover:file:bg-gray-800 transition-colors"
          />
        </div>
        
        <div>
          <Label>Retention</Label>
          <div className="flex gap-2">
            {[10, 20, 30].map((minutes) => (
              <button
                key={minutes}
                type="button"
                onClick={() => {
                  console.log('TTL button clicked:', minutes);
                  setTtl(minutes);
                }}
                className={`px-3 py-1.5 border rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                  formData.ttl === minutes
                    ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {minutes} min
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 bg-gray-900 text-white rounded-md disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 hover:bg-gray-800 disabled:hover:bg-gray-900"
          >
            {submitting ? 'Uploading…' : 'Upload'}
          </button>
          
          {result && (
            <button
              type="button"
              onClick={copyCode}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 hover:bg-gray-50 transition-colors"
            >
              Copy code
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
