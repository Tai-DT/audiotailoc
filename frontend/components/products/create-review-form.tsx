'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateReview } from '@/lib/hooks/use-api';
import { toast } from 'react-hot-toast';

const createReviewSchema = z.object({
  rating: z.number().min(1, 'Vui lòng chọn số sao').max(5, 'Số sao không hợp lệ'),
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự').max(100, 'Tiêu đề không được quá 100 ký tự'),
  comment: z.string().min(10, 'Nội dung đánh giá phải có ít nhất 10 ký tự').max(1000, 'Nội dung đánh giá không được quá 1000 ký tự'),
});

type CreateReviewFormData = z.infer<typeof createReviewSchema>;

interface CreateReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateReviewForm({ productId, onSuccess, onCancel }: CreateReviewFormProps) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const createReviewMutation = useCreateReview();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateReviewFormData>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: 0,
      title: '',
      comment: '',
    },
  });

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = images.length + newFiles.length;

    if (totalFiles > 5) {
      toast.error('Chỉ được tải lên tối đa 5 hình ảnh');
      return;
    }

    // Validate file types and sizes
    const validFiles = newFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} không phải là file hình ảnh`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error(`${file.name} có kích thước quá lớn (tối đa 5MB)`);
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreviews(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateReviewFormData) => {
    try {
      // Upload images first if any
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const uploadPromises = images.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload/review', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to upload image');
          }

          const result = await response.json();
          return result.url;
        });

        try {
          imageUrls = await Promise.all(uploadPromises);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast.error('Không thể tải lên hình ảnh. Vui lòng thử lại.');
          return;
        }
      }

      await createReviewMutation.mutateAsync({
        productId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        images: imageUrls,
      });

      toast.success('Cảm ơn bạn đã đánh giá sản phẩm!');
      reset();
      setSelectedRating(0);
      setImages([]);
      setImagePreviews([]);
      onSuccess?.();
    } catch (error) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 400) {
        toast.error('Bạn đã đánh giá sản phẩm này rồi');
      } else if (err.response?.status === 401) {
        toast.error('Vui lòng đăng nhập để đánh giá sản phẩm');
      } else {
        toast.error('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Viết đánh giá của bạn</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-base font-medium">Đánh giá *</Label>
            <div className="flex items-center space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${star <= selectedRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-muted-foreground/60 hover:text-yellow-400'
                      } transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {selectedRating > 0 && `${selectedRating} sao`}
              </span>
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive mt-1">{errors.rating.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Tiêu đề đánh giá *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Tóm tắt đánh giá của bạn..."
              className="mt-1"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">Nội dung đánh giá *</Label>
            <Textarea
              id="comment"
              {...register('comment')}
              placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này..."
              rows={4}
              className="mt-1"
            />
            {errors.comment && (
              <p className="text-sm text-destructive mt-1">{errors.comment.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <Label>Hình ảnh (tùy chọn)</Label>
            <div className="mt-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-border transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nhấp để tải lên hình ảnh (tối đa 5 ảnh, mỗi ảnh ≤ 5MB)
                  </p>
                </div>
              </Label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || createReviewMutation.isPending}
              className="flex-1"
            >
              {isSubmitting || createReviewMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting || createReviewMutation.isPending}
              >
                Hủy
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}