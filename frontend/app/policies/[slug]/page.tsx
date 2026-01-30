'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Truck, Shield, Wrench, FileText, Lock, Calendar, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { apiClient, handleApiResponse, handleApiError } from '@/lib/api';
import { sanitizeProseHtml } from '@/lib/utils/sanitize';

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

export default function PolicyDetailPage() {
 const params = useParams();
 const slug = params.slug as string;

 const [policy, setPolicy] = useState<Policy | null>(null);
 const [relatedPolicies, setRelatedPolicies] = useState<Policy[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
 const fetchPolicy = async () => {
 try {
 setLoading(true);
 const response = await apiClient.get(`/policies/slug/${slug}`);
 const data = handleApiResponse<Policy>(response);
 setPolicy(data);

 // Fetch related policies (same type, excluding current)
 const allPoliciesResponse = await apiClient.get('/policies');
 const allPolicies = handleApiResponse<Policy[]>(allPoliciesResponse);
 const related = allPolicies.filter(p =>
 p.type === data.type && p.id !== data.id
 ).slice(0, 3);
 setRelatedPolicies(related);
 } catch (err) {
 console.error('Error fetching policy:', err);
 const errorInfo = handleApiError(err as { response?: { data?: { message?: string }; status?: number }; message?: string });
 setError(errorInfo.message);
 } finally {
 setLoading(false);
 }
 };

 if (slug) {
 fetchPolicy();
 }
 }, [slug]);

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

 if (error || !policy) {
 return (
 <div className="min-h-screen bg-background flex items-center justify-center">
 <div className="text-center">
 <div className="flex items-center gap-2 mb-4">
 <ArrowLeft className="h-4 w-4" />
 <Link href="/policies" className="text-primary hover:underline">
 Quay lại danh sách chính sách
 </Link>
 </div>
 <p className="text-destructive">
 {error || 'Không tìm thấy chính sách này.'}
 </p>
 </div>
 </div>
 );
 }

 const IconComponent = policyIcons[policy.type as keyof typeof policyIcons] || FileText;

 return (
 <div className="min-h-screen bg-background">
 <main>
 {/* Header */}
 <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
 <div className="container mx-auto px-4">
 <div className="max-w-4xl mx-auto">
 <div className="flex items-center gap-4 mb-6">
 <Link href="/policies">
 <Button variant="ghost" size="sm">
 <ArrowLeft className="h-4 w-4 mr-2" />
 Quay lại
 </Button>
 </Link>
 </div>

 <div className="flex items-start gap-4">
 <div className="p-3 bg-primary/10 rounded-lg">
 <IconComponent className="h-8 w-8 text-primary" />
 </div>
 <div className="flex-1">
 <h1 className="text-3xl md:text-4xl font-bold mb-2">
 {policyTitles[policy.type as keyof typeof policyTitles] || policy.title}
 </h1>
 {policy.summary && (
 <p className="text-xl text-muted-foreground">{policy.summary}</p>
 )}
 <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
 <div className="flex items-center gap-1">
 <Calendar className="h-4 w-4" />
 Cập nhật: {new Date(policy.updatedAt).toLocaleDateString('vi-VN')}
 </div>
 <div className="flex items-center gap-1">
 <Eye className="h-4 w-4" />
 {policy.viewCount} lượt xem
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* Content */}
 <section className="py-16">
 <div className="container mx-auto px-4">
 <div className="max-w-4xl mx-auto">
 <Card>
 <CardContent className="p-8">
 <div
 className="prose prose-xl max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90"
 dangerouslySetInnerHTML={{ __html: sanitizeProseHtml(policy.contentHtml) }}
 />
 </CardContent>
 </Card>
 </div>
 </div>
 </section>

 {/* Related Policies */}
 {relatedPolicies.length > 0 && (
 <section className="py-16 bg-muted/30">
 <div className="container mx-auto px-4">
 <div className="max-w-4xl mx-auto">
 <h2 className="text-2xl font-bold mb-8 text-center">
 Chính sách liên quan
 </h2>
 <div className="grid md:grid-cols-3 gap-6">
 {relatedPolicies.map((relatedPolicy) => {
 const RelatedIconComponent = policyIcons[relatedPolicy.type as keyof typeof policyIcons] || FileText;
 return (
 <Card key={relatedPolicy.id} className="hover:shadow-lg transition-shadow">
 <CardHeader>
 <div className="flex items-center gap-3">
 <RelatedIconComponent className="h-5 w-5 text-primary" />
 <CardTitle className="text-lg">
 {policyTitles[relatedPolicy.type as keyof typeof policyTitles] || relatedPolicy.title}
 </CardTitle>
 </div>
 </CardHeader>
 <CardContent>
 {relatedPolicy.summary && (
 <p className="text-sm text-muted-foreground mb-4">
 {relatedPolicy.summary}
 </p>
 )}
 <Link href={`/policies/${relatedPolicy.slug}`}>
 <Button variant="outline" size="sm" className="w-full">
 Xem chi tiết
 </Button>
 </Link>
 </CardContent>
 </Card>
 );
 })}
 </div>
 </div>
 </div>
 </section>
 )}

 {/* Contact Section */}
 <section className="py-16">
 <div className="container mx-auto px-4 text-center">
 <h2 className="text-3xl font-bold mb-4">Cần hỗ trợ thêm?</h2>
 <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
 Nếu bạn có câu hỏi về chính sách này hoặc cần hỗ trợ thêm,
 đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link href="/contact">
 <Button size="lg">
 <Wrench className="mr-2 h-4 w-4" />
 Liên hệ hỗ trợ
 </Button>
 </Link>
 <Link href="/policies">
 <Button variant="outline" size="lg">
 <FileText className="mr-2 h-4 w-4" />
 Xem tất cả chính sách
 </Button>
 </Link>
 </div>
 </div>
 </section>
 </main>
 </div>
 );
}
