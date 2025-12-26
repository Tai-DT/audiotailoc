'use client';

import React from 'react';
import { usePolicy } from '@/lib/hooks/use-policies';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

export default function WarrantyPage() {
  const { data: policy, isLoading, error } = usePolicy('warranty');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-10">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-3/4 mb-8" />
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-48 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-6">Chính sách bảo hành</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <p>Không thể tải nội dung. Vui lòng thử lại sau.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">{policy.title}</h1>
        <div
          className="prose prose-gray dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: policy.content }}
        />
        <p className="text-sm text-muted-foreground mt-8">
          Cập nhật lần cuối: {new Date(policy.updatedAt).toLocaleDateString('vi-VN')}
        </p>
      </main>
    </div>
  );
}