"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"

function TestImageUpload() {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    console.log('Files selected:', files)

    // Simple test - just show file names
    const urls = files.map(file => `file://${file.name}`)
    setImageUrls(urls)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleButtonClick = () => {
    console.log('Button clicked - attempting to trigger file input')
    if (fileInputRef.current) {
      console.log('File input ref exists, clicking...')
      fileInputRef.current.click()
    } else {
      console.log('File input ref is null!')
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug File Input</h1>

      <div className="space-y-4">
        {/* Direct file input for comparison */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Direct File Input:</h3>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="border p-2"
            aria-label="Direct file input for testing"
          />
        </div>

        {/* Button with ref trigger */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Button with Ref Trigger:</h3>
          <button
            onClick={handleButtonClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Trigger File Input (Ref)
          </button>
        </div>

        {/* Button with label trigger */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Button with Label Trigger:</h3>
          <label htmlFor="debug-file-input">
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Trigger File Input (Label)
            </button>
          </label>
          <input
            ref={fileInputRef}
            id="debug-file-input"
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Results */}
        {imageUrls.length > 0 && (
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-semibold mb-2">Selected Files:</h3>
            <ul className="list-disc list-inside">
              {imageUrls.map((url, index) => (
                <li key={index}>{url}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h2 className="text-lg font-semibold mb-2">Debug Instructions:</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Test Direct File Input - click trực tiếp vào input</li>
            <li>Test Button with Ref - click button để trigger qua ref</li>
            <li>Test Button with Label - click button để trigger qua label</li>
            <li>Kiểm tra Console để xem debug messages</li>
            <li>So sánh kết quả của 3 cách tiếp cận</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(TestImageUpload), {
  ssr: false
})
