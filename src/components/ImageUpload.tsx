'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '@/lib/actions/content';
import { uploadFile } from '@/lib/actions/upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload?: (image: any) => void;
  multiple?: boolean;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

export default function ImageUpload({ 
  onImageUpload, 
  multiple = false, 
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
        continue;
      }

      setUploading(true);
      
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        
        // Upload to server
        const fileResult = await uploadFile(formData);
        
        if (!fileResult.success || !fileResult.url) {
          console.error('File upload failed:', fileResult.error);
          alert(`Failed to upload ${file.name}: ${fileResult.error}`);
          continue;
        }
        
        const result = await uploadImage({
          filename: fileResult.filename,
          originalName: fileResult.originalName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          url: fileResult.url,
          alt: altText,
          caption: caption
        });

        if (result.success) {
          const newImage = result.image;
          setUploadedImages(prev => [...prev, newImage]);
          onImageUpload?.(newImage);
          
          // Reset alt and caption for next upload
          setAltText('');
          setCaption('');
        } else {
          console.error('Upload failed:', result.error);
        }
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setUploading(false);
      }
    }
  }, [altText, caption, maxSize, onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple,
    disabled: uploading
  });

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Image Metadata Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Alt Text</label>
          <Input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe the image for accessibility"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Caption</label>
          <Input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Optional caption for the image"
          />
        </div>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? 'Drop the images here' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-gray-500">
          or click to select files
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Supported: {acceptedTypes.join(', ')} (Max: {maxSize / (1024 * 1024)}MB)
        </p>
      </div>

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uploadedImages.map((image: any, index: number) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm truncate">{image.originalName}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={image.url}
                    alt={image.alt || image.originalName}
                    fill
                    className="object-cover"
                  />
                </div>
                {image.alt && (
                  <p className="text-xs text-gray-500 mt-2 truncate">
                    Alt: {image.alt}
                  </p>
                )}
                {image.caption && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    Caption: {image.caption}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Size: {(image.size / 1024).toFixed(1)}KB
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {uploading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Uploading...</p>
        </div>
      )}
    </div>
  );
}
