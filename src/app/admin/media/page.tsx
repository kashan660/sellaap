'use client';

import { useState, useEffect } from 'react';
import { getImages, deleteImage } from '@/lib/actions/content';
import ImageUpload from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Copy, ExternalLink, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageType {
  id: number;
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  alt: string | null;
  caption: string | null;
  createdAt: string;
  uploader: {
    name: string | null;
    email: string;
  };
}

export default function AdminMediaPage() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await getImages();
      // Ensure date strings are handled if they come back as objects from server actions
      const processedData = data.map((img: any) => ({
        ...img,
        createdAt: new Date(img.createdAt).toLocaleDateString()
      }));
      setImages(processedData);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      try {
        const result = await deleteImage(id);
        if (result.success) {
          setImages(prev => prev.filter(img => img.id !== id));
        } else {
            alert('Failed to delete image');
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
    alert('URL copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Media Library</h1>
        <p className="text-muted-foreground">Upload and manage images for your products, blog posts, and pages.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload New Images</h2>
        <ImageUpload 
          onImageUpload={(newImage) => {
            setImages(prev => [{
                ...newImage,
                createdAt: new Date().toLocaleDateString(),
                uploader: { email: 'You' } // Placeholder until reload
            }, ...prev]);
          }}
          multiple={true}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden group">
            <div className="aspect-square relative bg-gray-100">
              <Image
                src={image.url}
                alt={image.alt || image.originalName}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                 <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => window.open(image.url, '_blank')}
                  title="View Full Size"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => copyToClipboard(image.url)}
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(image.id)}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="font-medium truncate text-sm" title={image.originalName}>{image.originalName}</p>
              <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                <span>{(image.size / 1024).toFixed(1)} KB</span>
                <span>{image.createdAt}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-medium">No images found</p>
          <p className="text-sm text-muted-foreground">Upload some images to get started</p>
        </div>
      )}
    </div>
  );
}