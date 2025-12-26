"use client"

import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { X, Image as ImageIcon, Loader2, Pencil } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// Image with SEO metadata
export interface ImageWithSEO {
  url: string;
  alt?: string;
  title?: string;
}

// Helper to normalize images to ImageWithSEO format
export const normalizeImages = (images: (string | ImageWithSEO)[] | undefined): ImageWithSEO[] => {
  if (!images) return [];
  return images.map(img =>
    typeof img === 'string' ? { url: img } : img
  );
};

// Helper to extract URLs from images
export const getImageUrls = (images: (string | ImageWithSEO)[]): string[] => {
  return images.map(img => typeof img === 'string' ? img : img.url);
};

interface ImageUploadProps {
  value?: (string | ImageWithSEO)[] // Support both old and new format
  onChange: (images: ImageWithSEO[]) => void // Always return new format
  onRemove?: (index: number) => void
  label?: string
  placeholder?: string
  folder?: string
  disabled?: boolean
  className?: string
  accept?: string
  maxSize?: number
  maxFiles?: number
  width?: number
  height?: number
  showSEOFields?: boolean // Enable SEO editing
}

export function ImageUpload({
  value = [],
  onChange,
  onRemove,
  label = "Hình ảnh",
  placeholder = "Chọn hình ảnh...",
  disabled = false,
  className = "",
  accept = "image/*",
  maxSize = 5,
  maxFiles = 10,
  showSEOFields = false
}: ImageUploadProps) {
  // Normalize value to ImageWithSEO format
  const normalizedValue = normalizeImages(value);

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

    if (files.length === 0) {
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

          // Upload to server API route
          const fileUrl = await uploadToMCP(file)
          uploadedUrls.push(fileUrl)

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

      // Update parent component with new images (as ImageWithSEO)
      if (uploadedUrls.length > 0) {
        const newImages: ImageWithSEO[] = uploadedUrls.map(url => ({ url }))
        // If maxFiles is 1, replace instead of append
        const result = maxFiles === 1 ? newImages : [...normalizedValue, ...newImages]
        onChange(result)
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
    const newImages = normalizedValue.filter((_, i) => i !== index)
    onChange(newImages)
    if (onRemove) onRemove(index)
  }

  // Update SEO fields for a specific image
  const handleUpdateSEO = (index: number, field: 'alt' | 'title', value: string) => {
    const newImages = [...normalizedValue]
    newImages[index] = { ...newImages[index], [field]: value }
    onChange(newImages)
  }

  const handleClick = () => {
    if (disabled || uploading) {
      return
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor="image-upload">{label}</Label>
      )}

      <Card className="border-2 border-dashed">
        <CardContent className="p-6">
          {/* Display uploaded images */}
          {normalizedValue.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Hình ảnh đã upload ({normalizedValue.length}/{maxFiles})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {normalizedValue.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-24 bg-gray-100 rounded-md border overflow-hidden">
                      <Image
                        src={img.url}
                        alt={img.alt || `Uploaded image ${index + 1}`}
                        title={img.title}
                        width={200}
                        height={96}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(`Failed to load image ${index + 1}:`, img.url)
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
                        onLoad={() => {}}
                      />
                    </div>
                    {!disabled && (
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {showSEOFields && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                title="Chỉnh sửa SEO"
                                className="bg-blue-500 text-white rounded-full p-1 text-xs hover:bg-blue-600"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-3" side="left">
                              <div className="space-y-3">
                                <h4 className="font-medium text-sm">SEO cho hình ảnh</h4>
                                <div className="space-y-2">
                                  <Label htmlFor={`alt-${index}`} className="text-xs">Alt Text</Label>
                                  <Input
                                    id={`alt-${index}`}
                                    value={img.alt || ''}
                                    onChange={(e) => handleUpdateSEO(index, 'alt', e.target.value)}
                                    placeholder="Mô tả hình ảnh"
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`title-${index}`} className="text-xs">Title</Label>
                                  <Input
                                    id={`title-${index}`}
                                    value={img.title || ''}
                                    onChange={(e) => handleUpdateSEO(index, 'title', e.target.value)}
                                    placeholder="Tiêu đề hình ảnh"
                                    className="h-8 text-sm"
                                  />
                                </div>
                                {(img.alt || img.title) && (
                                  <p className="text-xs text-green-600">✓ SEO đã được thiết lập</p>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                        <button
                          type="button"
                          title={`Xóa hình ảnh ${index + 1}`}
                          className="bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                          onClick={() => handleRemove(index)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    {/* Show SEO indicator */}
                    {showSEOFields && (img.alt || img.title) && (
                      <div className="absolute bottom-1 left-1 bg-green-500 text-white rounded px-1 text-[10px]">
                        SEO ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload area */}
          {normalizedValue.length < maxFiles ? (
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
                          Có thể chọn nhiều file cùng lúc (tối đa {maxFiles - normalizedValue.length} file nữa)
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
          {normalizedValue.length < maxFiles && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  if (disabled || uploading) {
                    return
                  }

                  fileInputRef.current?.click()
                }}
                disabled={disabled || uploading}
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Đang upload...' : `Chọn file (${normalizedValue.length}/${maxFiles})`}
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
