'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProject } from '@/lib/hooks/use-projects';
import {
 ArrowLeft,
 Calendar,
 ExternalLink,
 Play,
 User,
 CheckCircle,
 Music4,
 Sparkles,
 ArrowRight,
 Layers
} from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { cn } from '@/lib/utils';
import { parseImages } from '@/lib/utils';

const parseStringArray = (value: unknown): string[] => {
 if (Array.isArray(value)) {
 return value.map(item => String(item)).filter(Boolean);
 }

 if (typeof value === 'string') {
 try {
 const parsed = JSON.parse(value);
 if (Array.isArray(parsed)) {
 return parsed.map(item => String(item)).filter(Boolean);
 }
 } catch { }
 return value.split(',').map(item => item.trim()).filter(Boolean);
 }
 return [];
};

const formatDate = (dateString: string) => {
 return new Date(dateString).toLocaleDateString('vi-VN', {
 year: 'numeric',
 month: 'long',
 day: 'numeric'
 });
};

export default function ProjectDetailPage() {
 const params = useParams();
 const slug = params.slug as string;
 const { data: project, isLoading, error } = useProject(slug);

 if (isLoading) {
 return (
 <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center p-6 sm:p-12">
 <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center ring-1 ring-primary/20 mb-8 overflow-hidden relative">
 <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-accent/40 animate-spin-slow opacity-50" />
 <Music4 className="w-10 h-10 text-primary relative z-10" />
 </div>
 <div className="text-center space-y-4">
 <h3 className="text-xs font-semibold tracking-wide text-foreground/30 dark:text-zinc-400">Đang tải dự án</h3>
 <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
 <div className="h-full bg-primary animate-progress duration-3000" style={{ width: '70%' }} />
 </div>
 </div>
 </div>
 );
 }

 if (error || !project) {
 return (
 <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
 <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
 <Layers className="w-10 h-10 text-primary/40" />
 </div>
 <h1 className="text-4xl font-black tracking-tight mb-4 leading-none">
 Kiến trúc <span className="text-primary italic">Vắng mặt</span>
 </h1>
 <p className="text-foreground/40 dark:text-zinc-300 max-w-md italic mb-10 leading-relaxed font-medium">
 Dự án này hiện đang trong quá trình bảo mật hoặc đã được lưu trữ nội bộ. Quý khách vui lòng khám phá các kiệt tác khác.
 </p>
 <Link href="/du-an">
 <Button className="bg-primary text-foreground dark:text-white font-semibold tracking-wide px-10 h-14 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
 <ArrowLeft className="mr-3 h-5 w-5" />
 Về Tủ sách Portfolio
 </Button>
 </Link>
 </div>
 );
 }

 const images = parseImages(project.images);
 const technologies = parseStringArray(project.technologies);
 const features = parseStringArray(project.features);

 return (
 <main className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white selection:bg-primary/30 pb-16 md:pb-24">
 {/* Immersive Header Backdrop */}
 <section className="relative pt-16 sm:pt-24 pb-10 sm:pb-16 overflow-hidden min-h-[60vh] flex flex-col justify-end">
 <div className="absolute inset-0 z-0">
 {images[0] || project.coverImage ? (
 <div className="absolute inset-0">
 <Image
 src={images[0] || project.coverImage || '/projects/placeholder-project.svg'}
 alt=""
 fill
 className="object-cover brightness-[0.2]"
 priority
 />
 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
 </div>
 ) : (
 <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black" />
 )}
 <div className="absolute top-0 right-1/4 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-[110px]" />
 <div className="absolute inset-0 bg-studio-grid opacity-20" />
 </div>

 <div className="container mx-auto px-4 md:px-6 relative z-10">
 <BlurFade delay={0.1} inView>
 <div className="max-w-5xl space-y-6 md:space-y-8">
 <nav className="flex items-center gap-4 text-[9px] font-semibold tracking-[0.14em] text-foreground/40 dark:text-zinc-300 mb-6">
 <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
 <span className="w-1 h-1 rounded-full bg-white/20" />
 <Link href="/du-an" className="hover:text-primary transition-colors">Kiệt tác</Link>
 <span className="w-1 h-1 rounded-full bg-white/20" />
 <span className="text-foreground/60 dark:text-zinc-200 truncate max-w-[200px]">{project.name}</span>
 </nav>

 <div className="space-y-6">
 <div className="flex flex-wrap items-center gap-4">
 <Badge className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-wide backdrop-blur-md">
 {project.category || 'Professional Elite'}
 </Badge>
 {project.isFeatured && (
 <Badge className="bg-accent/10 border-accent/20 text-accent px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-wide flex items-center gap-2">
 <Sparkles className="w-3 h-3" />
 Signature Collection
 </Badge>
 )}
 <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
 <div className={cn("w-2 h-2 rounded-full", project.status === 'COMPLETED' ? "bg-green-500" : "bg-primary")} />
 <span className="text-[9px] font-semibold tracking-wide text-foreground/60 dark:text-zinc-200">
 {project.status === 'COMPLETED' ? 'Tuyệt phẩm Hoàn tất' : 'Đang triển khai'}
 </span>
 </div>
 </div>

 <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1] font-display">
 {project.name}
 </h1>

 <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
 <User className="w-6 h-6 text-primary" />
 </div>
 <div>
 <p className="text-[10px] font-semibold tracking-wide text-foreground/30 dark:text-zinc-400">Chủ đầu tư</p>
 <p className="font-bold tracking-tight text-foreground dark:text-white">{project.client || 'Hạng mục Cao cấp'}</p>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
 <Calendar className="w-6 h-6 text-accent" />
 </div>
 <div>
 <p className="text-[10px] font-semibold tracking-wide text-foreground/30 dark:text-zinc-400">Thời điểm</p>
 <p className="font-bold tracking-tight text-foreground dark:text-white">{formatDate(project.createdAt)}</p>
 </div>
 </div>
	 </div>
	 </div>
	 </div>
 </BlurFade>
 </div>
 </section>

 {/* Main Content Grid */}
 <section className="relative py-12 md:py-20">
 <div className="container mx-auto px-4 md:px-6">
 <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
 {/* Left Column: Visual Showcase */}
 <div className="lg:col-span-8 space-y-8 md:space-y-12">
 {/* Main Visualizer */}
 <BlurFade delay={0.2} inView>
 <div className="space-y-8">
 <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl bg-white/5 group">
 {images.length > 0 ? (
 <Image
 src={images[0]}
 alt={project.name}
 fill
 className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
 />
 ) : (
 <div className="w-full h-full flex items-center justify-center">
 <Music4 className="w-24 h-24 text-foreground/5 dark:text-white/5" />
 </div>
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
 </div>

 {/* Interactive Gallery Bar */}
 {images.length > 1 && (
 <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
 {images.map((image, idx) => (
 <button
 key={idx}
 className="relative flex-shrink-0 w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/5 hover:border-primary transition-all duration-500 group"
 >
 <Image src={image} alt="" fill className="object-cover transition-transform group-hover:scale-110" />
 <div className="absolute inset-0 bg-black/20 dark:bg-black/20 group-hover:bg-transparent" />
 </button>
 ))}
 </div>
 )}

 {/* Video Integration */}
 {project.youtubeVideoId && (
 <div className="pt-12">
 <div className="flex items-center gap-4 mb-8">
 <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
 <Play className="w-5 h-5 text-primary fill-current" />
 </div>
 <h3 className="text-2xl font-black tracking-tight">Hé lộ Công trình</h3>
 </div>
 <div className="aspect-video relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black">
 <iframe
 src={`https://www.youtube.com/embed/${project.youtubeVideoId}?autoplay=0&rel=0&modestbranding=1`}
 title={project.name}
 className="w-full h-full"
 allowFullScreen
 />
 </div>
 </div>
 )}
 </div>
 </BlurFade>

 {/* Detailed Methodology Tabs */}
 <BlurFade delay={0.3} inView>
 <div className="pt-16">
 <Tabs defaultValue="description" className="w-full">
 <TabsList className="bg-white/5 border border-white/10 p-1.5 rounded-2xl inline-flex mb-12">
 <TabsTrigger value="description" className="h-12 px-8 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-foreground dark:text-white text-[10px] font-semibold tracking-wide transition-all">Luận cứ kỹ thuật</TabsTrigger>
 <TabsTrigger value="features" className="h-12 px-8 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-foreground dark:text-white text-[10px] font-semibold tracking-wide transition-all">Tính năng cốt lõi</TabsTrigger>
 <TabsTrigger value="gallery" className="h-12 px-8 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-foreground dark:text-white text-[10px] font-semibold tracking-wide transition-all">Biên niên ảnh</TabsTrigger>
 </TabsList>

 <TabsContent value="description" className="mt-0 outline-none">
 <div className="prose prose-invert prose-lg max-w-none prose-p:text-foreground/60 dark:text-zinc-200 prose-p:leading-[1.8] prose-p:italic prose-headings:text-foreground dark:text-white prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-foreground dark:text-white prose-blockquote:border-primary prose-blockquote:bg-white/5 prose-blockquote:p-10 prose-blockquote:rounded-[2rem] prose-blockquote:not-italic prose-blockquote:font-bold">
 {project.description ? (
 <div dangerouslySetInnerHTML={{ __html: project.description }} />
 ) : (
 <p>Thuyết minh kỹ thuật cho tuyệt phẩm này đang được đội ngũ chuyên gia hoàn thiện để truyền tải trọn vẹn giá trị công trình.</p>
 )}
 </div>
 </TabsContent>

 <TabsContent value="features" className="mt-0 outline-none">
 <div className="grid md:grid-cols-2 gap-6">
 {features.length > 0 ? (
 features.map((feature, idx) => (
 <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4 hover:border-accent/40 transition-colors group">
 <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent group-hover:text-foreground dark:text-white transition-all text-accent">
 <CheckCircle className="w-4 h-4" />
 </div>
 <span className="text-sm font-medium text-foreground/80 dark:text-white/80 italic">{feature}</span>
 </div>
 ))
 ) : (
 <p className="text-foreground/40 dark:text-zinc-300 italic">Danh sách tính năng đặc thù đang được cập nhật.</p>
 )}
 </div>
 </TabsContent>

 <TabsContent value="gallery" className="mt-0 outline-none">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {images.map((image, index) => (
 <div key={index} className="aspect-video relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 group cursor-pointer">
 <Image
 src={image}
 alt={`${project.name} - ${index + 1}`}
 fill
 className="object-cover group-hover:scale-105 transition-transform duration-700"
 />
 <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
 <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-slate-950 scale-0 group-hover:scale-100 transition-transform duration-500">
 <Plus className="w-6 h-6" />
 </div>
 </div>
 </div>
 ))}
 </div>
 </TabsContent>
 </Tabs>
 </div>
 </BlurFade>
 </div>

 {/* Right Column: Execution Elite Side panel */}
 <div className="lg:col-span-4 space-y-10">
 <BlurFade delay={0.4} inView>
 <div className="sticky top-32 space-y-10">
 {/* Abstract Insight Card */}
 <Card className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl overflow-hidden relative group">
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
 <CardContent className="p-0 space-y-8 relative z-10">
 <div>
 <p className="text-primary font-semibold tracking-[0.14em] text-[10px] mb-2">Technical Insight</p>
 <h3 className="text-2xl font-black tracking-tight">Hồ sơ Công trình</h3>
 </div>

 <div className="space-y-6">
 <div className="flex justify-between items-center py-4 border-b border-white/5 group-hover:border-white/10 transition-colors">
 <span className="text-[10px] font-semibold tracking-wide text-foreground/30 dark:text-zinc-400">Thời gian thi công</span>
 <span className="text-sm font-bold text-foreground dark:text-white italic">{project.duration || '60 Ngày'}</span>
 </div>
 <div className="flex justify-between items-center py-4 border-b border-white/5 group-hover:border-white/10 transition-colors">
 <span className="text-[10px] font-semibold tracking-wide text-foreground/30 dark:text-zinc-400">Cấp độ Dự án</span>
 <Badge className="bg-accent/10 border-accent/20 text-accent text-[8px] font-semibold tracking-wide px-3">Platinum Elite</Badge>
 </div>
 <div className="flex justify-between items-center py-4 border-b border-white/5 group-hover:border-white/10 transition-colors">
 <span className="text-[10px] font-semibold tracking-wide text-foreground/30 dark:text-zinc-400">Chuẩn Kiểm định</span>
 <span className="text-sm font-bold text-foreground dark:text-white italic">Acoustics ISO 3382</span>
 </div>
 </div>

 {/* Technologies Cloud */}
 {technologies.length > 0 && (
 <div className="pt-4 space-y-4">
 <p className="text-[10px] font-semibold tracking-wide text-foreground/30 dark:text-zinc-400 flex items-center gap-2">
 <Layers className="w-3 h-3 text-primary" />
 Hệ sinh thái Thiết bị
 </p>
 <div className="flex flex-wrap gap-2">
 {technologies.map((tech, idx) => (
 <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-semibold tracking-wide text-foreground/60 dark:text-zinc-200 hover:text-foreground dark:text-white hover:border-primary/40 transition-all cursor-default">
 {tech}
 </span>
 ))}
 </div>
 </div>
 )}

 {/* External Action Bar */}
 <div className="pt-8 space-y-4">
 {project.liveUrl && (
 <Button
 className="w-full h-14 bg-primary text-foreground dark:text-white font-semibold tracking-wide text-[10px] rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
 onClick={() => window.open(project.liveUrl, '_blank')}
 >
 <ExternalLink className="mr-3 h-4 w-4" />
 Chiêm nghiệm Thực tế
 </Button>
 )}
 <Button
 variant="outline"
 className="w-full h-14 bg-white/5 border-white/10 text-foreground dark:text-white font-semibold tracking-wide text-[10px] rounded-2xl hover:bg-white/10 transition-all"
 onClick={() => window.location.href = '#cta'}
 >
 Tư vấn giải pháp tương đương
 </Button>
 </div>
 </CardContent>
 </Card>

 {/* Professional Contact Micro-CTA */}
 <div className="p-8 bg-accent/5 border border-accent/20 rounded-[2rem] space-y-4 relative overflow-hidden">
 <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 blur-3xl rounded-full" />
 <h4 className="text-lg font-black tracking-tight relative z-10">Bắt đầu <span className="text-accent italic">Kiệt tác</span> của bạn</h4>
 <p className="text-[10px] font-medium text-foreground/40 dark:text-zinc-300 leading-relaxed italic relative z-10">Đội ngũ kỹ sư âm học hàng đầu của chúng tôi sẵn sàng đồng hành cùng ý tưởng của bạn.</p>
 <Link href="/lien-he" className="flex items-center gap-3 text-accent font-semibold tracking-wide text-[10px] group relative z-10">
 Kết nối ngay chuyên gia
 <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
 </Link>
 </div>
 </div>
 </BlurFade>
 </div>
 </div>
 </div>
 </section>

 {/* Cross-Sell / Back To Works */}
 <section className="py-24 border-t border-white/5 bg-white/[0.01]">
 <div className="container mx-auto px-6">
 <BlurFade delay={0.5} inView>
 <div className="text-center space-y-12">
 <div className="space-y-4">
 <p className="text-primary font-semibold tracking-[0.16em] text-[10px]">Hành trình Đẳng cấp</p>
 <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic">Mở rộng <span className="text-foreground/40 dark:text-zinc-300">Tầm nhìn</span> Nghệ thuật</h2>
 </div>
 <Link href="/du-an" className="inline-block group">
 <Button variant="outline" className="h-20 px-16 rounded-3xl border-white/10 bg-white/5 text-foreground dark:text-white font-semibold tracking-[0.16em] hover:bg-primary hover:border-primary transition-all duration-500 shadow-2xl">
 <ArrowLeft className="mr-4 h-5 w-5 group-hover:-translate-x-2 transition-transform" />
 Danh sách Kiệt tác Portfolio
 </Button>
 </Link>
 </div>
 </BlurFade>
 </div>
 </section>
 </main>
 );
}

const Plus = ({ className }: { className: string }) => (
 <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14m-7-7v14" />
 </svg>
);
