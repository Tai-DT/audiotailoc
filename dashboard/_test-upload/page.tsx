"use client"

import { useState } from "react"
import Image from "next/image"

interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
}

export default function TestUploadPage() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState<string>("")

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("File selected:", file.name, file.size, file.type)
    setError("")
    setResult(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'test-uploads')

      console.log("Uploading to:", `${window.location.origin}/api/upload`)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const responseText = await response.text()
      console.log("Response status:", response.status)
      console.log("Response text:", responseText)

      if (!response.ok) {
        throw new Error(`Upload failed: ${responseText}`)
      }

      const result = JSON.parse(responseText)
      console.log("Upload result:", result)
      setResult(result)

    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Test Upload to Cloudinary</h1>
      
      <div className="space-y-4 max-w-2xl">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          disabled={uploading}
          aria-label="Select image to upload"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        
        {uploading && (
          <div className="p-4 bg-blue-100 rounded">
            <p className="text-blue-800">🔄 Uploading...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-100 rounded">
            <p className="text-red-800">❌ Error: {error}</p>
          </div>
        )}
        
        {result && (
          <div className="p-4 bg-green-100 rounded">
            <h3 className="font-bold text-green-800 mb-2">✅ Upload Successful!</h3>
            <div className="text-green-700 text-sm space-y-1">
              <p><strong>URL:</strong> <a href={result.url} target="_blank" className="underline">{result.url}</a></p>
              <p><strong>Public ID:</strong> {result.publicId}</p>
              <p><strong>Size:</strong> {result.width}x{result.height}</p>
              <p><strong>Format:</strong> {result.format}</p>
              <p><strong>File Size:</strong> {result.bytes} bytes</p>
            </div>
            {result.url && (
              <div className="mt-4">
                <Image 
                  src={result.url} 
                  alt="Uploaded image" 
                  width={result.width > 400 ? 400 : result.width}
                  height={result.height > 300 ? 300 : result.height}
                  className="max-w-sm rounded shadow"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
