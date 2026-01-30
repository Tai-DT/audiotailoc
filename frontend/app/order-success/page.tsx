'use client';

import React, { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
 CheckCircle,
 XCircle,
 Clock,
 Home,
 ShoppingBag,
 Sparkles,
 Music4,
 Mail,
 Phone,
 ArrowRight,
 Truck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/providers/cart-provider';
import { useContactInfo } from '@/lib/hooks/use-contact-info';
import { BlurFade } from '@/components/ui/blur-fade';
import { cn, formatCurrency } from '@/lib/utils';

interface PaymentStatus {
 status: string;
 orderId?: string;
 transactionId?: string;
 amount?: number;
 currency?: string;
 createdAt?: string;
 completedAt?: string;
 estimatedDelivery?: string;
}

function OrderSuccessContent() {
 const searchParams = useSearchParams();
 const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
 const { clearCart } = useCart();
 const cartClearedRef = useRef(false);
 const { data: contactInfo } = useContactInfo();
 const hotlineDisplay = contactInfo?.phone?.display || contactInfo?.phone?.hotline || '';
 const contactEmail = contactInfo?.email || '';

 const orderId = searchParams.get('orderId');
 const rawPaymentMethod = searchParams.get('method');
 const paymentMethod = rawPaymentMethod === 'cos' ? 'cod' : rawPaymentMethod;

 const checkPaymentStatus = useCallback(async () => {
 if (!orderId || !paymentMethod) return;

 try {
 const response = await fetch(`/api/payment/status?orderId=${orderId}&paymentMethod=${paymentMethod}`);
 const result = await response.json();

 if (result.success) {
 setPaymentStatus(result.status);

 if ((result.status.status === 'COMPLETED' || paymentMethod === 'cod') && !cartClearedRef.current) {
 clearCart();
 cartClearedRef.current = true;
 }

 if (result.status.status === 'COMPLETED') {
 toast.success('Giao dịch thành công!');
 } else if (result.status.status === 'FAILED') {
 toast.error('Giao dịch chưa hoàn tất');
 }
 }
 } catch (error) {
 console.error('Error checking payment status:', error);
 } finally {
 // No-op: status updates are reflected via paymentStatus state.
 }
 }, [orderId, paymentMethod, clearCart]);

 useEffect(() => {
 if (orderId && paymentMethod) {
 checkPaymentStatus();
 }
 }, [orderId, paymentMethod, checkPaymentStatus]);

 const getStatusVisuals = (status: string) => {
 switch (status.toLowerCase()) {
 case 'completed':
 case 'success':
 return {
 icon: CheckCircle,
 color: 'text-primary',
 bg: 'bg-primary/10',
 border: 'border-primary/20',
 label: 'Giao dịch Thành công',
 desc: 'Hệ thống đã nhận ủy thác đơn hàng của bạn.'
 };
 case 'failed':
 case 'error':
 return {
 icon: XCircle,
 color: 'text-red-500',
 bg: 'bg-red-500/10',
 border: 'border-red-500/20',
 label: 'Giao dịch Thất bại',
 desc: 'Vui lòng kiểm tra lại phương thức thanh toán.'
 };
 case 'pending':
 case 'processing':
 default:
 return {
 icon: Clock,
 color: 'text-accent',
 bg: 'bg-accent/10',
 border: 'border-accent/20',
 label: 'Đang Xử lý',
 desc: 'Hệ thống đang đồng bộ dữ liệu thanh toán.'
 };
 }
 };

 const status = paymentStatus?.status || (paymentMethod === 'cod' ? 'COMPLETED' : 'PENDING');
 const visuals = getStatusVisuals(status);

 return (
 <main className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white selection:bg-primary/30 flex flex-col items-center justify-center p-6 relative overflow-hidden">
 {/* Background Decor */}
 <div className="absolute inset-0 z-0 pointer-events-none">
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] animate-pulse" />
 <div className="absolute inset-0 bg-studio-grid opacity-15" />
 </div>

 <div className="container max-w-2xl relative z-10 py-12">
 <BlurFade delay={0.1} inView>
 <div className="text-center space-y-12">
 {/* Celebration Icon */}
 <div className="relative inline-block group">
 <div className={cn(
 "w-32 h-32 rounded-[2.5rem] flex items-center justify-center border-2 transition-all duration-700 shadow-2xl relative z-10",
 visuals.bg, visuals.border, visuals.color
 )}>
 <visuals.icon className="w-14 h-14 group-hover:scale-125 transition-transform" />
 {status === 'COMPLETED' && (
 <>
 <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-accent animate-pulse" />
 <Sparkles className="absolute -bottom-4 -left-4 w-6 h-6 text-accent animate-bounce" />
 </>
 )}
 </div>
 <div className={cn("absolute inset-0 blur-3xl opacity-40 group-hover:opacity-60 transition-opacity", visuals.bg)} />
 </div>

 <div className="space-y-4">
 <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
 {visuals.label.split(' ')[0]} <span className="text-primary">{visuals.label.split(' ')[1]}</span>
 </h1>
 <p className="text-foreground/40 dark:text-zinc-300 font-medium italic max-w-md mx-auto">{visuals.desc}</p>
 </div>

 {/* Order Detail Card */}
 <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-3xl text-left space-y-8 relative overflow-hidden">
 <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

 <div className="flex justify-between items-end border-b border-white/5 pb-8">
 <div className="space-y-1">
 <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 dark:text-zinc-400">Order Identifier</p>
 <p className="text-xl font-black text-foreground dark:text-white tracking-tight">#{orderId}</p>
 </div>
 <div className="text-right space-y-1">
 <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 dark:text-zinc-400">Protocol</p>
 <p className="text-xs font-black text-primary uppercase italic">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Digital Transfer'}</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-8">
 {paymentStatus?.amount && (
 <div className="space-y-1">
 <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 dark:text-zinc-400 italic">Total Value</p>
 <p className="text-lg font-black text-foreground dark:text-white tabular-nums tracking-tighter">{formatCurrency(paymentStatus.amount)}</p>
 </div>
 )}
 {paymentStatus?.createdAt && (
 <div className="space-y-1">
 <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 dark:text-zinc-400 italic">Registration Time</p>
 <p className="text-sm font-bold text-foreground/80 dark:text-white/80">{new Date(paymentStatus.createdAt).toLocaleDateString('vi-VN')}</p>
 </div>
 )}
 {paymentStatus?.estimatedDelivery && (
 <div className="space-y-1 col-span-2 p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-6">
 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
 <Truck className="w-5 h-5" />
 </div>
 <div>
 <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 dark:text-zinc-400 mb-1">Estimated Arrival</p>
 <p className="text-sm font-bold text-foreground dark:text-white italic">
 Dự kiến giao hàng: <span className="text-primary">{new Date(paymentStatus.estimatedDelivery).toLocaleDateString('vi-VN')}</span>
 </p>
 </div>
 </div>
 )}
 </div>

 {/* Status Messages */}
 {status === 'COMPLETED' && (
 <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-5">
 <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
 <p className="text-[11px] text-foreground/40 dark:text-zinc-300 italic leading-relaxed">
 Kiệt tác của bạn đang được các chuyên gia của chúng tôi chuẩn bị.
 Quý khách sẽ sớm nhận được thông báo hành chặng vận chuyển.
 </p>
 </div>
 )}
 </div>

 {/* Actions */}
 <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
 <Link href="/">
 <button className="h-14 px-10 bg-white text-slate-950 font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all flex items-center gap-4 text-xs italic">
 <Home className="w-4 h-4" />
 Về Trang chủ
 </button>
 </Link>
 <Link href="/products">
 <button className="h-14 px-10 bg-white/5 border border-white/10 text-foreground dark:text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center gap-4 text-xs italic">
 <ShoppingBag className="w-4 h-4" />
 Tiếp tục Trải nghiệm
 <ArrowRight className="w-4 h-4" />
 </button>
 </Link>
 </div>

 {/* Footer Contact */}
 <div className="pt-8 text-center space-y-3 opacity-30 hover:opacity-100 transition-opacity duration-700">
 <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">Artisan Support Network</p>
 <div className="flex items-center justify-center gap-6 text-[11px] font-medium text-foreground/60 dark:text-zinc-200">
 <span className="flex items-center gap-2 italic"><Mail className="w-3 h-3 text-primary" /> {contactEmail}</span>
 <span className="flex items-center gap-2 italic"><Phone className="w-3 h-3 text-primary" /> {hotlineDisplay}</span>
 </div>
 </div>
 </div>
 </BlurFade>
 </div>
 </main>
 );
}

export default function OrderSuccessPage() {
 return (
 <Suspense fallback={
 <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center p-12">
 <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center animate-pulse mb-6">
 <Music4 className="w-8 h-8 text-primary" />
 </div>
 <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
 <div className="h-full bg-primary animate-progress" style={{ width: '40%' }} />
 </div>
 </div>
 }>
 <OrderSuccessContent />
 </Suspense>
 );
}
