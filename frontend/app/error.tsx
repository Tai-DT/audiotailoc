'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home, MessageCircle, ShieldAlert } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';


export default function Error({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 useEffect(() => {
 // In a real app, you'd send this to Sentry or LogRocket
 console.error('Application error boundary caught:', error);
 }, [error]);

 return (
 <div className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white flex items-center justify-center p-4 relative overflow-hidden">
 {/* Background Effects */}
 <div className="absolute inset-0 pointer-events-none">
 <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-destructive/10 blur-[150px] animate-pulse" />
 <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
 </div>

 <div className="relative z-10 w-full max-w-xl text-center space-y-8">
 <BlurFade delay={0.1}>
 <div className="inline-flex p-5 rounded-3xl bg-destructive/10 border border-destructive/20 mb-4">
 <ShieldAlert className="h-16 w-16 text-destructive animate-pulse" />
 </div>
 <h1 className="text-4xl md:text-5xl font-black tracking-tight">Hệ thống gặp sự cố</h1>
 <p className="text-foreground/60 dark:text-zinc-200 text-lg max-w-md mx-auto mt-4">
 Đã có lỗi không mong muốn xảy ra. Chúng tôi đang nỗ lực khôi phục trải nghiệm tốt nhất cho bạn.
 </p>
 </BlurFade>

 {process.env.NODE_ENV === 'development' && (
 <BlurFade delay={0.2}>
 <div className="text-left p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md overflow-hidden">
 <p className="text-xs font-bold text-destructive uppercase tracking-widest mb-3 flex items-center gap-2">
 <span className="w-2 h-2 rounded-full bg-destructive animate-ping" />
 Developer Debug Info
 </p>
 <div className="max-h-32 overflow-y-auto scrollbar-hide">
 <p className="text-sm font-mono text-foreground/80 dark:text-white/80 break-all leading-relaxed">
 {error.message}
 </p>
 {error.digest && (
 <p className="text-[10px] font-mono text-foreground/40 dark:text-zinc-300 mt-3">
 Digest ID: {error.digest}
 </p>
 )}
 </div>
 </div>
 </BlurFade>
 )}

 <BlurFade delay={0.3}>
 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
 <Button
 size="lg"
 onClick={reset}
 className="w-full sm:w-auto h-14 px-10 bg-white text-slate-950 hover:bg-white/90 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-white/5"
 >
 <RefreshCcw className="mr-2 h-5 w-5" />
 Thử lại ngay
 </Button>
 <Link href="/" className="w-full sm:w-auto">
 <Button
 variant="outline"
 size="lg"
 className="w-full h-14 px-10 border-white/10 bg-white/5 hover:bg-white/10 text-foreground dark:text-white rounded-2xl backdrop-blur-md transition-all active:scale-95 font-bold"
 >
 <Home className="mr-2 h-5 w-5" />
 Về trang chủ
 </Button>
 </Link>
 </div>
 </BlurFade>

 <BlurFade delay={0.4}>
 <div className="pt-8 flex flex-col items-center gap-4">
 <p className="text-sm text-foreground/40 dark:text-zinc-300">Bạn cần hỗ trợ khẩn cấp?</p>
 <div className="flex items-center gap-6">
 <Link href="/report-issue" className="flex items-center gap-2 text-primary hover:text-primary/80 font-bold transition-all group">
 <AlertTriangle className="h-4 w-4 group-hover:rotate-12 transition-transform" />
 <span>Báo lỗi kỹ thuật</span>
 </Link>
 <span className="w-1 h-1 rounded-full bg-white/10" />
 <Link href="/contact" className="flex items-center gap-2 text-foreground/60 dark:text-zinc-200 hover:text-foreground dark:text-white transition-all">
 <MessageCircle className="h-4 w-4" />
 <span>Liên hệ hỗ trợ</span>
 </Link>
 </div>
 </div>
 </BlurFade>
 </div>
 </div>
 );
}
