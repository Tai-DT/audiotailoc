'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ContentGenerationForm {
  prompt: string;
  type: 'product_description' | 'email_template' | 'marketing_copy' | 'faq' | 'blog_post';
  tone: 'professional' | 'casual' | 'friendly' | 'formal';
  maxLength: number;
}

interface GeneratedContent {
  content: string;
  metadata: {
    type: string;
    tone: string;
    length: number;
    generatedAt: string;
  };
}

export default function AIContentGenerator() {
  const [form, setForm] = useState<ContentGenerationForm>({
    prompt: '',
    type: 'product_description',
    tone: 'professional',
    maxLength: 200
  });
  
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const contentTypes = [
    { value: 'product_description', label: 'Mô tả sản phẩm', icon: '📦' },
    { value: 'email_template', label: 'Template Email', icon: '📧' },
    { value: 'marketing_copy', label: 'Nội dung Marketing', icon: '📢' },
    { value: 'faq', label: 'Câu hỏi thường gặp', icon: '❓' },
    { value: 'blog_post', label: 'Bài viết Blog', icon: '📝' }
  ];

  const tones = [
    { value: 'professional', label: 'Chuyên nghiệp' },
    { value: 'casual', label: 'Thân thiện' },
    { value: 'friendly', label: 'Thân thiện' },
    { value: 'formal', label: 'Trang trọng' }
  ];

  const generateContent = async () => {
    if (!form.prompt.trim()) {
      toast.error('Vui lòng nhập nội dung cần tạo');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/v1/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Không thể tạo nội dung');
      }

      const data = await response.json();
      setGeneratedContent(data.data);
      toast.success('Tạo nội dung thành công!');
    } catch (error) {
      console.error('Content generation error:', error);
      toast.error('Có lỗi xảy ra khi tạo nội dung');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedContent) {
      try {
        await navigator.clipboard.writeText(generatedContent.content);
        setCopied(true);
        toast.success('Đã sao chép vào clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('Không thể sao chép');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="text-blue-500" />
          AI Content Generator
        </h1>
        <p className="text-muted-foreground">
          Tạo nội dung tự động cho Audio Tài Lộc với AI
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tạo nội dung mới</CardTitle>
          <CardDescription>
            Nhập mô tả và chọn loại nội dung bạn muốn tạo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mô tả / Yêu cầu</label>
            <Textarea
              placeholder="Ví dụ: Tạo mô tả cho tai nghe bluetooth chống ồn cao cấp..."
              value={form.prompt}
              onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Loại nội dung</label>
              <Select value={form.type} onValueChange={(value: any) => setForm({ ...form, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        {type.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Giọng điệu</label>
              <Select value={form.tone} onValueChange={(value: any) => setForm({ ...form, tone: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Độ dài tối đa</label>
              <Select 
                value={form.maxLength.toString()} 
                onValueChange={(value) => setForm({ ...form, maxLength: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 ký tự</SelectItem>
                  <SelectItem value="200">200 ký tự</SelectItem>
                  <SelectItem value="500">500 ký tự</SelectItem>
                  <SelectItem value="1000">1000 ký tự</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateContent} 
            disabled={isGenerating || !form.prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo nội dung...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Tạo nội dung với AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Nội dung đã tạo</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {contentTypes.find(t => t.value === generatedContent.metadata.type)?.label}
                </Badge>
                <Badge variant="outline">
                  {tones.find(t => t.value === generatedContent.metadata.tone)?.label}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="ml-2"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Sao chép
                    </>
                  )}
                </Button>
              </div>
            </div>
            <CardDescription>
              Được tạo lúc {new Date(generatedContent.metadata.generatedAt).toLocaleString('vi-VN')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{generatedContent.content}</p>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Độ dài: {generatedContent.metadata.length} ký tự
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
