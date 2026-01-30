'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
 MapPin,
 Phone,
 Mail,
 Clock,
 Send,
 MessageSquare,
 Calendar,
 Headphones,
 ChevronRight,
 Sparkles,
 ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient, handleApiResponse } from '@/lib/api';
import { useContactInfo } from '@/lib/hooks/use-contact-info';
import { useFAQs } from '@/lib/hooks/use-faq';
import { useServices } from '@/lib/hooks/use-api';
import { BlurFade } from '@/components/ui/blur-fade';

interface SiteSettings {
 general?: {
 siteName?: string;
 tagline?: string;
 logoUrl?: string;
 primaryEmail?: string;
 primaryPhone?: string;
 address?: string;
 workingHours?: string;
 };
 socials?: {
 facebook?: string;
 youtube?: string;
 tiktok?: string;
 instagram?: string;
 zalo?: string;
 };
 store?: {
 address?: string;
 phone?: string;
 email?: string;
 workingHours?: string;
 };
}

const supportServiceIcons = [Headphones, Calendar, MessageSquare];

export default function ContactPage() {
 const [mounted, setMounted] = useState(false);
 const [formData, setFormData] = useState({
 name: '',
 email: '',
 phone: '',
 subject: '',
 message: ''
 });
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [settings, setSettings] = useState<SiteSettings | null>(null);
 const { data: contactInfo } = useContactInfo();
 const { data: faqs } = useFAQs();
 const { data: servicesData } = useServices({
 isActive: true,
 isFeatured: true,
 pageSize: 3,
 sortBy: 'viewCount',
 sortOrder: 'desc',
 });

 useEffect(() => {
 setMounted(true);
 }, []);

 useEffect(() => {
 fetchSettings();
 }, []);

 const fetchSettings = async () => {
 try {
 const response = await apiClient.get('/content/settings');
 const data = handleApiResponse<SiteSettings>(response);
 if (data) {
 setSettings(data);
 }
 } catch (error) {
 console.error('Error fetching settings:', error);
 }
 };

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
 const { name, value } = e.target;
 setFormData(prev => ({
 ...prev,
 [name]: value
 }));
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsSubmitting(true);

 try {
 await apiClient.post('/support/tickets', {
 name: formData.name,
 email: formData.email,
 subject: formData.subject || `Liên hệ từ ${formData.name}`,
 description: `Số điện thoại: ${formData.phone}\n\n${formData.message}`,
 priority: 'MEDIUM',
 });

 toast.success('Gửi thông tin thành công! Audio Tài Lộc sẽ liên hệ lại sớm nhất.');
 setFormData({
 name: '',
 email: '',
 phone: '',
 subject: '',
 message: ''
 });
 } catch (error) {
 console.error('Contact form submission error:', error);
 toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
 } finally {
 setIsSubmitting(false);
 }
 };

 const contactCards = [
 {
 icon: MapPin,
 title: 'Vị trí Showroom',
 content: contactInfo?.address?.full || settings?.general?.address || settings?.store?.address || 'TP. Hồ Chí Minh',
 details: 'Không gian trải nghiệm âm thanh chuyên nghiệp',
 label: 'Location'
 },
 {
 icon: Phone,
 title: 'Đường dây nóng',
 content: contactInfo?.phone?.display || settings?.general?.primaryPhone || settings?.store?.phone || '09xx xxx xxx',
 details: 'Hỗ trợ tư vấn giải pháp 24/7',
 label: 'Direct Line'
 },
 {
 icon: Mail,
 title: 'Thư điện tử',
 content: contactInfo?.email || settings?.general?.primaryEmail || settings?.store?.email || 'contact@audiotailoc.vn',
 details: 'Phản hồi yêu cầu kỹ thuật nhanh chóng',
 label: 'Inquiries'
 },
 {
 icon: Clock,
 title: 'Giờ đón khách',
 content: contactInfo?.businessHours?.display || settings?.general?.workingHours || settings?.store?.workingHours || '08:00 - 18:00',
 details: 'Hoạt động tất cả các ngày trong tuần',
 label: 'Office Hours'
 }
 ];

 const supportServices = useMemo(() => {
 const services = servicesData?.items || [];
 return services.slice(0, 3).map((service, index) => ({
 icon: supportServiceIcons[index % supportServiceIcons.length],
 title: service.name,
 description: service.shortDescription || service.description || 'Dịch vụ hỗ trợ chuyên nghiệp.'
 }));
 }, [servicesData]);

 const displayFaqs = (faqs || []).slice(0, 3);

 if (!mounted) {
 return (
 <main className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center p-8">
 <div className="w-16 h-16 rounded-2xl bg-primary/20 animate-pulse mb-6" />
 <div className="h-6 w-64 rounded-full bg-muted/40 mb-4" />
 <div className="h-4 w-80 rounded-full bg-muted/30" />
 </main>
 );
 }

 return (
 <main className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white selection:bg-primary/30 pb-32">
 {/* Cinematic Hero */}
 <section className="relative pt-32 pb-20 overflow-hidden">
 <div className="absolute inset-0 z-0">
 <div className="absolute top-0 right-1/4 w-[1000px] h-[1000px] bg-primary/5 blur-[150px] animate-pulse" />
 <div className="absolute inset-0 bg-studio-grid opacity-20" />
 </div>

 <div className="container mx-auto px-6 relative z-10">
 <BlurFade delay={0.1} inView>
 <div className="text-center space-y-8">
 <div className="flex flex-col items-center gap-6">
 <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
 <Headphones className="w-4 h-4 text-primary animate-pulse" />
 <span className="text-[10px] uppercase font-black tracking-[0.3em] text-foreground/60 dark:text-zinc-200">Professional Support</span>
 </div>
 <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none font-display">
 Kết nối <span className="text-primary italic">Chuyên gia</span><br />
 Tư vấn <span className="text-accent italic">Tận tâm</span>
 </h1>
 <p className="text-foreground/40 dark:text-zinc-300 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed italic px-12 border-l border-r border-white/5">
 Đội ngũ kỹ thuật của Audio Tài Lộc luôn sẵn sàng giải đáp mọi thắc mắc và đưa ra giải pháp âm thanh tối ưu nhất cho không gian của bạn.
 </p>
 </div>
 </div>
 </BlurFade>
 </div>
 </section>

 {/* Primary Contact Options */}
 <section className="py-12 relative z-10">
 <div className="container mx-auto px-6">
 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
 {contactCards.map((info, index) => (
 <BlurFade key={index} delay={0.1 * index} inView>
 <div className="group relative p-10 bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2">
 <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
 <info.icon className="h-10 w-10 text-primary mb-8 group-hover:scale-110 transition-transform duration-500" />
 <div className="space-y-4">
 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">{info.label}</p>
 <h3 className="text-lg font-black uppercase tracking-tight">{info.title}</h3>
 <p className="text-foreground dark:text-white font-bold tracking-tight text-sm truncate">{info.content}</p>
 <p className="text-[10px] text-foreground/40 dark:text-zinc-300 font-medium italic">{info.details}</p>
 </div>
 </div>
 </BlurFade>
 ))}
 </div>
 </div>
 </section>

 {/* Main Form Section */}
 <section className="py-24 relative overflow-hidden">
 <div className="container mx-auto px-6">
 <div className="grid lg:grid-cols-2 gap-20 items-stretch">
 {/* Contact Form - Glass Effect */}
 <BlurFade delay={0.2} direction="right" inView>
 <div className="h-full p-12 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-1/4 w-40 h-40 bg-primary/10 blur-[100px] rounded-full" />

 <div className="relative z-10 space-y-12">
 <div className="space-y-4">
 <h2 className="text-4xl font-black uppercase tracking-tighter italic">Gửi <span className="text-primary">Yêu cầu</span></h2>
 <p className="text-foreground/40 dark:text-zinc-300 text-sm font-medium italic">Chúng tôi sẽ hồi đạt tới quý khách trong tối đa 24 giờ làm việc.</p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-8">
 <div className="grid md:grid-cols-2 gap-8">
 <div className="space-y-3">
 <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 dark:text-zinc-400 ml-4">Danh tính của bạn</label>
 <Input
 name="name"
 value={formData.name}
 onChange={handleInputChange}
 required
 placeholder="Họ và tên..."
 className="h-14 bg-white/5 border-white/10 rounded-2xl text-foreground dark:text-white placeholder:text-foreground/10 dark:text-white/10 focus:border-primary/50 transition-all px-6 text-xs ring-0"
 />
 </div>
 <div className="space-y-3">
 <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 dark:text-zinc-400 ml-4">Phương thức liên hệ</label>
 <Input
 name="phone"
 type="tel"
 value={formData.phone}
 onChange={handleInputChange}
 required
 placeholder="Số điện thoại..."
 className="h-14 bg-white/5 border-white/10 rounded-2xl text-foreground dark:text-white placeholder:text-foreground/10 dark:text-white/10 focus:border-primary/50 transition-all px-6 text-xs ring-0"
 />
 </div>
 </div>

 <div className="space-y-3">
 <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 dark:text-zinc-400 ml-4">Hòm thư điện tử</label>
 <Input
 name="email"
 type="email"
 value={formData.email}
 onChange={handleInputChange}
 required
 placeholder="email@example.com"
 className="h-14 bg-white/5 border-white/10 rounded-2xl text-foreground dark:text-white placeholder:text-foreground/10 dark:text-white/10 focus:border-primary/50 transition-all px-6 text-xs ring-0"
 />
 </div>

 <div className="space-y-3">
 <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 dark:text-zinc-400 ml-4">Thông điệp cần gửi</label>
 <Textarea
 name="message"
 value={formData.message}
 onChange={handleInputChange}
 required
 rows={5}
 placeholder="Mô tả nhu cầu của bạn về giải pháp âm thanh chuyên nghiệp..."
 className="bg-white/5 border-white/10 rounded-2xl text-foreground dark:text-white placeholder:text-foreground/10 dark:text-white/10 focus:border-primary/50 transition-all px-6 py-4 text-xs ring-0"
 />
 </div>

 <button
 type="submit"
 disabled={isSubmitting}
 className="w-full h-16 bg-primary text-foreground dark:text-white font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-red-500 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-4 group/btn"
 >
 {isSubmitting ? "Đang gửi đi..." : (
 <>
 Khai mở Kiệt tác
 <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
 </>
 )}
 </button>
 </form>
 </div>
 </div>
 </BlurFade>

 {/* Support Info Column */}
 <div className="space-y-12">
 <BlurFade delay={0.4} direction="left" inView>
 <div className="space-y-12">
 {/* Services Card */}
 <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8 hover:border-accent/40 transition-colors">
 <div>
 <p className="text-accent font-black uppercase tracking-[0.3em] text-[10px] mb-2">Service Pillars</p>
 <h3 className="text-2xl font-black uppercase tracking-tight leading-none">Dịch vụ Đặc quyền</h3>
 </div>
 <div className="space-y-8">
 {supportServices.map((service, index) => (
 <div key={index} className="flex gap-6 group">
 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-foreground dark:text-white transition-all text-accent">
 <service.icon className="w-6 h-6" />
 </div>
 <div className="space-y-1">
 <h4 className="font-bold text-foreground dark:text-white tracking-tight">{service.title}</h4>
 <p className="text-[11px] text-foreground/40 dark:text-zinc-300 italic leading-relaxed">{service.description}</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* FAQ Minimal Redesign */}
 <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
 <div className="flex items-center justify-between">
 <h3 className="text-2xl font-black uppercase tracking-tight">Giải đáp <span className="text-foreground/40 dark:text-zinc-300 font-medium italic lowercase">FAQ</span></h3>
 <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 <div className="space-y-6">
 {displayFaqs.map((faq) => (
 <div key={faq.id} className="space-y-2 group cursor-pointer border-b border-white/5 pb-4 last:border-0">
 <h4 className="font-bold text-foreground dark:text-white group-hover:text-primary transition-colors flex items-center gap-3">
 <Sparkles className="w-3 h-3 text-accent" />
 {faq.question}
 </h4>
 <p className="text-[11px] text-foreground/40 dark:text-zinc-300 italic pl-6">{faq.answer}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </BlurFade>
 </div>
 </div>
 </div>
 </section>

 {/* Map Experience */}
 <section className="py-24">
 <div className="container mx-auto px-6">
 <BlurFade delay={0.6} inView>
 <div className="flex flex-col items-center gap-12 text-center">
 <div className="space-y-4">
 <p className="text-primary font-black uppercase tracking-[0.5em] text-[10px]">Showroom Experience</p>
 <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase italic">Tìm đường đến <span className="text-foreground/40 dark:text-zinc-300">Thánh đường</span></h2>
 </div>

 <div className="w-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden border-2 border-white/5 relative group p-1 bg-white/5 backdrop-blur-3xl shadow-3xl">
 <div className="absolute inset-0 z-0">
 <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-12 text-center group-hover:bg-slate-800 transition-colors">
 <MapPin className="h-20 w-20 text-foreground/5 dark:text-white/5 mb-8 animate-bounce" />
 <div className="space-y-4">
 <p className="text-xl font-bold uppercase tracking-tight">{contactInfo?.address?.full || "Khu vực trung tâm TP. Hồ Chí Minh"}</p>
 <p className="text-foreground/40 dark:text-zinc-300 italic">Bản đồ đang được tối ưu hóa để dẫn lối quý khách đến showroom nhanh nhất.</p>
 </div>
 <Button
 variant="outline"
 className="mt-12 h-14 px-12 rounded-2xl border-primary/40 bg-primary/5 text-primary hover:bg-primary hover:text-foreground dark:text-white font-black uppercase tracking-widest transition-all"
 onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo?.address?.full || 'Audio Tài Lộc')}`, '_blank')}
 >
 Mở Google Maps
 <ArrowRight className="ml-4 h-4 w-4" />
 </Button>
 </div>
 </div>
 </div>
 </div>
 </BlurFade>
 </div>
 </section>
 </main>
 );
}
