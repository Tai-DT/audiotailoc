'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HelpCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export default function FAQPage() {
    const router = useRouter();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const response = await apiClient.get('/support/faq');
                const data = handleApiResponse<FAQ[]>(response);
                if (data) {
                    setFaqs(data);
                }
            } catch (error) {
                console.error('Error fetching FAQs:', error);
                setFaqs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFAQs();
    }, []);

    const toggleFaq = (faqId: string) => {
        setExpandedFaq(expandedFaq === faqId ? null : faqId);
    };

    // Group FAQs by category
    const groupedFaqs = faqs.reduce((acc, faq) => {
        const category = faq.category || 'Khác';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(faq);
        return acc;
    }, {} as Record<string, FAQ[]>);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Đang tải câu hỏi thường gặp...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)),transparent_50%)] blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <HelpCircle className="h-4 w-4" />
                            FAQ
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                            Câu hỏi thường gặp
                        </h1>

                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            Tìm câu trả lời cho những thắc mắc phổ biến về sản phẩm, dịch vụ và chính sách của Audio Tài Lộc.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-10">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {Object.entries(groupedFaqs).length > 0 ? (
                            Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
                                <div key={category} className="mb-8">
                                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                            <HelpCircle className="h-4 w-4" />
                                        </span>
                                        {category}
                                    </h2>

                                    <div className="space-y-3">
                                        {categoryFaqs.map((faq) => (
                                            <Card
                                                key={faq.id}
                                                className="cursor-pointer transition-all duration-300 hover:border-primary/30"
                                                onClick={() => toggleFaq(faq.id)}
                                                role="button"
                                                aria-expanded={expandedFaq === faq.id}
                                            >
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base md:text-lg text-foreground flex items-center justify-between">
                                                        <span>{faq.question}</span>
                                                        <ArrowRight
                                                            className={`h-5 w-5 text-primary transition-transform duration-300 ${expandedFaq === faq.id ? 'rotate-90' : ''
                                                                }`}
                                                        />
                                                    </CardTitle>
                                                </CardHeader>
                                                {expandedFaq === faq.id && (
                                                    <CardContent className="pt-0">
                                                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                                    </CardContent>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">Chưa có câu hỏi nào</h2>
                                <p className="text-muted-foreground text-sm md:text-base mb-6">
                                    Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi.
                                </p>
                            </div>
                        )}

                        {/* CTA to Support */}
                        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 text-center">
                            <MessageSquare className="h-10 w-10 text-primary mx-auto mb-3" />
                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                                Không tìm thấy câu trả lời?
                            </h3>
                            <p className="text-muted-foreground text-sm md:text-base mb-4 max-w-xl mx-auto">
                                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn với bất kỳ thắc mắc nào.
                            </p>
                            <Button size="lg" className="h-11" onClick={() => router.push('/support')}>
                                Liên hệ hỗ trợ
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
