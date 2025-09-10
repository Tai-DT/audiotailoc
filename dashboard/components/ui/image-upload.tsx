"use client"

import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react"
import { CloudinaryService } from "@/lib/cloudinary"

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

interface ImageUploadProps {
  value?: string[] // Array of URLs for multiple images
  onChange: (urls: string[]) => void // Callback with array of URLs
  onRemove?: (index: number) => void // Remove specific image by index
  label?: string
  placeholder?: string
  folder?: string
  disabled?: boolean
  className?: string
  accept?: string
  maxSize?: number // in MB per file
  maxFiles?: number // Maximum number of files
  width?: number
  height?: number
}

export function ImageUpload({
  value = [], // Default to empty array
  onChange,
  onRemove,
  label = "Hình ảnh",
  placeholder = "Chọn hình ảnh...",
  folder = "products",
  disabled = false,
  className = "",
  accept = "image/*",
  maxSize = 5,
  maxFiles = 10, // Default max 10 files
  width = 300,
  height = 200
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // MCP upload function
  const uploadToMCP = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', file)
      
      // Use fetch with MCP endpoint
      fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Upload failed')
        }
        return response.json()
      })
      .then(data => {
        if (data.url) {
          resolve(data.url)
        } else {
          throw new Error('No URL returned from server')
        }
      })
      .catch(error => {
        console.error('Upload error:', error)
        reject(error)
      })
    })
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    console.log('Files selected:', files)

    if (files.length === 0) {
      console.log('No files selected')
      return
    }
    
    // Check max files limit
    if (value.length + files.length > maxFiles) {
      const errorMsg = `Không thể upload quá ${maxFiles} file. Hiện tại đã có ${value.length} file.`
      console.error(errorMsg)
      setError(errorMsg)
      return
    }
    
    setUploading(true)
    setError(null)
    
    try {
      const uploadedUrls: string[] = []
      const failedFiles: string[] = []
      
      // Upload files in sequence to maintain order
      for (const file of files) {
        try {
          // Production monitoring - track upload attempts
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'file_upload_attempt', {
              event_category: 'upload',
              event_label: file.type,
              value: Math.round(file.size / 1024) // size in KB
            })
          }

          // Validate file size
          if (file.size > maxSize * 1024 * 1024) {
            const errorMsg = `File ${file.name} vượt quá kích thước tối đa ${maxSize}MB`
            console.error(errorMsg, { fileSize: file.size, maxSize: maxSize * 1024 * 1024 })
            failedFiles.push(file.name)

            // Production monitoring - track validation errors
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'file_upload_error', {
                event_category: 'upload',
                event_label: 'file_too_large',
                value: Math.round(file.size / 1024 / 1024) // size in MB
              })
            }
            continue
          }

          // Validate file type
          if (!file.type.startsWith('image/')) {
            const errorMsg = `File ${file.name} không phải là hình ảnh`
            console.error(errorMsg, { fileType: file.type })
            failedFiles.push(file.name)

            // Production monitoring - track validation errors
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'file_upload_error', {
                event_category: 'upload',
                event_label: 'invalid_file_type',
                value: file.type
              })
            }
            continue
          }
          
          console.log('Uploading file:', file.name)
          
          // Upload to server API route
          const fileUrl = await uploadToMCP(file)
          uploadedUrls.push(fileUrl)
          
          // Update progress
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 100 // Mark as complete
          }))

          // Production monitoring - track successful uploads
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'file_upload_success', {
              event_category: 'upload',
              event_label: file.type,
              value: Math.round(file.size / 1024) // size in KB
            })
          }
          
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error)
          failedFiles.push(file.name)

          // Production monitoring - track upload errors
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'file_upload_error', {
              event_category: 'upload',
              event_label: 'upload_failed',
              value: error instanceof Error ? error.message : 'Upload failed'
            })
          }
        }
      }
      
      // Update parent component with new URLs
      if (uploadedUrls.length > 0) {
        onChange([...value, ...uploadedUrls])
      }

      // Show error message if some files failed
      if (failedFiles.length > 0) {
        const errorMsg = `Upload thất bại cho ${failedFiles.length} file: ${failedFiles.join(', ')}`
        setError(errorMsg)
      }
      
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải lên')
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index)
    onChange(newUrls)
    if (onRemove) onRemove(index)
  }

  const handleClick = () => {
    console.log('ImageUpload clicked', {
      disabled,
      uploading
    })

    if (disabled) {
      console.log('Component is disabled')
      return
    }

    if (uploading) {
      console.log('Upload in progress')
      return
    }

    // Let the label handle the click - more reliable than programmatic click
    console.log('Click handled by label element')
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor="image-upload">{label}</Label>
      )}

      <Card className="border-2 border-dashed">
        <CardContent className="p-6">
          {/* Display uploaded images */}
          {value.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Hình ảnh đã upload ({value.length}/{maxFiles})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {value.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-24 bg-gray-100 rounded-md border overflow-hidden">
                      <img
                        src={url}
                        alt={`Uploaded image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(`Failed to load image ${index + 1}:`, url)
                          e.currentTarget.style.display = 'none'
                          const parent = e.currentTarget.parentElement
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
                                <div class="text-center">
                                  <div class="mb-1">📷</div>
                                  <div>Image ${index + 1}</div>
                                </div>
                              </div>
                            `
                          }
                        }}
                        onLoad={() => console.log(`Image ${index + 1} loaded successfully:`, url)}
                      />
                    </div>
                    {!disabled && (
                      <button
                        type="button"
                        title={`Xóa hình ảnh ${index + 1}`}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemove(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload area */}
          {value.length < maxFiles ? (
            <div
              className={`text-center cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleClick()
                }
              }}
            >
              <label htmlFor="image-upload-input" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  {uploading ? (
                    <>
                      <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Đang upload...</p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{placeholder}</p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF tối đa {maxSize}MB mỗi file
                        </p>
                        <p className="text-xs text-blue-600 mt-1 font-medium">
                          Click để chọn file hoặc kéo thả vào đây
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Có thể chọn nhiều file cùng lúc (tối đa {maxFiles - value.length} file nữa)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </label>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Đã đạt giới hạn tối đa {maxFiles} file
              </p>
            </div>
          )}

          {/* Alternative upload button */}
          {value.length < maxFiles && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  console.log('Button clicked, triggering file input')
                  console.log('File input ref exists:', !!fileInputRef.current)
                  console.log('Component disabled:', disabled)
                  console.log('Uploading:', uploading)

                  if (disabled || uploading) {
                    console.log('Component is disabled or uploading, not triggering')
                    return
                  }

                  if (fileInputRef.current) {
                    console.log('Clicking file input via ref')
                    fileInputRef.current.click()
                  } else {
                    console.log('File input ref not found!')
                  }
                }}
                disabled={disabled || uploading}
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Đang upload...' : `Chọn file (${value.length}/${maxFiles})`}
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id="image-upload-input"
        type="file"
        accept={accept}
        multiple={true}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
        aria-label="Upload image files"
      />
    </div>
  )
}

export default ImageUpload
