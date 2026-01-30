'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
 Send,
 Bug,
 Terminal,
 Monitor,
 Smartphone,
 Globe,
 CheckCircle2,
 ArrowLeft,
 ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue
} from '@/components/ui/select';
import { BlurFade } from '@/components/ui/blur-fade';
import { apiClient } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function ReportIssuePage() {
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isSubmitted, setIsSubmitted] = useState(false);
 const [formData, setFormData] = useState({
 name: '',
 email: '',
 type: 'bug',
 url: '',
 device: 'desktop',
 description: '',
 });

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsSubmitting(true);

 try {
 const subject = `[BUG REPORT] ${formData.type.toUpperCase()}: ${formData.url || 'General'}`;
 const description = `
Họ tên: ${formData.name}
Email: ${formData.email}
Loại sự cố: ${formData.type}
Trang lỗi: ${formData.url || 'N/A'}
Thiết bị: ${formData.device}

Mô tả chi tiết:
${formData.description}
 `.trim();

 await apiClient.post('/support/tickets', {
 name: formData.name,
 email: formData.email,
 subject,
 description,
 priority: 'HIGH',
 });

 setIsSubmitted(true);
 toast.success('Báo cáo của bạn đã được gửi. Cảm ơn sự đóng góp của bạn!');
 } catch (error) {
 console.error('Error reporting issue:', error);
 toast.error('Không thể gửi báo cáo. Vui lòng thử lại sau.');
 } finally {
 setIsSubmitting(false);
 }
 };

 if (isSubmitted) {
 return (
 <div className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white flex items-center justify-center p-4">
 <div className="max-w-md w-full text-center space-y-6">
 <BlurFade delay={0.1}>
 <div className="inline-flex p-6 rounded-full bg-primary/10 border border-primary/20 mb-4">
 <CheckCircle2 className="h-16 w-16 text-primary animate-pulse" />
 </div>
 <h1 className="text-3xl font-bold">Gửi báo cáo thành công!</h1>
 <p className="text-foreground/60 dark:text-zinc-200 leading-relaxed text-lg">
 Cảm ơn bạn đã đóng góp vào việc cải thiện hệ thống. Đội ngũ kỹ thuật sẽ xem xét bài viết của bạn sớm nhất có thể.
 </p>
 </BlurFade>
 <BlurFade delay={0.2}>
 <Link href="/">
 <Button size="lg" className="w-full h-14 rounded-2xl bg-white text-slate-950 hover:bg-white/90 font-bold transition-all active:scale-95">
 Quay về trang chủ
 </Button>
 </Link>
 </BlurFade>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white selection:bg-primary/30 relative overflow-hidden">
 {/* Background Decor */}
 <div className="absolute inset-0 pointer-events-none opacity-20">
 <div className="absolute top-1/4 left-0 w-[800px] h-[800px] rounded-full bg-primary/20 blur-[180px]" />
 <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] rounded-full bg-accent/20 blur-[150px]" />

 {/* Animated Lines / Grid */}
 <div className="absolute inset-0" style={{
 backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
 backgroundSize: '32px 32px'
 }} />
 </div>

 <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
 <div className="max-w-4xl mx-auto space-y-12">
 {/* Header */}
 <div className="flex flex-col items-center text-center space-y-6">
 <BlurFade delay={0.1} direction="up">
 <Link href="/support" className="inline-flex items-center gap-2 text-foreground/40 dark:text-zinc-300 hover:text-foreground dark:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-4">
 <ArrowLeft className="h-4 w-4" />
 Quay lại hỗ trợ
 </Link>
 </BlurFade>
 <BlurFade delay={0.2} direction="up">
 <div className="inline-flex p-4 rounded-3xl bg-destructive/10 border border-destructive/20 mb-2">
 <ShieldAlert className="h-12 w-12 text-destructive" />
 </div>
 <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
 Báo lỗi <span className="text-primary italic">Kỹ thuật</span>
 </h1>
 <p className="text-foreground/60 dark:text-zinc-200 text-lg md:text-xl max-w-2xl">
 Phát hiện lỗ hổng hay sự cố không mong muốn? Hãy cho chúng tôi biết để hệ thống được hoàn thiện hơn mỗi ngày.
 </p>
 </BlurFade>
 </div>

 {/* Form Section */}
 <BlurFade delay={0.3}>
 <div className="grid lg:grid-cols-5 gap-8">
 {/* Sidebar Info */}
 <div className="lg:col-span-2 space-y-6">
 <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-8">
 <div className="space-y-4">
 <h3 className="text-xl font-bold flex items-center gap-3">
 <Terminal className="h-5 w-5 text-primary" />
 Quy trình xử lý
 </h3>
 <div className="space-y-4">
 {[
 { step: '01', title: 'Tiếp nhận', desc: 'Hệ thống tự động ghi nhận báo cáo.' },
 { step: '02', title: 'Kiểm tra', desc: 'Kỹ thuật viên mô phỏng lại lỗi.' },
 { step: '03', title: 'Khắc phục', desc: 'Đưa ra bản vá và triển khai.' },
 ].map((item, i) => (
 <div key={i} className="flex gap-4">
 <span className="text-primary font-black text-sm pt-0.5">{item.step}</span>
 <div>
 <p className="font-bold text-sm">{item.title}</p>
 <p className="text-xs text-foreground/40 dark:text-zinc-300">{item.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
 <p className="text-xs leading-relaxed text-foreground/60 dark:text-zinc-200">
 <span className="text-primary font-bold">Lưu ý:</span> Báo cáo của bạn sẽ được bảo mật. Chúng tôi có thể liên hệ lại qua Email để thu thập thêm thông tin nếu cần thiết.
 </p>
 </div>
 </div>
 </div>

 {/* Form */}
 <div className="lg:col-span-3">
 <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-[2rem] bg-white/[0.05] border border-white/10 backdrop-blur-2xl shadow-2xl space-y-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-3">
 <Label htmlFor="name" className="text-[13px] font-bold text-foreground/40 dark:text-zinc-300 uppercase tracking-widest ml-1">Họ tên</Label>
 <Input
 id="name"
 required
 value={formData.name}
 onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
 placeholder="Nguyễn Văn A"
 className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-2xl"
 />
 </div>
 <div className="space-y-3">
 <Label htmlFor="email" className="text-[13px] font-bold text-foreground/40 dark:text-zinc-300 uppercase tracking-widest ml-1">Email</Label>
 <Input
 id="email"
 required
 type="email"
 value={formData.email}
 onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
 placeholder="a@example.com"
 className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-2xl"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-3">
 <Label className="text-[13px] font-bold text-foreground/40 dark:text-zinc-300 uppercase tracking-widest ml-1">Loại sự cố</Label>
 <Select
 value={formData.type}
 onValueChange={(val) => setFormData(prev => ({ ...prev, type: val }))}
 >
 <SelectTrigger className="h-14 bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl">
 <SelectValue placeholder="Chọn loại sự cố" />
 </SelectTrigger>
 <SelectContent className="bg-slate-900 border-white/10 text-foreground dark:text-white rounded-2xl">
 <SelectItem value="bug">Lỗi chức năng (Bug)</SelectItem>
 <SelectItem value="display">Lỗi hiển thị (UI/UX)</SelectItem>
 <SelectItem value="performance">Tốc độ & Hiệu hiệu năng</SelectItem>
 <SelectItem value="security">Vấn đề bảo mật</SelectItem>
 <SelectItem value="suggestion">Góp ý cải thiện</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="space-y-3">
 <Label className="text-[13px] font-bold text-foreground/40 dark:text-zinc-300 uppercase tracking-widest ml-1">Thiết bị</Label>
 <Select
 value={formData.device}
 onValueChange={(val) => setFormData(prev => ({ ...prev, device: val }))}
 >
 <SelectTrigger className="h-14 bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl">
 <SelectValue placeholder="Chọn thiết bị" />
 </SelectTrigger>
 <SelectContent className="bg-slate-900 border-white/10 text-foreground dark:text-white rounded-2xl">
 <SelectItem value="desktop">Máy tính (Desktop)</SelectItem>
 <SelectItem value="tablet">Máy tính bảng (Tablet)</SelectItem>
 <SelectItem value="mobile">Điện thoại (Mobile)</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>

 <div className="space-y-3">
 <Label htmlFor="url" className="text-[13px] font-bold text-foreground/40 dark:text-zinc-300 uppercase tracking-widest ml-1">Đường dẫn / Trang lỗi</Label>
 <div className="relative">
 <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20 dark:text-zinc-500" />
 <Input
 id="url"
 value={formData.url}
 onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
 placeholder="https://audiotailoc.com/page-name"
 className="h-14 pl-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-2xl"
 />
 </div>
 </div>

 <div className="space-y-3">
 <Label htmlFor="description" className="text-[13px] font-bold text-foreground/40 dark:text-zinc-300 uppercase tracking-widest ml-1">Mô tả chi tiết</Label>
 <Textarea
 id="description"
 required
 rows={6}
 value={formData.description}
 onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
 placeholder="Vui lòng mô tả các bước để tạo ra lỗi hoặc chi tiết sự cố bạn thấy..."
 className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-2xl p-6 resize-none"
 />
 </div>

 <Button
 type="submit"
 disabled={isSubmitting}
 className="w-full h-16 bg-primary hover:bg-primary/90 text-foreground dark:text-white rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] group"
 >
 {isSubmitting ? (
 <span className="flex items-center gap-2">
 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
 Đang xử lý...
 </span>
 ) : (
 <span className="flex items-center gap-2">
 <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
 Gửi báo cáo lỗi
 </span>
 )}
 </Button>
 </form>
 </div>
 </div>
 </BlurFade>

 {/* Bottom Trust */}
 <BlurFade delay={0.4}>
 <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pt-8 text-foreground/20 dark:text-zinc-500">
 <div className="flex items-center gap-2">
 <Bug className="h-5 w-5" />
 <span className="text-xs font-bold uppercase tracking-widest">Bug Tracked</span>
 </div>
 <div className="flex items-center gap-2">
 <Monitor className="h-5 w-5" />
 <span className="text-xs font-bold uppercase tracking-widest">Cross Platform</span>
 </div>
 <div className="flex items-center gap-2">
 <Smartphone className="h-5 w-5" />
 <span className="text-xs font-bold uppercase tracking-widest">Mobile Tested</span>
 </div>
 </div>
 </BlurFade>
 </div>
 </div>
 </div>
 );
}
