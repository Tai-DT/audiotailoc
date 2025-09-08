"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import Image from "next/image"

export default function UploadTestPage() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Image Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload
            value={uploadedUrls}
            onChange={setUploadedUrls}
            label="Test Image Upload"
            placeholder="Select an image to test upload..."
            folder="test-uploads"
          />

          {uploadedUrls.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Uploaded Images:</p>
              <div className="grid grid-cols-2 gap-4">
                {uploadedUrls.map((url, index) => (
                  <div key={index} className="space-y-2">
                    <Image
                      src={url}
                      alt="Uploaded"
                      width={400}
                      height={300}
                      className="max-w-md rounded-lg border"
                    />
                    <p className="text-xs text-gray-500 break-all">{url}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
