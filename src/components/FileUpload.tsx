'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '@/lib/actions/upload';
import { Trash2, UploadCloud, FileIcon } from 'lucide-react';

interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

interface FileUploadProps {
  value?: { url: string; name: string; size: number } | null;
  onUploadComplete: (file: UploadedFile) => void;
  onRemove?: () => void;
  maxSize?: number; // in bytes
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUpload({
  value,
  onUploadComplete,
  onRemove,
  maxSize = 500 * 1024 * 1024, // 500MB default, digital assets can be large
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is ${formatSize(maxSize)}`);
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadFile(formData);

      if (!result.success || !result.url) {
        setError(result.error || 'Upload failed');
        return;
      }

      onUploadComplete({
        url: result.url,
        filename: result.filename!,
        originalName: result.originalName!,
        mimeType: result.mimeType || 'application/octet-stream',
        size: result.size!,
      });
    } catch (err) {
      console.error('File upload error:', err);
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  }, [maxSize, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: uploading,
  });

  if (value) {
    return (
      <div className="flex items-center justify-between gap-4 border rounded-lg p-4 bg-muted/20">
        <div className="flex items-center gap-3 min-w-0">
          <FileIcon className="w-8 h-8 text-primary shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{value.name}</p>
            <p className="text-xs text-muted-foreground">{formatSize(value.size)}</p>
          </div>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-red-600 hover:text-red-700 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm font-medium">
          {uploading ? 'Uploading...' : isDragActive ? 'Drop the file here' : 'Drag & drop the digital file here'}
        </p>
        <p className="text-xs text-gray-400 mt-1">or click to select a file (Max: {formatSize(maxSize)})</p>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
