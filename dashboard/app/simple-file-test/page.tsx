"use client"

import { useState } from "react"

export default function SimpleFileTestPage() {
  const [selectedFile, setSelectedFile] = useState<string>("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("File selected:", file.name, file.size, file.type)
      setSelectedFile(`${file.name} (${file.size} bytes, ${file.type})`)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Simple File Test</h1>
      
      <div className="space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          aria-label="Select image file"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        
        {selectedFile && (
          <div className="p-4 bg-green-100 rounded">
            <p className="text-green-800">Selected: {selectedFile}</p>
          </div>
        )}
      </div>
    </div>
  )
}
