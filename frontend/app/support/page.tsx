'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Send,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { apiClient, handleApiResponse } from '@/lib/api';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  status: string;
  publishedAt: string;
  viewCount: number;
  likeCount?: number;
  commentCount?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  featured?: boolean;
  blog_categories?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  users?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function SupportPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 'blog-1',
      title: 'Hướng dẫn chọn loa kéo cho gia đình',
      slug: 'huong-dan-chon-loa-keo-cho-gia-dinh',
      content: 'Hướng dẫn chi tiết về cách chọn loa kéo phù hợp với nhu cầu sử dụng.',
      excerpt: 'Bạn đang tìm loa kéo cho gia đình? Bài viết này sẽ giúp bạn chọn được sản phẩm phù hợp.',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1280&h=720&fit=crop',
      status: 'PUBLISHED',
      publishedAt: '2024-12-05T08:00:00.000Z',
      viewCount: 420,
      likeCount: 65,
      commentCount: 2,
      seoTitle: 'Hướng dẫn chọn loa kéo cho gia đình',
      seoDescription: 'Bí quyết chọn mua loa kéo phù hợp với công suất, thời lượng pin và kết nối tối ưu.',
      seoKeywords: 'loa kéo, hướng dẫn mua loa, karaoke gia đình',
      featured: false,
      blog_categories: {
        id: 'cat-1',
        name: 'Hướng dẫn',
        slug: 'huong-dan',
        description: 'Các bài viết chia sẻ kinh nghiệm và hướng dẫn sử dụng thiết bị âm thanh.'
      },
      users: {
        id: 'user-1',
        name: 'Audio Tài Lộc',
        email: 'admin@audiotailoc.com'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'Làm thế nào để đặt hàng?',
      answer: 'Bạn có thể đặt hàng bằng cách thêm sản phẩm vào giỏ hàng và tiến hành thanh toán.',
      category: 'Đặt hàng',
      order: 1,
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      question: 'Thời gian giao hàng là bao lâu?',
      answer: 'Thời gian giao hàng thông thường là 2-3 ngày làm việc trong nội thành.',
      category: 'Giao hàng',
      order: 1,
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Support ticket form
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    subject: '',
    description: '',
    priority: 'MEDIUM'
  });

  useEffect(() => {
    fetchSupportData();
  }, []);

  const fetchSupportData = async () => {
    try {
      setLoading(true);

      try {
        const faqsResponse = await apiClient.get('/support/faq');
        const faqsData = handleApiResponse<FAQ[]>(faqsResponse);
        if (faqsData) {
          setFaqs(faqsData);
        }
      } catch {
        // Using default FAQs data
      }

      try {
        const blogResponse = await apiClient.get('/blog/articles?published=true');
        const blogData = handleApiResponse<{ data?: unknown }>(blogResponse);
        if (blogData?.data && Array.isArray(blogData.data)) {
          setBlogPosts(blogData.data);
        }
      } catch {
        // Using default blog data
      }

    } catch (error) {
      console.error('Error fetching support data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogPosts = Array.isArray(blogPosts) ? blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  }) : [];

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual ticket submission
    // Mock submission
    alert('Yêu cầu hỗ trợ đã được gửi! Chúng tôi sẽ liên hệ với bạn sớm.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải trang hỗ trợ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)),transparent_50%)] blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <MessageSquare className="h-4 w-4" />
                Trung tâm hỗ trợ
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                Hỗ trợ khách hàng
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn với đội ngũ kỹ thuật chuyên nghiệp
                và hệ thống kiến thức phong phú.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm bài viết từ blog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Articles */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Bài viết từ Blog</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogPosts.map((post, index) => (
                  <Card
                    key={post.id}
                    className="hover-audio group cursor-pointer transition-all duration-300 border-border/50 hover:border-primary/30"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-3 mb-3">
                        {post.imageUrl && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={post.imageUrl}
                              alt={post.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300 text-foreground">
                                  {post.title}
                                </CardTitle>
                                {post.blog_categories && (
                                  <p className="text-sm text-primary mt-1">{post.blog_categories.name}</p>
                                )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <span>{post.viewCount} lượt xem</span>
                          </span>
                          {post.likeCount && post.likeCount > 0 && (
                            <span className="flex items-center gap-1">
                              <span>❤️ {post.likeCount}</span>
                            </span>
                          )}
                        </div>
                        <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredBlogPosts.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Không tìm thấy bài viết nào.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <HelpCircle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Câu hỏi thường gặp</h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <Card key={faq.id} className="cursor-pointer" onClick={() => toggleFaq(faq.id)}>
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">{faq.question}</CardTitle>
                    </CardHeader>
                    {expandedFaq === faq.id && (
                      <CardContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div>
                  <h2 className="text-3xl font-bold mb-8 text-foreground">Liên hệ hỗ trợ</h2>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Hotline hỗ trợ</h3>
                        <p className="text-muted-foreground">1900 XXX XXX</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Email hỗ trợ</h3>
                        <p className="text-muted-foreground">support@audiotailoc.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support Ticket Form */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Gửi yêu cầu hỗ trợ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmitTicket} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Họ tên</Label>
                            <Input
                              id="name"
                              value={ticketForm.name}
                              onChange={(e) => setTicketForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Nhập họ tên"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={ticketForm.email}
                              onChange={(e) => setTicketForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="email@example.com"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="subject">Tiêu đề</Label>
                          <Input
                            id="subject"
                            value={ticketForm.subject}
                            onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder="Tóm tắt vấn đề của bạn"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Mô tả chi tiết</Label>
                          <Textarea
                            id="description"
                            value={ticketForm.description}
                            onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                            rows={4}
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          Gửi yêu cầu hỗ trợ
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
