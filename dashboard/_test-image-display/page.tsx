"use client"

import { useState } from "react"
import { ImageUpload } from "@/components/ui/image-upload"

export default function TestImageDisplayPage() {
  const [images, setImages] = useState<string[]>([
    "https://res.cloudinary.com/dib7tbv7w/image/upload/v1694092800/test-uploads/sample.jpg",
    "https://picsum.photos/300/200?random=1",
    "https://via.placeholder.com/300x200/FF5733/FFFFFF?text=Test+Image"
  ])

  const handleImagesChange = (urls: string[]) => {
    console.log('Images changed:', urls)
    setImages(urls)
  }

  const handleRemove = (index: number) => {
    console.log('Removing image at index:', index)
  }

  const addSampleImage = () => {
    const sampleUrls = [
      "https://picsum.photos/300/200?random=2",
      "https://picsum.photos/300/200?random=3",
      "https://picsum.photos/300/200?random=4"
    ]
    const randomUrl = sampleUrls[Math.floor(Math.random() * sampleUrls.length)]
    setImages([...images, randomUrl])
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Test Image Display</h1>

      <div className="space-y-6">
        <div className="flex gap-4">
          <button
            onClick={addSampleImage}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Sample Image
          </button>
          <button
            onClick={() => setImages([])}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear All
          </button>
        </div>

        <div className="max-w-4xl">
          <ImageUpload
            value={images}
            onChange={handleImagesChange}
            onRemove={handleRemove}
            label="Test Image Display"
            placeholder="Test hình ảnh..."
            maxFiles={10}
            maxSize={5}
          />
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Current Images ({images.length}):</h3>
          <div className="space-y-1">
            {images.map((url, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{index + 1}:</span> {url}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
