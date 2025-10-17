export type View = 'upload' | 'download';

export interface UploadResult {
  code: string;
  expiresAt: string;
}

export interface UploadFormData {
  file: File | null;
  ttl: number;
}

export interface SuccessPopupProps {
  isOpen: boolean;
  result: UploadResult | null;
  onClose: () => void;
  onCopy: () => void;
}

