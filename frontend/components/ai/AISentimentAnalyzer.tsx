'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Heart, HeartOff, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface SentimentAnalysisForm {
  text: string;
  context: string;
}

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: string[];
  score: number;
  text: string;
}

export default function AISentimentAnalyzer() {
  const [form, setForm] = useState<SentimentAnalysisForm>({
    text: '',
    context: 'customer_feedback'
  });
  
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const contexts = [
    { value: 'customer_feedback', label: 'Phản hồi khách hàng' },
    { value: 'product_review', label: 'Đánh giá sản phẩm' },
    { value: 'support_ticket', label: 'Ticket hỗ trợ' },
    { value: 'social_media', label: 'Mạng xã hội' },
    { value: 'general', label: 'Chung' }
  ];

  const analyzeSentiment = async () => {
    if (!form.text.trim()) {
      toast.error('Vui lòng nhập văn bản cần phân tích');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/v1/ai/analyze-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Không thể phân tích cảm xúc');
      }

      const data = await response.json();
      setResult(data.data);
      toast.success('Phân tích cảm xúc thành công!');
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      toast.error('Có lỗi xảy ra khi phân tích cảm xúc');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Heart className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <HeartOff className="h-5 w-5 text-red-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'Tích cực';
      case 'negative':
        return 'Tiêu cực';
      default:
        return 'Trung tính';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Heart className="text-red-500" />
          AI Sentiment Analyzer
        </h1>
        <p className="text-muted-foreground">
          Phân tích cảm xúc từ feedback khách hàng với AI
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phân tích cảm xúc</CardTitle>
          <CardDescription>
            Nhập văn bản để phân tích cảm xúc và đánh giá mức độ hài lòng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Văn bản cần phân tích</label>
            <Textarea
              placeholder="Ví dụ: Sản phẩm rất tốt! Tôi rất hài lòng với chất lượng âm thanh và dịch vụ khách hàng..."
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ngữ cảnh</label>
            <select
              value={form.context}
              onChange={(e) => setForm({ ...form, context: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {contexts.map((context) => (
                <option key={context.value} value={context.value}>
                  {context.label}
                </option>
              ))}
            </select>
          </div>

          <Button 
            onClick={analyzeSentiment} 
            disabled={isAnalyzing || !form.text.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang phân tích...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Phân tích cảm xúc
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả phân tích</CardTitle>
            <CardDescription>
              Chi tiết về cảm xúc và đánh giá của khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sentiment Overview */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                {getSentimentIcon(result.sentiment)}
                <div>
                  <h3 className="font-semibold">Cảm xúc chính</h3>
                  <p className="text-sm text-muted-foreground">
                    {getSentimentLabel(result.sentiment)}
                  </p>
                </div>
              </div>
              <Badge className={getSentimentColor(result.sentiment)}>
                {(result.confidence * 100).toFixed(1)}% tin cậy
              </Badge>
            </div>

            {/* Confidence Score */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Độ tin cậy</span>
                <span>{(result.confidence * 100).toFixed(1)}%</span>
              </div>
              <Progress value={result.confidence * 100} className="h-2" />
            </div>

            {/* Sentiment Score */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Điểm cảm xúc</span>
                <span>{(result.score * 100).toFixed(1)}%</span>
              </div>
              <Progress 
                value={result.score * 100} 
                className="h-2"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tiêu cực</span>
                <span>Trung tính</span>
                <span>Tích cực</span>
              </div>
            </div>

            {/* Emotions */}
            {result.emotions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Cảm xúc được phát hiện</h4>
                <div className="flex flex-wrap gap-2">
                  {result.emotions.map((emotion, index) => (
                    <Badge key={index} variant="secondary">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Original Text */}
            <div className="space-y-2">
              <h4 className="font-medium">Văn bản gốc</h4>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">{result.text}</p>
              </div>
            </div>

            {/* Insights */}
            <div className="space-y-2">
              <h4 className="font-medium">Insights</h4>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                {result.sentiment === 'positive' && (
                  <div className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">
                      Khách hàng có cảm xúc tích cực. Đây là dấu hiệu tốt cho dịch vụ của bạn!
                    </span>
                  </div>
                )}
                {result.sentiment === 'negative' && (
                  <div className="flex items-center gap-2 text-red-700">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm">
                      Khách hàng có cảm xúc tiêu cực. Cần xem xét và cải thiện dịch vụ.
                    </span>
                  </div>
                )}
                {result.sentiment === 'neutral' && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm">
                      Khách hàng có cảm xúc trung tính. Có thể cần tương tác thêm để hiểu rõ hơn.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
