'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import {
 Calendar,
 Eye,
 ThumbsUp,
 ArrowLeft,
 Share2,
 User,
 Clock,
 Sparkles,
 ChevronRight,
 Music4
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBlogArticleBySlug, useBlogArticles } from '@/lib/hooks/use-api';
import { BlogArticle } from '@/lib/types';
import { BlogStructuredData } from '@/components/seo/blog-article-structured-data';
import { sanitizeProseHtml } from '@/lib/utils/sanitize';
import { BlurFade } from '@/components/ui/blur-fade';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = React.use(params);
 const { data: article, isLoading } = useBlogArticleBySlug(slug);

 // Fetch related articles from same category
 const { data: relatedData } = useBlogArticles({
 categoryId: article?.categoryId,
 limit: 4,
 published: true
 });

 // Filter out current article from related
 const relatedArticles = (relatedData?.data || []).filter(
 (a: BlogArticle) => a.slug !== slug
 ).slice(0, 3);

 if (isLoading) {
 return (
 <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center gap-8">
 <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center animate-pulse">
 <Music4 className="w-10 h-10 text-primary" />
 </div>
 <div className="text-center space-y-2">
 <p className="text-xs font-black uppercase tracking-[0.5em] text-foreground/20 dark:text-zinc-500">Loading Article</p>
 <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
 <div className="h-full bg-primary animate-progress" style={{ width: '60%' }} />
 </div>
 </div>
 </div>
 );
 }

 if (!article) {
 notFound();
 }

 const readingTime = Math.ceil(article.content.split(' ').length / 200);

 const handleShare = async () => {
 if (navigator.share) {
 try {
 await navigator.share({
 title: article.title,
 text: article.excerpt || article.title,
 url: window.location.href,
 });
 } catch (err) {
 console.error('Share failed:', err);
 navigator.clipboard.writeText(window.location.href);
 toast.success('Đã sao chép link liên kết');
 }
 } else {
 navigator.clipboard.writeText(window.location.href);
 toast.success('Đã sao chép link liên kết');
 }
 };

 const getCategoryColor = (categoryName: string) => {
 const colors: Record<string, string> = {
 'Hướng dẫn': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
 'Chính sách': 'bg-green-500/10 text-green-400 border-green-500/20',
 'Kiến thức': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
 'Tin tức': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
 'Sản phẩm': 'bg-primary/10 text-primary border-primary/20',
 };
 return colors[categoryName] || 'bg-white/5 text-foreground/60 dark:text-zinc-200 border-white/10';
 };

 return (
 <main className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white selection:bg-primary/30 relative">
 <BlogStructuredData article={article} />

 {/* Article Hero Header */}
 <section className="relative pt-32 pb-20 overflow-hidden">
 {/* Cinematic Backdrop */}
 <div className="absolute inset-0 z-0">
 <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] animate-pulse" />
 <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
 <div className="absolute inset-0 bg-studio-grid opacity-10" />
 {article.imageUrl && (
 <div className="absolute inset-0 w-full h-full opacity-10 blur-3xl scale-110 grayscale pointer-events-none">
 <Image src={article.imageUrl} alt="" fill className="object-cover" />
 </div>
 )}
 </div>

 <div className="container mx-auto px-6 relative z-10">
 <BlurFade delay={0.1} inView>
 <div className="max-w-4xl mx-auto space-y-8">
 <Link
 href="/blog"
 className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 dark:text-zinc-300 hover:text-primary transition-all mb-8"
 >
 <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all">
 <ArrowLeft className="h-3 w-3 text-foreground dark:text-white" />
 </div>
 <span>Quay lại tạp chí</span>
 </Link>

 <div className="flex flex-wrap items-center gap-4">
 <Badge className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md", getCategoryColor(article.category?.name || 'Uncategorized'))}>
 {article.category?.name || 'Uncategorized'}
 </Badge>
 {article.featured && (
 <Badge className="bg-accent/10 border-accent/20 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
 <Sparkles className="w-3 h-3" />
 Phiên bản đặc biệt
 </Badge>
 )}
 </div>

 <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] font-display">
 {article.title}
 </h1>

 {article.excerpt && (
 <p className="text-foreground/40 dark:text-zinc-300 text-xl font-medium italic leading-relaxed border-l-2 border-primary/30 pl-6">
 {article.excerpt}
 </p>
 )}

 <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/5">
 <div className="flex items-center gap-10">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
 <User className="h-6 w-6 text-foreground/20 dark:text-zinc-500" />
 </div>
 <div>
 <p className="text-[10px] font-black uppercase tracking-widest text-primary">Biên tập bởi</p>
 <p className="font-bold text-foreground dark:text-white tracking-wide">{article.author?.name || 'Audio Tài Lộc'}</p>
 </div>
 </div>

 <div className="hidden sm:flex items-center gap-6 text-foreground/30 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
 <div className="flex items-center gap-2">
 <Clock className="w-4 h-4 text-primary" />
 <span>{readingTime} Phút đọc</span>
 </div>
 <div className="flex items-center gap-2">
 <Calendar className="w-4 h-4 text-accent" />
 <span>
 {article.publishedAt
 ? format(new Date(article.publishedAt), 'dd MMM, yyyy', { locale: vi })
 : format(new Date(article.createdAt), 'dd MMM, yyyy', { locale: vi })
 }
 </span>
 </div>
 </div>
 </div>

 <Button
 variant="outline"
 className="h-12 px-6 rounded-xl border-white/10 bg-white/5 text-foreground dark:text-white hover:bg-white/10 font-black uppercase text-[10px] tracking-widest"
 onClick={handleShare}
 >
 <Share2 className="mr-3 h-4 w-4 text-primary" />
 Lan tỏa kiến thức
 </Button>
 </div>
 </div>
 </BlurFade>
 </div>
 </section>

 {/* Article Content Section */}
 <section className="relative pb-32 z-10">
 <div className="container mx-auto px-6">
 <BlurFade delay={0.2} inView>
 <div className="max-w-4xl mx-auto space-y-12">
 {/* Main Featured Image */}
 {article.imageUrl && (
 <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl group">
 <Image
 src={article.imageUrl}
 alt={article.title}
 fill
 className="object-cover group-hover:scale-105 transition-transform duration-1000"
 priority
 />
 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
 </div>
 )}

 {/* Prose Content */}
 <div className="prose prose-invert prose-lg max-w-none prose-p:text-foreground/60 dark:text-zinc-200 prose-p:leading-[1.8] prose-headings:text-foreground dark:text-white prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-foreground dark:text-white prose-em:text-accent prose-img:rounded-[2rem] prose-img:border prose-img:border-white/10 prose-blockquote:border-primary prose-blockquote:bg-white/5 prose-blockquote:p-8 prose-blockquote:rounded-2xl shadow-sm">
 <div
 dangerouslySetInnerHTML={{ __html: sanitizeProseHtml(article.content) }}
 className="leading-relaxed"
 />
 </div>

 <div className="pt-20 border-t border-white/5 flex flex-col items-center gap-8">
 <div className="flex items-center gap-4 p-2 bg-white/5 border border-white/10 rounded-full">
 <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full hover:bg-white/10">
 <ThumbsUp className="w-5 h-5 text-primary" />
 </Button>
 <span className="text-xs font-black uppercase tracking-widest pr-4 border-r border-white/10">Tâm đắc ({article.likeCount})</span>
 <span className="text-xs font-black uppercase tracking-widest pl-2 pr-6">{article.viewCount} Chuyên gia đã đọc</span>
 </div>
 </div>
 </div>
 </BlurFade>
 </div>
 </section>

 {/* Related Content Section */}
 {relatedArticles.length > 0 && (
 <section className="relative py-24 bg-white/[0.02] border-t border-white/5">
 <div className="container mx-auto px-6">
 <BlurFade delay={0.3} inView>
 <div className="max-w-6xl mx-auto">
 <div className="flex items-center justify-between mb-12">
 <div>
 <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-2">Chủ đề liên quan</p>
 <h2 className="text-3xl font-black tracking-tight uppercase">Khám phá <span className="text-foreground/40 dark:text-zinc-300 italic">Tiếp tục</span></h2>
 </div>
 <Link href="/blog" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/40 dark:text-zinc-300 hover:text-foreground dark:text-white transition-all">
 Xem tất cả
 <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all">
 <ChevronRight className="w-3 h-3 text-foreground dark:text-white" />
 </div>
 </Link>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {relatedArticles.map((relatedArticle: BlogArticle) => (
 <Card key={relatedArticle.id} className="group bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all duration-500 flex flex-col h-full">
 <div className="relative aspect-[16/9] overflow-hidden">
 {relatedArticle.imageUrl ? (
 <Image
 src={relatedArticle.imageUrl}
 alt={relatedArticle.title}
 fill
 className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
 />
 ) : (
 <div className="w-full h-full bg-slate-900 flex items-center justify-center">
 <Music4 className="h-10 w-10 text-foreground/10 dark:text-white/10" />
 </div>
 )}
 </div>
 <CardContent className="p-6 flex flex-col flex-1">
 <h3 className="text-lg font-black text-foreground dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-4">
 <Link href={`/blog/${relatedArticle.slug}`}>
 {relatedArticle.title}
 </Link>
 </h3>
 <div className="mt-auto flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-foreground/20 dark:text-zinc-500">
 <span>
 {relatedArticle.publishedAt
 ? format(new Date(relatedArticle.publishedAt), 'dd MMM, yyyy', { locale: vi })
 : format(new Date(relatedArticle.createdAt), 'dd MMM, yyyy', { locale: vi })
 }
 </span>
 <div className="flex items-center gap-1">
 <Eye className="w-3 h-3" />
 <span>{relatedArticle.viewCount}</span>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 </div>
 </BlurFade>
 </div>
 </section>
 )}

 {/* Back to Home CTA */}
 <section className="py-24 text-center">
 <div className="container mx-auto px-6">
 <BlurFade delay={0.4} inView>
 <div className="max-w-xl mx-auto space-y-8">
 <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
 <Music4 className="w-10 h-10 text-primary" />
 </div>
 <h3 className="text-3xl font-black uppercase tracking-tight italic">Lan tỏa niềm đam mê</h3>
 <p className="text-foreground/40 dark:text-zinc-300 font-medium italic">Tiếp tục hành trình khám phá những thiết bị âm thanh đỉnh cao cùng Audio Tài Lộc.</p>
 <Link href="/blog#list" className="inline-block pt-4">
 <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-foreground dark:text-white font-black uppercase tracking-[0.2em] transition-all">
 Về tủ sách kiến thức
 </Button>
 </Link>
 </div>
 </BlurFade>
 </div>
 </section>
 </main>
 );
}
