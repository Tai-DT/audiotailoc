"use client"

import { useState } from "react"
import { ImageUpload } from "@/components/ui/image-upload"

export default function TestImageUploadPage() {
  const [images, setImages] = useState<string[]>([])

  const handleImagesChange = (urls: string[]) => {
    console.log('Images changed:', urls)
    setImages(urls)
  }

  const handleRemove = (index: number) => {
    console.log('Removing image at index:', index)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Test ImageUpload Component</h1>

      <div className="max-w-2xl">
        <ImageUpload
          value={images}
          onChange={handleImagesChange}
          onRemove={handleRemove}
          label="Test Image Upload"
          placeholder="Click để chọn hình ảnh..."
          maxFiles={5}
          maxSize={2}
        />

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <p>Current images count: {images.length}</p>
          <p>Images: {JSON.stringify(images, null, 2)}</p>
        </div>
      </div>
    </div>
  )
}
