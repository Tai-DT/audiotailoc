"use client";
import React, { useState } from 'react';
import { useArticle } from '@/lib/hooks/use-api';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default function ArticleDetailPage({ params }: Props) {
  const { id } = params;
  const { data, isLoading, error } = useArticle(id);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleFeedback = async (helpful: boolean) => {
    setFeedbackLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
      const res = await fetch(`${apiUrl}/support/kb/articles/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful }),
      });
      if (res.ok) {
        setFeedbackSent(true);
      }
    } catch (err) {
      console.error('Feedback error:', err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-foreground">Đang tải bài viết...</div>;
  if (error) return <div className="p-8 text-destructive">Lỗi tải dữ liệu: {error instanceof Error ? error.message : 'Không xác định'}</div>;
  if (!data) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 prose dark:prose-invert">
      <a href="/knowledge" className="no-underline text-sm text-primary hover:text-accent transition-colors">← Quay lại</a>
      <h1>{data.title}</h1>
      <p className="text-xs text-muted-foreground">Chuyên mục: {data.category} • Lượt xem: {data.viewCount}</p>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
      {data.tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {data.tags.map(tag => (
            <span key={tag} className="text-xs bg-secondary/60 text-secondary-foreground px-3 py-1 rounded-full border border-secondary">{tag}</span>
          ))}
        </div>
      ) : null}

      <hr className="my-8" />
      
      <div className="not-prose">
        <h3 className="text-lg font-semibold mb-3 text-foreground">Bài viết này có hữu ích không?</h3>
        {feedbackSent ? (
          <p className="text-success font-medium">Cảm ơn bạn đã phản hồi!</p>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => handleFeedback(true)}
              disabled={feedbackLoading}
              className="px-4 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90 disabled:opacity-50 transition-all font-medium"
            >
              👍 Hữu ích
            </button>
            <button
              onClick={() => handleFeedback(false)}
              disabled={feedbackLoading}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 transition-all font-medium"
            >
              👎 Không hữu ích
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
