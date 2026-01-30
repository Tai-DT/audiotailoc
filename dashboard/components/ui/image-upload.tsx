"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { ImageIcon, Upload, X, Loader2, Edit2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { resolveBackendImageUrl } from "@/lib/utils/image-url"

export interface ImageWithSEO {
  url: string;
  alt?: string;
  title?: string;
}

interface ImageUploadProps {
  value: (string | ImageWithSEO)[];
  onChange: (value: ImageWithSEO[]) => void;
  onRemove: (index: number) => void;
  label?: string;
  placeholder?: string;
  folder?: string;
  maxFiles?: number;
  showSEOFields?: boolean;
}

// Helpers for backward compatibility and internal logic
export const normalizeImages = (images: (string | ImageWithSEO)[]): ImageWithSEO[] => {
  if (!Array.isArray(images)) return [];
  return images.map(img => {
    if (typeof img === 'string') return { url: img };
    return img;
  });
};

export const getImageUrls = (images: (string | ImageWithSEO)[]): string[] => {
  if (!Array.isArray(images)) return [];
  return images.map(img => typeof img === 'string' ? img : img.url);
};

export function ImageUpload({
  value = [],
  onChange,
  onRemove,
  label = "Hình ảnh",
  placeholder = "Tải ảnh lên Cloud",
  folder = "general",
  maxFiles = 10,
  showSEOFields = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const normalizedValue = normalizeImages(value);

  console.log('ImageUpload current value:', normalizedValue);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (normalizedValue.length + files.length > maxFiles) {
      toast.error(`Chỉ được tải lên tối đa ${maxFiles} ảnh`);
      return;
    }

    setIsUploading(true)
    try {
      const uploadPromises: Array<Promise<ImageWithSEO>> = Array.from(files).map(
        async (file): Promise<ImageWithSEO> => {
        try {
          const response = await apiClient.uploadImage(file);
          const imageUrl = response.data?.url || (response as { url?: string }).url;
          return { url: imageUrl, alt: '', title: '' };
        } catch (error) {
          setUploadErrors(prev => ({
            ...prev,
            [file.name]: error instanceof Error ? error.message : 'Upload failed'
          }))
          throw error
        }
      })

      const settled = await Promise.allSettled(uploadPromises)
      const newImages = settled
        .filter((result): result is PromiseFulfilledResult<ImageWithSEO> => result.status === 'fulfilled')
        .map(result => result.value)
      if (newImages.length > 0) {
        onChange([...normalizedValue, ...newImages])
        toast.success("Đã tải ảnh lên thành công")
      }
      if (newImages.length === 0) {
        toast.error("Không thể tải ảnh lên Cloud")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error instanceof Error ? error.message : "Lỗi khi tải ảnh lên Cloud")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const updateSEO = (index: number, field: 'alt' | 'title', newVal: string) => {
    const updated = [...normalizedValue];
    updated[index] = { ...updated[index], [field]: newVal };
    onChange(updated);
  }

  return (
    <div className="space-y-4 w-full">
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {normalizedValue.map((img, index) => (
          <div key={img.url + index} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
            {img.url ? (
              <img
                src={resolveBackendImageUrl(img.url)}
                alt={img.alt || "Image"}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  console.error('Image failed to load:', img.url);
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400?text=Error+Loading+Image';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}

            <div className="absolute top-2 right-2 flex gap-1 transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
              {showSEOFields && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="secondary" size="icon" className="h-7 w-7 shadow-sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">SEO Info</h4>
                      <div className="space-y-1">
                        <Label className="text-xs">Alt Text</Label>
                        <Input
                          value={img.alt || ''}
                          onChange={(e) => updateSEO(index, 'alt', e.target.value)}
                          placeholder="Mô tả ảnh cho SEO..."
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Title Tag</Label>
                        <Input
                          value={img.title || ''}
                          onChange={(e) => updateSEO(index, 'title', e.target.value)}
                          placeholder="Tiêu đề ảnh..."
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              <Button
                type="button"
                onClick={() => onRemove(index)}
                variant="destructive"
                size="icon"
                className="h-7 w-7 shadow-sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {(img.alt || img.title) && (
              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] p-1 truncate">
                {img.alt || img.title}
              </div>
            )}
          </div>
        ))}

        {normalizedValue.length < maxFiles && (
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`
              aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer
              transition-colors hover:bg-accent/50 hover:border-primary/50
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-muted-foreground px-2 text-center">
                  {placeholder}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {Object.keys(uploadErrors).length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {Object.entries(uploadErrors).map(([filename, message]) => (
            <div key={filename}>{filename}: {message}</div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={onUpload}
        disabled={isUploading}
      />
    </div>
  )
}
