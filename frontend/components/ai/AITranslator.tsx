'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Languages, Copy, Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface TranslationForm {
  text: string;
  targetLanguage: string;
  sourceLanguage: string;
}

interface TranslationResult {
  original: string;
  translation: string;
  sourceLanguage: string;
  targetLanguage: string;
  length: number;
}

export default function AITranslator() {
  const [form, setForm] = useState<TranslationForm>({
    text: '',
    targetLanguage: 'vi',
    sourceLanguage: 'auto'
  });
  
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' }
  ];

  const translate = async () => {
    if (!form.text.trim()) {
      toast.error('Vui lòng nhập văn bản cần dịch');
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch('/api/v1/ai/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Không thể dịch văn bản');
      }

      const data = await response.json();
      setResult(data.data);
      toast.success('Dịch thuật thành công!');
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Có lỗi xảy ra khi dịch thuật');
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Đã sao chép vào clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Không thể sao chép');
    }
  };

  const swapLanguages = () => {
    setForm({
      ...form,
      sourceLanguage: form.targetLanguage,
      targetLanguage: form.sourceLanguage
    });
  };

  const getLanguageName = (code: string) => {
    return languages.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return languages.find(lang => lang.code === code)?.flag || '🌐';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Languages className="text-blue-500" />
          AI Translator
        </h1>
        <p className="text-muted-foreground">
          Dịch thuật đa ngôn ngữ thông minh cho Audio Tài Lộc
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dịch thuật</CardTitle>
          <CardDescription>
            Dịch văn bản giữa các ngôn ngữ khác nhau với độ chính xác cao
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Language Selection */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Ngôn ngữ nguồn</label>
              <Select 
                value={form.sourceLanguage} 
                onValueChange={(value) => setForm({ ...form, sourceLanguage: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">🌐 Tự động phát hiện</SelectItem>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        {lang.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={swapLanguages}
              className="mt-6"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Ngôn ngữ đích</label>
              <Select 
                value={form.targetLanguage} 
                onValueChange={(value) => setForm({ ...form, targetLanguage: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        {lang.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Văn bản cần dịch</label>
            <Textarea
              placeholder="Nhập văn bản cần dịch..."
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              rows={4}
            />
          </div>

          <Button 
            onClick={translate} 
            disabled={isTranslating || !form.text.trim()}
            className="w-full"
          >
            {isTranslating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang dịch...
              </>
            ) : (
              <>
                <Languages className="mr-2 h-4 w-4" />
                Dịch thuật
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả dịch thuật</CardTitle>
            <CardDescription>
              Từ {getLanguageName(result.sourceLanguage)} sang {getLanguageName(result.targetLanguage)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Original Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <span>{getLanguageFlag(result.sourceLanguage)}</span>
                  Văn bản gốc ({getLanguageName(result.sourceLanguage)})
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result.original)}
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
              <div className="bg-muted p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{result.original}</p>
              </div>
            </div>

            {/* Translation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <span>{getLanguageFlag(result.targetLanguage)}</span>
                  Bản dịch ({getLanguageName(result.targetLanguage)})
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result.translation)}
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
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <p className="whitespace-pre-wrap font-medium">{result.translation}</p>
              </div>
            </div>

            {/* Translation Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Độ dài: {result.length} ký tự</span>
              <Badge variant="secondary">
                AI Translation
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Translation Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Dịch nhanh</CardTitle>
          <CardDescription>
            Các câu thường dùng trong Audio Tài Lộc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                text: 'Chào bạn! Tôi cần tư vấn về tai nghe bluetooth',
                target: 'en',
                label: 'Chào hỏi khách hàng'
              },
              {
                text: 'Sản phẩm này có bảo hành bao lâu?',
                target: 'en',
                label: 'Hỏi bảo hành'
              },
              {
                text: 'Cảm ơn bạn đã mua sản phẩm của chúng tôi!',
                target: 'en',
                label: 'Cảm ơn khách hàng'
              },
              {
                text: 'Bạn có thể giao hàng trong bao lâu?',
                target: 'en',
                label: 'Hỏi thời gian giao hàng'
              }
            ].map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left"
                onClick={() => {
                  setForm({
                    text: example.text,
                    targetLanguage: example.target,
                    sourceLanguage: 'vi'
                  });
                }}
              >
                <div>
                  <div className="font-medium text-sm">{example.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {example.text}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
