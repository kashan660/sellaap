'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
    currentImage: string;
    onUploadComplete: (url: string) => void;
    folder?: string;
}

export function ImageUploader({ currentImage, onUploadComplete, folder = 'uploads' }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Optimistic preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            if (data.success) {
                onUploadComplete(data.url);
                setPreview(data.url); // Ensure we show the server URL
            }
        } catch (error) {
            console.error('Upload error:', error);
            // Revert preview on error if needed, or just show error toast
            alert('Failed to upload image');
            setPreview(currentImage);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted border border-border flex-shrink-0">
                {preview ? (
                    <Image 
                        src={preview} 
                        alt="Preview" 
                        fill 
                        className="object-cover"
                        unoptimized={preview.startsWith('http')} // Handle external URLs or blob URLs
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon size={24} />
                    </div>
                )}
                {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                        <Loader2 size={20} className="animate-spin" />
                    </div>
                )}
            </div>
            
            <label className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-colors">
                <Upload size={14} />
                <span>{isUploading ? 'Uploading...' : 'Change Image'}</span>
                <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
            </label>
        </div>
    );
}
