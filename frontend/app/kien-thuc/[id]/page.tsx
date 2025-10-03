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

  if (isLoading) return <div className="p-8">Đang tải bài viết...</div>;
  if (error) return <div className="p-8 text-red-600">Lỗi tải dữ liệu: {error instanceof Error ? error.message : 'Không xác định'}</div>;
  if (!data) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 prose dark:prose-invert">
      <a href="/kien-thuc" className="no-underline text-sm text-blue-600 hover:underline">← Quay lại</a>
      <h1>{data.title}</h1>
      <p className="text-xs text-slate-500">Chuyên mục: {data.category} • Lượt xem: {data.viewCount}</p>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
      {data.tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {data.tags.map(tag => (
            <span key={tag} className="text-xs bg-slate-100 px-2 py-0.5 rounded">{tag}</span>
          ))}
        </div>
      ) : null}

      <hr className="my-8" />
      
      <div className="not-prose">
        <h3 className="text-lg font-semibold mb-3">Bài viết này có hữu ích không?</h3>
        {feedbackSent ? (
          <p className="text-green-600">Cảm ơn bạn đã phản hồi!</p>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => handleFeedback(true)}
              disabled={feedbackLoading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              👍 Hữu ích
            </button>
            <button
              onClick={() => handleFeedback(false)}
              disabled={feedbackLoading}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 disabled:opacity-50"
            >
              👎 Không hữu ích
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
