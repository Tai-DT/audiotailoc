'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Shield, Wrench, FileText, Lock, ChevronDown, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { apiClient, handleApiResponse, handleApiError } from '@/lib/api';

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
  SHIPPING: Truck,
  WARRANTY: Shield,
  SUPPORT: Wrench,
  terms: FileText,
  privacy: Lock,
};

const policyTitles = {
  SHIPPING: 'Chính sách giao hàng',
  WARRANTY: 'Chính sách bảo hành',
  SUPPORT: 'Hỗ trợ kỹ thuật',
  terms: 'Điều khoản sử dụng',
  privacy: 'Chính sách bảo mật',
};

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/policies');
        const data = handleApiResponse<Policy[]>(response);
        setPolicies(data);
      } catch (err) {
        console.error('Error fetching policies:', err);
        const errorInfo = handleApiError(err as { response?: { data?: { message?: string }; status?: number }; message?: string });
        setError(errorInfo.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

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
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)),transparent_50%)] blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FileText className="h-4 w-4" />
                Chính sách & Điều khoản
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                Chính sách cửa hàng
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Audio Tài Lộc cam kết cung cấp dịch vụ tốt nhất với chính sách rõ ràng,
                minh bạch và bảo vệ quyền lợi khách hàng tối đa.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{policies.length}</div>
                  <div className="text-sm text-muted-foreground">Chính sách</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Hỗ trợ</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-tertiary mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Minh bạch</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Policies List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {policies.map((policy, index) => {
                  const IconComponent = policyIcons[policy.type as keyof typeof policyIcons] || FileText;
                  const isExpanded = expandedPolicy === policy.id;

                  return (
                    <Card
                      key={policy.id}
                      className="hover-audio group cursor-pointer transition-all duration-300 border-border/50 hover:border-primary/30 policy-card animate-fade-in-up"
                      onClick={() => togglePolicy(policy.id)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                                {policyTitles[policy.type as keyof typeof policyTitles] || policy.title}
                              </CardTitle>
                              {policy.summary && (
                                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                                  {policy.summary}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">
                                {policy.viewCount} lượt xem
                              </div>
                              <div className="text-xs text-muted-foreground/70">
                                {new Date(policy.updatedAt).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                            <div className="transition-transform duration-300" style={{
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}>
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="pt-0 animate-in slide-in-from-top-5 duration-300">
                          <div className="border-t border-border/50 pt-6">
                            <div
                              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90"
                              dangerouslySetInnerHTML={{ __html: policy.contentHtml }}
                            />
                            <div className="mt-8 flex items-center justify-between pt-6 border-t border-border/50">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Cập nhật: {new Date(policy.updatedAt).toLocaleDateString('vi-VN')}
                                </div>
                              </div>
                              <Link
                                href={`/policies/${policy.slug}`}
                                className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors duration-200 font-medium group/link"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Xem chi tiết đầy đủ
                                <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-200" />
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

        {/* Quick Actions */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Cần hỗ trợ thêm?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Nếu bạn có bất kỳ câu hỏi nào về các chính sách trên hoặc cần hỗ trợ thêm,
              đừng ngần ngại liên hệ với chúng tôi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  <Wrench className="mr-2 h-4 w-4" />
                  Liên hệ hỗ trợ
                </Button>
              </Link>
              <Link href="/knowledge-base">
                <Button variant="outline" size="lg">
                  <FileText className="mr-2 h-4 w-4" />
                  Cơ sở kiến thức
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
