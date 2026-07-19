'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const gallery = images.length > 0 ? images : [];

  if (gallery.length === 0) {
    return (
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted" />
    );
  }

  return (
    <div>
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
        <Image
          src={gallery[activeIndex]}
          alt={name}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      {gallery.length > 1 && (
        <div className="grid grid-cols-5 gap-2 mt-3">
          {gallery.map((url, index) => (
            <button
              key={url + index}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square rounded-md overflow-hidden bg-muted border-2 transition-colors ${
                index === activeIndex ? 'border-primary' : 'border-transparent hover:border-border'
              }`}
            >
              <Image src={url} alt={`${name} thumbnail ${index + 1}`} fill unoptimized className="object-cover" sizes="20vw" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
