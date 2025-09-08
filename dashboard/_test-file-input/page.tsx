"use client"

import { useState, useRef } from "react"

export default function TestFileInputPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    console.log('Files selected:', files)
    setSelectedFiles(files)
  }

  const handleButtonClick = () => {
    console.log('Button clicked, triggering file input')
    console.log('File input ref exists:', !!fileInputRef.current)

    if (fileInputRef.current) {
      console.log('Clicking file input via ref')
      fileInputRef.current.click()
    } else {
      console.log('File input ref not found!')
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Test File Input Trigger</h1>

      <div className="max-w-md space-y-4">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="test-file-input"
          aria-label="Select files"
        />

        {/* Test button */}
        <button
          onClick={handleButtonClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Chọn file (Test)
        </button>

        {/* Results */}
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Selected Files:</h3>
          {selectedFiles.length > 0 ? (
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name} ({file.size} bytes)</li>
              ))}
            </ul>
          ) : (
            <p>Chưa chọn file nào</p>
          )}
        </div>
      </div>
    </div>
  )
}
