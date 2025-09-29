'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Shield, RotateCcw, Wrench, FileText, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Policy {
  id: string;
  slug: string;
  title: string;
  contentHtml: string;
  summary?: string;
  type: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

const policyIcons = {
  shipping: Truck,
  warranty: Shield,
  return: RotateCcw,
  technical_support: Wrench,
  terms: FileText,
  privacy: Lock,
};

const policyTitles = {
  shipping: 'Chính sách giao hàng',
  warranty: 'Chính sách bảo hành',
  return: 'Chính sách đổi trả',
  technical_support: 'Hỗ trợ kỹ thuật',
  terms: 'Điều khoản sử dụng',
  privacy: 'Chính sách bảo mật',
};

export default function PoliciesPage() {
  // Mock data for testing
  const [policies] = useState<Policy[]>([
    {
      id: '1',
      slug: 'chinh-sach-giao-hang',
      title: 'Chính sách giao hàng',
      contentHtml: '<h2>Chính sách giao hàng</h2><p>Nội dung chính sách giao hàng...</p>',
      summary: 'Chính sách giao hàng toàn quốc',
      type: 'shipping',
      isPublished: true,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      slug: 'chinh-sach-bao-hanh',
      title: 'Chính sách bảo hành',
      contentHtml: '<h2>Chính sách bảo hành</h2><p>Nội dung chính sách bảo hành...</p>',
      summary: 'Bảo hành 12-24 tháng',
      type: 'warranty',
      isPublished: true,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);

  const togglePolicy = (policyId: string) => {
    setExpandedPolicy(expandedPolicy === policyId ? null : policyId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải chính sách...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không thể tải chính sách: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Chính sách & Điều khoản
              </h1>
              <p className="text-xl text-muted-foreground">
                Audio Tài Lộc cam kết cung cấp dịch vụ tốt nhất với chính sách rõ ràng,
                minh bạch và bảo vệ quyền lợi khách hàng tối đa.
              </p>
            </div>
          </div>
        </section>

        {/* Policies List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {policies.map((policy) => {
                  const IconComponent = policyIcons[policy.type as keyof typeof policyIcons] || FileText;
                  const isExpanded = expandedPolicy === policy.id;

                  return (
                    <Card key={policy.id} className="hover:shadow-lg transition-all duration-300">
                      <CardHeader
                        className="cursor-pointer"
                        onClick={() => togglePolicy(policy.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">
                                {policyTitles[policy.type as keyof typeof policyTitles] || policy.title}
                              </CardTitle>
                              {policy.summary && (
                                <p className="text-muted-foreground mt-1">{policy.summary}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {policy.viewCount} lượt xem
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="pt-0">
                          <div className="border-t pt-6">
                            <div
                              className="prose prose-sm max-w-none dark:prose-invert"
                              dangerouslySetInnerHTML={{ __html: policy.contentHtml }}
                            />
                            <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                              <span>Cập nhật lần cuối: {new Date(policy.updatedAt).toLocaleDateString('vi-VN')}</span>
                              <Link
                                href={`/policies/${policy.slug}`}
                                className="text-primary hover:underline"
                              >
                                Xem chi tiết →
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>

              {policies.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Chưa có chính sách nào được đăng tải.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
