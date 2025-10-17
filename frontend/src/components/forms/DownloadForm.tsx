import React from 'react';
import { Label } from '../ui/Label';
import { SectionTitle } from '../ui/SectionTitle';
import { useFileDownload } from '../../hooks/useFileDownload';

export function DownloadForm() {
  const { code, downloading, download, setCodeValue } = useFileDownload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Download form submitted with code:', code);
    try {
      await download();
    } catch (error) {
      console.error('Download error:', error);
      alert(error instanceof Error ? error.message : 'Download failed');
    }
  };

  return (
    <div>
      <SectionTitle title="Download" subtitle="Enter the 4‑character access code" />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Access Code</Label>
          <input
            value={code}
            onChange={(e) => setCodeValue(e.target.value)}
            placeholder="AB12"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 tracking-widest font-mono text-center text-lg transition-colors"
            maxLength={4}
          />
        </div>
        
        <button
          type="submit"
          disabled={downloading || !code.trim()}
          className="px-4 py-2 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 transition-all duration-200 hover:bg-gray-800 disabled:hover:bg-gray-900"
        >
          {downloading ? 'Downloading…' : 'Download'}
        </button>
      </form>
    </div>
  );
}
