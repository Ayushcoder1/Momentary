import { useState, useMemo } from 'react';
import { UploadResult, UploadFormData } from '../types';

export function useFileUpload() {
  const [formData, setFormData] = useState<UploadFormData>({ file: null, ttl: 10 });
  const [result, setResult] = useState<UploadResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => Boolean(formData.file) && !submitting, [formData.file, submitting]);

  const setFile = (file: File | null) => {
    setFormData(prev => ({ ...prev, file }));
  };

  const setTtl = (ttl: number) => {
    setFormData(prev => ({ ...prev, ttl }));
  };

  const upload = async () => {
    if (!formData.file) return;
    
    setSubmitting(true);
    try {
      const form = new FormData();
      form.set('file', formData.file);
      form.set('ttlMinutes', String(formData.ttl));
      
      const res = await fetch('/files/upload', { method: 'POST', body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Upload failed');
      }
      
      const data = await res.json();
      setResult(data);
      return data;
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.code);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const reset = () => {
    setResult(null);
    setFormData({ file: null, ttl: 10 });
  };

  return {
    formData,
    result,
    submitting,
    canSubmit,
    setFile,
    setTtl,
    upload,
    copyCode,
    reset
  };
}

