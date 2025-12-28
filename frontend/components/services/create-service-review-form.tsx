'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateServiceReview } from '@/lib/hooks/use-api';
import { toast } from 'react-hot-toast';

const createServiceReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự').max(200, 'Tiêu đề không được quá 200 ký tự'),
  comment: z.string().min(10, 'Nội dung đánh giá phải có ít nhất 10 ký tự').max(1000, 'Nội dung không được quá 1000 ký tự'),
});

type CreateServiceReviewFormData = z.infer<typeof createServiceReviewSchema>;

interface CreateServiceReviewFormProps {
  serviceId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateServiceReviewForm({
  serviceId,
  onSuccess,
  onCancel
}: CreateServiceReviewFormProps) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const createReviewMutation = useCreateServiceReview();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateServiceReviewFormData>({
    resolver: zodResolver(createServiceReviewSchema),
    defaultValues: {
      rating: 0,
      title: '',
      comment: '',
    },
  });

  const watchedRating = watch('rating');

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // In a real implementation, you would upload these to a cloud storage
    // For now, we'll just create object URLs
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateServiceReviewFormData) => {
    try {
      await createReviewMutation.mutateAsync({
        serviceId: serviceId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        images: images.length > 0 ? images : undefined,
      });

      toast.success('Đánh giá của bạn đã được gửi thành công!');
      onSuccess();
    } catch {
      toast.error('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Viết đánh giá dịch vụ</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Đánh giá của bạn *</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || selectedRating || watchedRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-muted-foreground/60'
                    } transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {selectedRating > 0 && `${selectedRating} sao`}
              </span>
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề đánh giá *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Tóm tắt trải nghiệm của bạn"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Nội dung đánh giá *</Label>
            <Textarea
              id="comment"
              {...register('comment')}
              placeholder="Chia sẻ chi tiết trải nghiệm của bạn với dịch vụ này..."
              rows={4}
            />
            {errors.comment && (
              <p className="text-sm text-destructive">{errors.comment.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Hình ảnh (tùy chọn)</Label>
            <div className="flex items-center gap-4">
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-md hover:border-border transition-colors">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Thêm hình ảnh</span>
                </div>
              </Label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image}
                      alt={`Preview ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover rounded-md border"
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

            <p className="text-xs text-muted-foreground">
              Tối đa 5 hình ảnh. Dung lượng tối đa 5MB mỗi ảnh.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={createReviewMutation.isPending}
              className="flex-1"
            >
              {createReviewMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={createReviewMutation.isPending}
            >
              Hủy
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}