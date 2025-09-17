'use client';

import React from 'react';
import Image from 'next/image';

export default function TestImages() {
  const cloudinaryUrl = 'https://res.cloudinary.com/dib7tbv7w/image/upload/v1735756800/audio-products/micro-1.jpg';

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Test Hình ảnh Cloudinary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Hình ảnh từ Cloudinary</h2>
          <div className="relative w-full h-64 border rounded-lg overflow-hidden">
            <Image
              src={cloudinaryUrl}
              alt="Test Cloudinary"
              fill
              className="object-cover"
              onError={(e) => {
                console.error('Cloudinary image failed to load:', e);
              }}
              onLoad={() => {
                console.log('Cloudinary image loaded successfully');
              }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">{cloudinaryUrl}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Hình ảnh placeholder</h2>
          <div className="relative w-full h-64 border rounded-lg overflow-hidden">
            <Image
              src="/placeholder-product.svg"
              alt="Placeholder"
              fill
              className="object-cover"
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">/placeholder-product.svg</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Debug Info</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p><strong>Cloud Name:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}</p>
          <p><strong>API URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}</p>
        </div>
      </div>
    </div>
  );
}