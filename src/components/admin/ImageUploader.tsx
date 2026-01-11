'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2, Check, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  currentImage?: string | null;
  onUploadComplete: (url: string) => Promise<void>;
  folder?: string;
}

export function ImageUploader({ currentImage, onUploadComplete, folder = 'uploads' }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      
      if (data.success) {
        await onUploadComplete(data.url);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload image. Please try again.');
      // Revert preview on error if needed, or keep it to show what failed
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 bg-muted rounded-md overflow-hidden border border-border flex-shrink-0">
        {preview ? (
          <Image 
            src={preview} 
            alt="Preview" 
            fill 
            className="object-cover"
            unoptimized={preview.startsWith('blob:')} // Optimize local blob previews
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-muted-foreground">
            <Upload size={20} />
          </div>
        )}
      </div>

      <div className="flex-grow">
        <div className="flex items-center gap-2">
           <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              <span>{isUploading ? 'Uploading...' : 'Change Image'}</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
                disabled={isUploading}
              />
           </label>
           
           {isUploading && <Loader2 className="animate-spin text-primary h-5 w-5" />}
           {success && <Check className="text-green-500 h-5 w-5" />}
           {error && (
             <div className="flex items-center text-red-500 text-sm">
               <AlertCircle className="h-4 w-4 mr-1" />
               {error}
             </div>
           )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Supported: JPG, PNG, WEBP (Max 5MB)
        </p>
      </div>
    </div>
  );
}
