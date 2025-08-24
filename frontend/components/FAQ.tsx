"use client"

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FAQProps {
  category?: string;
  showCategories?: boolean;
  limit?: number;
}

export default function FAQ({ category, showCategories = true, limit }: FAQProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [categories, setCategories] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const loadFAQs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);

      const response = await fetch(`/api/support/faq?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        let faqList = data || [];

        if (limit) {
          faqList = faqList.slice(0, limit);
        }

        setFaqs(faqList);

        // Extract unique categories
        const uniqueCategories = [...new Set((faqList as FAQItem[]).map((faq) => String(faq.category)))] as string[];
        setCategories(uniqueCategories as string[]);
      }
    } catch (error) {
      console.error('Failed to load FAQs:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, limit]);

  useEffect(() => {
    loadFAQs();
  }, [loadFAQs]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const groupedFAQs = faqs.reduce((groups, faq) => {
    const category = faq.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(faq);
    return groups;
  }, {} as Record<string, FAQItem[]>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Câu hỏi thường gặp</h2>
        <p className="text-gray-600">Tìm câu trả lời nhanh chóng cho các câu hỏi phổ biến</p>
      </div>

      {/* Category Filter */}
      {showCategories && categories.length > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
              >
                Tất cả
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Content */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      ) : Object.keys(groupedFAQs).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedFAQs).map(([categoryName, categoryFAQs]) => (
            <div key={categoryName}>
              {!selectedCategory && showCategories && (
                <h3 className="text-lg font-semibold mb-4 text-blue-600">
                  {categoryName}
                </h3>
              )}
              
              <div className="space-y-3">
                {categoryFAQs
                  .sort((a, b) => a.order - b.order)
                  .map((faq) => (
                    <Card key={faq.id} className="overflow-hidden">
                      <CardHeader 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleExpanded(faq.id)}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium pr-4">
                            {faq.question}
                          </CardTitle>
                          <div className="flex-shrink-0">
                            {expandedItems.has(faq.id) ? (
                              <span className="text-blue-600">−</span>
                            ) : (
                              <span className="text-blue-600">+</span>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      {expandedItems.has(faq.id) && (
                        <CardContent className="pt-0">
                          <div className="prose prose-sm max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">❓</div>
              <h3 className="text-lg font-semibold mb-2">Chưa có câu hỏi nào</h3>
              <p className="text-gray-600">
                {selectedCategory 
                  ? `Không có câu hỏi nào trong danh mục "${selectedCategory}"`
                  : 'Chưa có câu hỏi thường gặp nào được thêm'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy câu trả lời?</h3>
            <p className="text-gray-600 mb-4">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <a href="/support/contact">Liên hệ hỗ trợ</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/support/knowledge-base">Xem tài liệu hướng dẫn</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
