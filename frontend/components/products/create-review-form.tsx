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
 <Card className="overflow-hidden border-none shadow-2xl">
 <CardHeader className="bg-primary/5 pb-8">
 <div className="section-badge mb-2">Đóng góp</div>
 <CardTitle className="text-2xl font-black font-display uppercase tracking-tight">
 Viết <span className="text-primary">Đánh giá</span> của bạn
 </CardTitle>
 </CardHeader>
 <CardContent className="p-8">
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
 {/* Rating */}
 <div className="space-y-3">
 <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Chất lượng sản phẩm *</Label>
 <div className="flex items-center gap-2 p-4 rounded-2xl bg-muted/30 border border-border/40 w-fit">
 {[1, 2, 3, 4, 5].map((star) => (
 <button
 key={star}
 type="button"
 onClick={() => handleRatingClick(star)}
 className="focus:outline-none group/star"
 >
 <Star
 className={`h-8 w-8 transition-all duration-300 ${star <= selectedRating
 ? 'text-accent fill-accent scale-110 drop-shadow-[0_0_10px_rgba(180,140,50,0.5)]'
 : 'text-muted-foreground/30 hover:text-accent/60 group-hover/star:scale-110'
 }`}
 />
 </button>
 ))}
 <div className="ml-4 px-3 py-1 bg-accent/10 rounded-full">
 <span className="text-[10px] font-black uppercase tracking-widest text-accent">
 {selectedRating > 0 ? `${selectedRating} sao` : 'Chọn mức độ'}
 </span>
 </div>
 </div>
 {errors.rating && (
 <p className="text-xs text-destructive font-bold uppercase tracking-widest mt-1">{errors.rating.message}</p>
 )}
 </div>

 <div className="grid md:grid-cols-2 gap-6">
 {/* Title */}
 <div className="space-y-3">
 <Label htmlFor="title" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Tiêu đề đánh giá *</Label>
 <Input
 id="title"
 {...register('title')}
 placeholder="Ví dụ: Rất hài lòng, Âm thanh tuyệt vời..."
 className="rounded-2xl border-border/60 focus:border-primary/40 h-12"
 />
 {errors.title && (
 <p className="text-xs text-destructive font-bold uppercase tracking-widest mt-1">{errors.title.message}</p>
 )}
 </div>

 {/* Image Upload */}
 <div className="space-y-3">
 <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Hình ảnh thực tế (tối đa 5)</Label>
 <div className="flex items-center gap-4">
 <input
 type="file"
 multiple
 accept="image/*"
 onChange={handleImageUpload}
 className="hidden"
 id="image-upload"
 />
 <Button
 asChild
 variant="outline"
 className="w-full h-12 rounded-2xl border-dashed border-2 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
 >
 <Label htmlFor="image-upload" className="cursor-pointer flex items-center justify-center gap-2">
 <Upload className="h-4 w-4 text-primary" />
 <span className="text-[10px] font-black uppercase tracking-widest">Tải lên hình ảnh</span>
 </Label>
 </Button>
 </div>
 </div>
 </div>

 {/* Comment */}
 <div className="space-y-3">
 <Label htmlFor="comment" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Nội dung chi tiết *</Label>
 <Textarea
 id="comment"
 {...register('comment')}
 placeholder="Chia sẻ trải nghiệm của bạn về chất lượng âm thanh, dịch vụ..."
 rows={5}
 className="rounded-2xl border-border/60 focus:border-primary/40 p-4"
 />
 {errors.comment && (
 <p className="text-xs text-destructive font-bold uppercase tracking-widest mt-1">{errors.comment.message}</p>
 )}
 </div>

 {/* Image Previews */}
 {imagePreviews.length > 0 && (
 <div className="flex flex-wrap gap-4 p-4 rounded-3xl bg-muted/20 border border-border/40">
 {imagePreviews.map((preview, index) => (
 <div key={index} className="relative group/preview h-24 w-24 rounded-2xl overflow-hidden border border-border/40 hover:border-primary/40 transition-all">
 <Image
 src={preview}
 alt={`Preview ${index + 1}`}
 fill
 className="object-cover transition-transform group-hover/preview:scale-110"
 />
 <button
 type="button"
 onClick={() => removeImage(index)}
 className="absolute top-1 right-1 bg-destructive/90 text-foreground dark:text-white rounded-full p-1 opacity-0 group-hover/preview:opacity-100 transition-all hover:scale-110"
 >
 <X className="h-3 w-3" />
 </button>
 </div>
 ))}
 </div>
 )}

 {/* Submit Buttons */}
 <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/40">
 <Button
 type="submit"
 disabled={isSubmitting || createReviewMutation.isPending}
 variant="premium"
 size="lg"
 className="flex-1"
 >
 {isSubmitting || createReviewMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá chuyên nghiệp'}
 </Button>
 {onCancel && (
 <Button
 type="button"
 variant="outline"
 size="lg"
 onClick={onCancel}
 disabled={isSubmitting || createReviewMutation.isPending}
 className="px-12"
 >
 Trở lại
 </Button>
 )}
 </div>
 </form>
 </CardContent>
 </Card>
 );
}