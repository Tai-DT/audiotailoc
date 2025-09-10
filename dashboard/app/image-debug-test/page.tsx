'use client'

import { useState } from 'react'

export default function ImageDebugTest() {
  const [testUrls, setTestUrls] = useState<string[]>([
    'https://res.cloudinary.com/dib7tbv7w/image/upload/test.jpg',
    'https://res.cloudinary.com/dib7tbv7w/image/upload/sample.jpg',
  ])

  const [newUrl, setNewUrl] = useState('')
  const [testResults, setTestResults] = useState<Record<string, any>>({})

  const addTestUrl = () => {
    if (newUrl && !testUrls.includes(newUrl)) {
      setTestUrls([...testUrls, newUrl])
      setNewUrl('')
    }
  }

  const removeUrl = (url: string) => {
    setTestUrls(testUrls.filter(u => u !== url))
    const newResults = { ...testResults }
    delete newResults[url]
    setTestResults(newResults)
  }

  const testImageUrl = async (url: string) => {
    try {
      console.log('Testing URL:', url)
      const response = await fetch(url, { method: 'HEAD' })
      const result = {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length'),
        lastModified: response.headers.get('last-modified'),
        etag: response.headers.get('etag'),
        accessible: response.ok,
        error: null
      }
      setTestResults(prev => ({ ...prev, [url]: result }))
      console.log('Test result:', result)
    } catch (error: any) {
      const errorResult = {
        status: 0,
        statusText: 'Network Error',
        accessible: false,
        error: error.message
      }
      setTestResults(prev => ({ ...prev, [url]: errorResult }))
      console.error('Test error:', error)
    }
  }

  const getStatusColor = (result: any) => {
    if (!result) return 'bg-gray-100'
    if (result.accessible && result.status === 200) return 'bg-green-100'
    if (result.status === 404) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getStatusText = (result: any) => {
    if (!result) return 'Chưa test'
    if (result.accessible && result.status === 200) return '✅ OK'
    if (result.status === 404) return '⚠️ Không tìm thấy'
    if (result.error) return `❌ ${result.error}`
    return `❌ ${result.status} ${result.statusText}`
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Cloudinary Image Debug Test</h1>

      {/* Add URL Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Thêm URL để test</h2>
        <div className="flex gap-2">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Nhập URL Cloudinary..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && addTestUrl()}
          />
          <button
            onClick={addTestUrl}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={!newUrl}
          >
            Thêm
          </button>
        </div>
      </div>

      {/* Test URLs Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">Test URLs</h2>

        {testUrls.length === 0 ? (
          <p className="text-gray-500">Chưa có URL nào để test</p>
        ) : (
          <div className="space-y-4">
            {testUrls.map((url, index) => {
              const result = testResults[url]
              return (
                <div key={index} className={`${getStatusColor(result)} p-4 rounded-lg border`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm break-all">{url}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => testImageUrl(url)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Test
                      </button>
                      <button
                        onClick={() => removeUrl(url)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* Image Preview */}
                  <div className="mb-3">
                    <img
                      src={url}
                      alt={`Test image ${index + 1}`}
                      className="max-w-32 max-h-32 object-cover border rounded"
                      onError={(e) => {
                        console.error(`Image load error for ${url}:`, e)
                        e.currentTarget.style.display = 'none'
                      }}
                      onLoad={() => console.log(`Image loaded successfully: ${url}`)}
                    />
                  </div>

                  {/* Status */}
                  <div className="text-sm">
                    <span className="font-medium">Trạng thái:</span> {getStatusText(result)}
                  </div>

                  {/* Details */}
                  {result && (
                    <div className="mt-2 text-xs text-gray-600">
                      {result.contentType && <div>Content-Type: {result.contentType}</div>}
                      {result.contentLength && <div>Content-Length: {result.contentLength} bytes</div>}
                      {result.lastModified && <div>Last-Modified: {result.lastModified}</div>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg mt-6">
        <h3 className="font-semibold mb-2">Hướng dẫn debug:</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Thêm URL Cloudinary để test tính khả dụng</li>
          <li>Kiểm tra console browser để xem lỗi chi tiết</li>
          <li>Xác minh cloud name trong URL có đúng không</li>
          <li>Kiểm tra xem hình ảnh có tồn tại trên Cloudinary dashboard</li>
          <li>Test CORS và network policies</li>
        </ul>
      </div>
    </div>
  )
}