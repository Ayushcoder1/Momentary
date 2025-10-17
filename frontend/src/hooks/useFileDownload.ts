import { useState } from 'react';

export function useFileDownload() {
  const [code, setCode] = useState('');
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    
    setDownloading(true);
    // Pre-open a tab to avoid popup blockers after async work
    let preOpenedWindow: Window | null = null;
    try {
      try {
        preOpenedWindow = window.open('', '_blank');
      } catch {
        // Ignore if blocked; we'll try a fallback later
        preOpenedWindow = null;
      }

      const res = await fetch(`/files/${encodeURIComponent(clean)}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Download failed');
      }
      
      const blob = await res.blob();
      const mime = blob.type || '';
      const url = URL.createObjectURL(blob);

      // 1) Trigger a file download
      const a = document.createElement('a');
      a.href = url;
      a.download = clean;
      a.rel = 'noreferrer';
      a.click();

      // 2) Also open directly in a new tab for viewable types
      const shouldOpenInline = (
        mime.startsWith('text/') ||
        mime.startsWith('image/') ||
        mime.startsWith('audio/') ||
        mime.startsWith('video/') ||
        mime === 'application/pdf' ||
        mime === 'application/json'
      );
      if (shouldOpenInline) {
        if (preOpenedWindow) {
          try {
            preOpenedWindow.location.href = url;
          } catch {
            // If navigation fails, try fallback open
            window.open(url, '_blank', 'noopener,noreferrer');
          }
        } else {
          // Fallback if we couldn't pre-open a window (may be blocked)
          try {
            window.open(url, '_blank', 'noopener,noreferrer');
          } catch {
            // As a last resort, do nothing; at least the download started
          }
        }
      } else {
        // Not a viewable type: close any pre-opened blank tab
        try {
          if (preOpenedWindow && !preOpenedWindow.closed) {
            preOpenedWindow.close();
          }
        } catch {
          // ignore
        }
      }

      // Give the new tab/download time to start before revoking
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      // Close any blank pre-opened window on error
      try {
        if (preOpenedWindow && !preOpenedWindow.closed) {
          preOpenedWindow.close();
        }
      } catch {
        // ignore
      }
      throw error;
    } finally {
      setDownloading(false);
    }
  };

  const setCodeValue = (value: string) => {
    setCode(value.toUpperCase());
  };

  return {
    code,
    downloading,
    download,
    setCodeValue
  };
}

