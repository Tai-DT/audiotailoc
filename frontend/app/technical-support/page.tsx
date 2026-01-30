'use client';

import React, { useMemo } from 'react';
import { Wrench, Phone, MessageCircle, Mail, Clock, CheckCircle, AlertCircle, Users, FileText, Headphones } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useContactInfo } from '@/lib/hooks/use-contact-info';
import { useServices } from '@/lib/hooks/use-api';
import { useBlogArticles } from '@/lib/hooks/use-api';

export default function TechnicalSupportPage() {
 const { data: contactInfo } = useContactInfo();
 const hotlineNumber = contactInfo?.phone?.hotline
 || contactInfo?.phone?.display?.replace(/\s+/g, '')
 || '';
 const hotlineDisplay = contactInfo?.phone?.display || contactInfo?.phone?.hotline || '';
 const { data: servicesData } = useServices({
 isActive: true,
 isFeatured: true,
 pageSize: 3,
 sortBy: 'viewCount',
 sortOrder: 'desc',
 });
 const { data: articlesData } = useBlogArticles({
 published: true,
 limit: 30, // Changed from pageSize to limit to match BlogFilters interface
 });

 const supportChannels = [
 {
 icon: Phone,
 title: 'Hotline kỹ thuật',
 description: 'Hỗ trợ trực tiếp',
 contact: contactInfo?.phone?.display,
 availability: contactInfo?.businessHours?.display,
 response: 'Ngay lập tức'
 },
 {
 icon: MessageCircle,
 title: 'Chat trực tuyến',
 description: 'Hỗ trợ qua Zalo, Facebook',
 contact: `Zalo: ${contactInfo?.zalo?.phoneNumber || contactInfo?.phone?.display || ''}`,
 availability: contactInfo?.businessHours?.display,
 response: '< 5 phút'
 },
 {
 icon: Mail,
 title: 'Email hỗ trợ',
 description: 'Gửi yêu cầu chi tiết',
 contact: contactInfo?.email,
 availability: '24/7',
 response: '< 24 giờ'
 }
 ];

 const supportServices = (servicesData?.items || []).slice(0, 3).map((service, index) => {
 const icons = [Wrench, Users, FileText];
 const Icon = icons[index % icons.length];
 return {
 icon: Icon,
 title: service.name,
 description: service.shortDescription || service.description || 'Dịch vụ hỗ trợ chuyên nghiệp',
 items: service.features && service.features.length > 0 ? service.features.slice(0, 4) : ['Liên hệ để được tư vấn chi tiết'],
 };
 });

 const commonIssues = useMemo(() => {
 const items = articlesData?.data || [];
 const grouped = items.reduce<Record<string, string[]>>((acc, article) => {
 const category = article.category?.name || 'Khác';
 if (!acc[category]) acc[category] = [];
 acc[category].push(article.title);
 return acc;
 }, {});

 return Object.entries(grouped)
 .slice(0, 3)
 .map(([category, issues]) => ({
 category,
 issues: issues.slice(0, 4),
 }));
 }, [articlesData]);

 const supportProcess = [
 {
 step: 1,
 title: 'Tiếp nhận yêu cầu',
 description: 'Ghi nhận thông tin và phân loại vấn đề',
 time: 'Ngay lập tức'
 },
 {
 step: 2,
 title: 'Chẩn đoán',
 description: 'Kỹ thuật viên phân tích và xác định nguyên nhân',
 time: '15-30 phút'
 },
 {
 step: 3,
 title: 'Giải quyết',
 description: 'Áp dụng giải pháp phù hợp',
 time: '30 phút - 2 giờ'
 },
 {
 step: 4,
 title: 'Kiểm tra',
 description: 'Xác nhận vấn đề đã được giải quyết',
 time: 'Ngay sau khi sửa'
 }
 ];

 return (
 <div className="min-h-screen bg-background">
 <main>
 {/* Hero Section */}
 <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
 <div className="container mx-auto px-4">
 <div className="text-center max-w-3xl mx-auto">
 <h1 className="text-4xl md:text-5xl font-bold mb-6">
 Hỗ trợ kỹ thuật
 </h1>
 <p className="text-xl text-muted-foreground">
 Đội ngũ kỹ thuật chuyên nghiệp của Audio Tài Lộc luôn sẵn sàng
 hỗ trợ bạn với các giải pháp tối ưu nhất.
 </p>
 </div>
 </div>
 </section>

 {/* Support Channels */}
 <section className="py-16">
 <div className="container mx-auto px-4">
 <div className="text-center mb-12">
 <h2 className="text-3xl font-bold mb-4">Kênh hỗ trợ</h2>
 <p className="text-muted-foreground max-w-2xl mx-auto">
 Nhiều cách để liên hệ với chúng tôi, bạn có thể chọn phương thức phù hợp nhất
 </p>
 </div>

 <div className="grid md:grid-cols-3 gap-6 mb-16">
 {supportChannels.map((channel, index) => (
 <Card key={index} className="text-center hover:shadow-lg transition-shadow">
 <CardHeader>
 <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
 <channel.icon className="h-6 w-6" />
 </div>
 <CardTitle>{channel.title}</CardTitle>
 <p className="text-sm text-muted-foreground">{channel.description}</p>
 </CardHeader>
 <CardContent>
 <div className="space-y-2">
 <p className="font-medium">{channel.contact}</p>
 <div className="flex justify-center gap-4 text-sm">
 <span className="flex items-center gap-1">
 <Clock className="h-3 w-3" />
 {channel.availability}
 </span>
 <span className="flex items-center gap-1">
 <CheckCircle className="h-3 w-3 text-success" />
 {channel.response}
 </span>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 </div>
 </section>

 {/* Support Services */}
 <section className="py-16 bg-muted/30">
 <div className="container mx-auto px-4">
 <div className="text-center mb-12">
 <h2 className="text-3xl font-bold mb-4">Dịch vụ hỗ trợ</h2>
 <p className="text-muted-foreground max-w-2xl mx-auto">
 Chúng tôi cung cấp đầy đủ các dịch vụ hỗ trợ kỹ thuật chuyên nghiệp
 </p>
 </div>

 <div className="grid md:grid-cols-3 gap-8">
 {supportServices.length === 0 ? (
 <div className="md:col-span-3 text-center text-muted-foreground">
 Chưa có dịch vụ hỗ trợ nào được cập nhật.
 </div>
 ) : (
 supportServices.map((service, index) => (
 <Card key={index}>
 <CardHeader>
 <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-2">
 <service.icon className="h-5 w-5" />
 </div>
 <CardTitle>{service.title}</CardTitle>
 <p className="text-sm text-muted-foreground">{service.description}</p>
 </CardHeader>
 <CardContent>
 <ul className="space-y-2">
 {service.items.map((item, itemIndex) => (
 <li key={itemIndex} className="flex items-start gap-2 text-sm">
 <CheckCircle className="h-3 w-3 text-success mt-1 flex-shrink-0" />
 {item}
 </li>
 ))}
 </ul>
 </CardContent>
 </Card>
 ))
 )}
 </div>
 </div>
 </section>

 {/* Common Issues */}
 <section className="py-16">
 <div className="container mx-auto px-4">
 <div className="text-center mb-12">
 <h2 className="text-3xl font-bold mb-4">Vấn đề thường gặp</h2>
 <p className="text-muted-foreground max-w-2xl mx-auto">
 Các vấn đề phổ biến và cách khắc phục nhanh chóng
 </p>
 </div>

 <div className="grid md:grid-cols-3 gap-8">
 {commonIssues.length === 0 ? (
 <div className="md:col-span-3 text-center text-muted-foreground">
 Chưa có bài viết hướng dẫn nào.
 </div>
 ) : (
 commonIssues.map((category, index) => (
 <Card key={index}>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <AlertCircle className="h-5 w-5 text-warning" />
 {category.category}
 </CardTitle>
 </CardHeader>
 <CardContent>
 <ul className="space-y-2">
 {category.issues.map((issue, issueIndex) => (
 <li key={issueIndex} className="flex items-start gap-2 text-sm">
 <span className="mt-1 block w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
 {issue}
 </li>
 ))}
 </ul>
 </CardContent>
 </Card>
 ))
 )}
 </div>
 </div>
 </section>

 {/* Support Process */}
 <section className="py-16 bg-muted/30">
 <div className="container mx-auto px-4">
 <div className="text-center mb-12">
 <h2 className="text-3xl font-bold mb-4">Quy trình hỗ trợ</h2>
 <p className="text-muted-foreground max-w-2xl mx-auto">
 Quy trình xử lý yêu cầu hỗ trợ kỹ thuật chuyên nghiệp và hiệu quả
 </p>
 </div>

 <div className="max-w-5xl mx-auto">
 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
 {supportProcess.map((step, index) => (
 <Card key={index} className="text-center">
 <CardContent className="pt-6">
 <div className="w-12 h-12 bg-primary text-foreground dark:text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
 {step.step}
 </div>
 <h3 className="font-semibold mb-2">{step.title}</h3>
 <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
 <Badge variant="outline" className="text-xs">{step.time}</Badge>
 </CardContent>
 </Card>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* Remote Support */}
 <section className="py-16">
 <div className="container mx-auto px-4">
 <div className="max-w-4xl mx-auto text-center">
 <h2 className="text-3xl font-bold mb-4">Hỗ trợ từ xa</h2>
 <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
 Đối với một số vấn đề, chúng tôi có thể hỗ trợ từ xa mà không cần
 mang sản phẩm đến cửa hàng.
 </p>

 <div className="grid md:grid-cols-2 gap-8">
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2 text-success">
 <CheckCircle className="h-5 w-5" />
 Có thể hỗ trợ từ xa
 </CardTitle>
 </CardHeader>
 <CardContent className="text-left space-y-2">
 <p className="text-sm">• Cập nhật phần mềm và firmware</p>
 <p className="text-sm">• Cấu hình thiết bị</p>
 <p className="text-sm">• Khắc phục lỗi kết nối</p>
 <p className="text-sm">• Hướng dẫn sử dụng</p>
 <p className="text-sm">• Tối ưu hóa hiệu suất</p>
 </CardContent>
 </Card>

 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2 text-primary">
 <Headphones className="h-5 w-5" />
 Cần hỗ trợ tại chỗ
 </CardTitle>
 </CardHeader>
 <CardContent className="text-left space-y-2">
 <p className="text-sm">• Sửa chữa phần cứng</p>
 <p className="text-sm">• Thay thế linh kiện</p>
 <p className="text-sm">• Kiểm tra vật lý</p>
 <p className="text-sm">• Bảo hành chính hãng</p>
 <p className="text-sm">• Nâng cấp phần cứng</p>
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 </section>

 {/* Contact Section */}
 <section className="py-16 bg-muted/30">
 <div className="container mx-auto px-4 text-center">
 <h2 className="text-3xl font-bold mb-4">Cần hỗ trợ kỹ thuật?</h2>
 <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
 Đội ngũ kỹ thuật viên chuyên nghiệp của chúng tôi luôn sẵn sàng
 hỗ trợ bạn với các giải pháp tốt nhất.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link href="/contact">
 <Button size="lg">
 <Headphones className="mr-2 h-4 w-4" />
 Liên hệ hỗ trợ
 </Button>
 </Link>
 <Link href={`tel:${hotlineNumber}`}>
 <Button variant="outline" size="lg">
 Hotline: {hotlineDisplay}
 </Button>
 </Link>
 </div>
 </div>
 </section>
 </main>
 </div>
 );
}
