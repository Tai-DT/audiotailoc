'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
 Search,
 Eye,
 ThumbsUp,
 BookOpen,
 Filter,
 ChevronRight,
 Music4,
 Sparkles,
 Zap,
 Clock
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBlogArticles, useBlogCategories } from '@/lib/hooks/use-api';
import { BlogArticle } from '@/lib/types';
import { BlurFade } from '@/components/ui/blur-fade';
import { cn } from '@/lib/utils';

export default function BlogNewPage() {
 const [mounted, setMounted] = React.useState(false);
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedCategory, setSelectedCategory] = useState<string>('');

 React.useEffect(() => {
 setMounted(true);
 }, []);

 const { data: articlesData, isLoading: articlesLoading } = useBlogArticles({
 published: true,
 page: 1,
 limit: 20,
 categoryId: selectedCategory || undefined,
 search: searchQuery || undefined,
 });

 const { data: categoriesData } = useBlogCategories({ published: true });

 const articles = articlesData?.data || [];
 const categories = categoriesData?.data || [];
 const isLoading = articlesLoading;

 const handleSearch = (e: React.FormEvent) => {
 e.preventDefault();
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

 const truncateText = (text: string, maxLength: number) => {
 if (text.length <= maxLength) return text;
 return text.substring(0, maxLength) + '...';
 };

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
 <main className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white selection:bg-primary/30 pb-24">
 {/* Cinematic Hero Banner */}
 <section className="relative py-24 md:py-32 overflow-hidden border-b border-white/5">
 <div className="absolute inset-0 z-0">
 <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-[150px] animate-pulse" />
 <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
 <div className="absolute inset-0 bg-studio-grid opacity-20" />
 </div>

 <div className="container mx-auto px-6 relative z-10">
 <BlurFade delay={0.1} inView>
 <div className="flex flex-col items-center text-center space-y-8">
 <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
 <Music4 className="w-4 h-4 text-primary animate-pulse" />
 <span className="text-[10px] uppercase font-black tracking-[0.3em] text-foreground/60 dark:text-zinc-200">Elite Insights</span>
 </div>

 <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1] max-w-5xl">
 Kiến Thức <span className="text-primary italic">Âm Thanh</span><br />
 & <span className="text-accent italic">Tạp Chí</span> Hi-End
 </h1>

 <p className="text-foreground/40 dark:text-zinc-300 text-lg md:text-xl max-w-3xl font-medium leading-relaxed italic">
 Khám phá thế giới âm thanh đỉnh cao qua góc nhìn của các chuyên gia. Hướng dẫn, đánh giá và những câu chuyện về nghệ thuật trình diễn.
 </p>
 </div>
 </BlurFade>
 </div>
 </section>

 <div className="container mx-auto px-6 py-12">
 <div className="flex flex-col lg:flex-row gap-12">
 {/* Main Content */}
 <div className="flex-1">
 {/* Search and Filters Bar */}
 <BlurFade delay={0.2} inView>
 <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 mb-12 backdrop-blur-3xl shadow-2xl overflow-hidden relative group">
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-700" />

 <div className="flex flex-col xl:flex-row gap-6">
 <form onSubmit={handleSearch} className="flex-1 relative group/form">
 <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/20 dark:text-zinc-500 group-focus-within/form:text-primary transition-all z-10" />
 <Input
 type="text"
 placeholder="Tìm kiếm bài viết, hướng dẫn..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="pl-14 pr-6 h-14 bg-white/5 border-white/10 rounded-2xl text-foreground dark:text-white placeholder:text-foreground/10 dark:text-white/10 focus:border-primary/50 transition-all font-medium ring-0 text-md"
 />
 </form>
 <div className="flex gap-3 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide snap-x">
 <Button
 variant="ghost"
 onClick={() => setSelectedCategory('')}
 className={cn(
 "whitespace-nowrap h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all snap-start",
 selectedCategory === ''
 ? "bg-primary text-foreground dark:text-white shadow-lg shadow-primary/25"
 : "hover:bg-white/10 text-foreground/60 dark:text-zinc-200"
 )}
 >
 Tất cả
 </Button>
 {categories.slice(0, 5).map((category) => (
 <Button
 key={category.id}
 variant="ghost"
 onClick={() => setSelectedCategory(category.id)}
 className={cn(
 "whitespace-nowrap h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all snap-start",
 selectedCategory === category.id
 ? "bg-primary text-foreground dark:text-white shadow-lg shadow-primary/25"
 : "hover:bg-white/10 text-foreground/60 dark:text-zinc-200"
 )}
 >
 {category.name}
 </Button>
 ))}
 </div>
 </div>
 </div>
 </BlurFade>

 {/* Articles Grid */}
 {isLoading ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {[...Array(4)].map((_, i) => (
 <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] h-[500px] animate-pulse" />
 ))}
 </div>
 ) : articles.length === 0 ? (
 <div className="text-center py-32 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl">
 <div className="relative inline-block mb-8">
 <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
 <BookOpen className="h-20 w-20 text-foreground/10 dark:text-white/10 relative z-10 mx-auto" />
 </div>
 <h3 className="text-3xl font-black tracking-tight mb-4 uppercase">
 Chưa có kiệt tác nào
 </h3>
 <p className="text-foreground/40 dark:text-zinc-300 max-w-sm mx-auto font-medium italic">
 Chúng tôi đang biên soạn những nội dung chất lượng nhất. Hãy quay lại sau nhé!
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {articles.map((article: BlogArticle, idx: number) => (
 <BlurFade key={article.id} delay={0.1 * idx} inView>
 <Card className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(220,38,38,0.3)] hover:-translate-y-2 flex flex-col h-full">
 <div className="relative aspect-[16/10] overflow-hidden">
 {article.imageUrl ? (
 <Image
 src={article.imageUrl}
 alt={article.title}
 fill
 className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
 />
 ) : (
 <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
 <Music4 className="h-20 w-20 text-foreground/5 dark:text-white/5 group-hover:text-primary/20 transition-colors" />
 </div>
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

 <div className="absolute top-6 left-6">
 <Badge className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md", getCategoryColor(article.category?.name || 'Uncategorized'))}>
 {article.category?.name || 'Uncategorized'}
 </Badge>
 </div>

 {article.featured && (
 <div className="absolute top-6 right-6">
 <div className="bg-accent/20 border border-accent/30 text-accent p-2 rounded-full backdrop-blur-md">
 <Sparkles className="w-4 h-4 animate-pulse" />
 </div>
 </div>
 )}
 </div>

 <CardContent className="p-8 flex flex-col flex-1 space-y-6">
 <div className="flex items-center gap-4 text-foreground/40 dark:text-zinc-300 text-[10px] font-black uppercase tracking-widest">
 <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
 <Clock className="w-3 h-3 text-primary" />
 <span>{article.publishedAt ? format(new Date(article.publishedAt), 'dd MMM, yyyy', { locale: vi }) : 'Sắp ra mắt'}</span>
 </div>
 <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
 <Eye className="w-3 h-3 text-accent" />
 <span>{article.viewCount} Lượt xem</span>
 </div>
 </div>

 <h3 className="text-2xl font-black text-foreground dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-[1.2] font-display">
 <Link href={`/blog/${article.slug}`}>
 {article.title}
 </Link>
 </h3>

 {article.excerpt && (
 <p className="text-foreground/40 dark:text-zinc-300 font-medium italic line-clamp-2 text-sm leading-relaxed">
 {truncateText(article.excerpt, 150)}
 </p>
 )}

 <div className="pt-6 mt-auto border-t border-white/5 flex items-center justify-between">
 <Link
 href={`/blog/${article.slug}`}
 className="group/link flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary hover:text-foreground dark:text-white transition-all"
 >
 <span>Khám phá ngay</span>
 <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover/link:bg-primary group-hover/link:border-primary transition-all scale-90 group-hover/link:scale-100">
 <ChevronRight className="w-4 h-4 text-primary group-hover/link:text-foreground dark:text-white" />
 </div>
 </Link>

 <div className="flex items-center gap-1.5 text-foreground/20 dark:text-zinc-500">
 <ThumbsUp className="w-3 h-3" />
 <span className="text-[10px] font-black">{article.likeCount}</span>
 </div>
 </div>
 </CardContent>
 </Card>
 </BlurFade>
 ))}
 </div>
 )}

 {/* Pagination Redesign */}
 {articlesData && articlesData.pagination.totalPages > 1 && (
 <div className="flex flex-col items-center gap-8 mt-16">
 <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
 <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl border-white/10 bg-white/5 text-foreground dark:text-white hover:bg-white/10 font-black uppercase tracking-[0.2em] italic text-xs">
 Xem thêm tâm đắc
 </Button>
 </div>
 )}
 </div>

 {/* Sidebar - Premium Refinement */}
 <div className="lg:w-96 space-y-10">
 {/* Categories Card */}
 <BlurFade delay={0.3} inView>
 <Card className="bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl overflow-hidden shadow-2xl">
 <CardHeader className="pb-4 border-b border-white/10 bg-white/5">
 <CardTitle className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.3em]">
 <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
 <Filter className="h-4 w-4 text-primary" />
 </div>
 Chuyên mục
 </CardTitle>
 </CardHeader>
 <CardContent className="p-6">
 <div className="space-y-3">
 <Button
 variant="ghost"
 onClick={() => setSelectedCategory('')}
 className={cn(
 "w-full justify-between h-12 rounded-xl px-5 text-[10px] font-black uppercase tracking-widest transition-all",
 selectedCategory === '' ? "bg-primary text-foreground dark:text-white shadow-lg shadow-primary/20" : "hover:bg-white/10 text-foreground/60 dark:text-zinc-200"
 )}
 >
 <span>Tất cả bài viết</span>
 <Zap className={cn("w-3 h-3", selectedCategory === '' ? "text-foreground dark:text-white" : "text-primary/40")} />
 </Button>
 {categories.map((category) => (
 <Button
 key={category.id}
 variant="ghost"
 onClick={() => setSelectedCategory(category.id)}
 className={cn(
 "w-full justify-between h-12 rounded-xl px-5 text-[10px] font-black uppercase tracking-widest transition-all",
 selectedCategory === category.id ? "bg-primary text-foreground dark:text-white shadow-lg shadow-primary/20" : "hover:bg-white/10 text-foreground/60 dark:text-zinc-200"
 )}
 >
 <span className="truncate">{category.name}</span>
 {category._count && (
 <span className={cn("px-2 py-0.5 rounded-md text-[8px] font-black border", selectedCategory === category.id ? "bg-white/20 border-white/30" : "bg-white/5 border-white/10")}>
 {category._count.articles}
 </span>
 )}
 </Button>
 ))}
 </div>
 </CardContent>
 </Card>
 </BlurFade>

 {/* Popular Articles - Cinematic Style */}
 <BlurFade delay={0.4} inView>
 <Card className="bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl overflow-hidden shadow-2xl">
 <CardHeader className="pb-4 border-b border-white/10 bg-white/5">
 <CardTitle className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.3em]">
 <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
 <ThumbsUp className="h-4 w-4 text-accent" />
 </div>
 Tâm điểm
 </CardTitle>
 </CardHeader>
 <CardContent className="p-6">
 <div className="space-y-6">
 {articles.slice(0, 5).map((article: BlogArticle) => (
 <div key={article.id} className="group/item flex gap-4 items-center">
 <div className="relative w-20 h-20 bg-slate-900 rounded-2xl flex-shrink-0 overflow-hidden border border-white/10 group-hover/item:border-primary/50 transition-all duration-500">
 {article.imageUrl ? (
 <Image
 src={article.imageUrl}
 alt={article.title}
 fill
 className="object-cover group-hover/item:scale-110 transition-transform duration-700"
 />
 ) : (
 <div className="w-full h-full flex items-center justify-center">
 <BookOpen className="h-6 w-6 text-foreground/10 dark:text-white/10" />
 </div>
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
 </div>
 <div className="flex-1 min-w-0 space-y-2">
 <h4 className="font-bold text-xs line-clamp-2 leading-tight group-hover/item:text-primary transition-colors">
 <Link href={`/blog/${article.slug}`}>
 {article.title}
 </Link>
 </h4>
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-foreground/40 dark:text-zinc-300 group-hover/item:text-accent transition-colors">
 <Eye className="h-3 w-3" />
 <span>{article.viewCount} Lượt</span>
 </div>
 <div className="w-1 h-1 rounded-full bg-white/10" />
 <div className="text-[9px] font-black text-foreground/20 dark:text-zinc-500">
 #{articles.indexOf(article) + 1}
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>
 </BlurFade>

 {/* Newsletter CTA Inside Sidebar */}
 <BlurFade delay={0.5} inView>
 <div className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-primary/5 to-accent/5 border border-primary/20 overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
 <div className="relative z-10 space-y-4">
 <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-xl shadow-primary/20 group hover:rotate-12 transition-transform">
 <Music4 className="w-6 h-6 text-foreground dark:text-white" />
 </div>
 <h4 className="text-xl font-black uppercase tracking-tight">Audio V.I.P List</h4>
 <p className="text-foreground/40 dark:text-zinc-300 text-xs font-medium italic leading-relaxed">
 Đăng ký nhận những bản tin về thiết bị mới nhất và các sự kiện âm thanh đẳng cấp.
 </p>
 <div className="pt-4 flex gap-2">
 <Input className="bg-white/5 border-white/10 h-10 rounded-xl text-xs" placeholder="Email của bạn..." />
 <Button size="icon" className="h-10 w-10 bg-primary rounded-xl flex-shrink-0">
 <ChevronRight className="w-4 h-4 text-foreground dark:text-white" />
 </Button>
 </div>
 </div>
 </div>
 </BlurFade>
 </div>
 </div>
 </div>
 </main>
 );
}
