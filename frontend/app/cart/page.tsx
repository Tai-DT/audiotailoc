'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, RefreshCw, Music4, Sparkles, ChevronLeft } from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import { BlurFade } from '@/components/ui/blur-fade';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
    const { items, updateQuantity, removeItem, totalPrice } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const shippingFee = totalPrice > 500000 ? 0 : 30000;
    const finalTotal = totalPrice + shippingFee;

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-1/4 w-[1000px] h-[1000px] bg-primary/5 blur-[150px] animate-pulse" />
                    <div className="absolute inset-0 bg-studio-grid opacity-20" />
                </div>

                <div className="relative z-10 space-y-12">
                    <BlurFade delay={0.1} inView>
                        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <ShoppingBag className="w-10 h-10 text-primary animate-pulse" />
                        </div>
                    </BlurFade>

                    <BlurFade delay={0.2} inView>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Giỏ hàng <span className="text-foreground/20 dark:text-zinc-500">Trống</span></h1>
                            <p className="text-foreground/40 dark:text-zinc-300 max-w-md mx-auto italic font-medium">Hệ thống của chúng tôi chưa ghi nhận kiệt tác nào trong giỏ hàng của quý khách.</p>
                        </div>
                    </BlurFade>

                    <BlurFade delay={0.3} inView>
                        <Link href="/products">
                            <button className="h-16 px-12 bg-primary text-foreground dark:text-white font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 transition-all shadow-xl shadow-primary/20 flex items-center gap-4 mx-auto">
                                Khai phá Bộ sưu tập
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </BlurFade>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white selection:bg-primary/30">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[1200px] h-[1200px] bg-primary/5 blur-[200px] animate-pulse" />
                <div className="absolute inset-0 bg-studio-grid opacity-10" />
            </div>

            <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 relative z-10">
                {/* Cinematic Header */}
                <BlurFade delay={0.1} inView>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/5 pb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 w-fit">
                                <Music4 className="w-4 h-4 text-primary animate-pulse" />
                                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-foreground/60 dark:text-zinc-200">Selected Collection</span>
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none font-display text-foreground dark:text-white uppercase italic">
                                Giỏ <span className="text-primary italic">Hàng</span>
                            </h1>
                            <p className="text-foreground/40 dark:text-zinc-300 font-medium italic">
                                Đang lưu trữ <span className="text-foreground dark:text-white font-bold">{items.length} tinh hoa</span> âm thanh
                            </p>
                        </div>

                        <Link href="/products" className="w-full md:w-auto">
                            <button className="w-full md:w-auto h-12 md:h-14 px-8 bg-white/5 border border-white/10 text-foreground dark:text-white rounded-xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-4 text-xs">
                                <ChevronLeft className="w-4 h-4" />
                                Tiếp tục lựa chọn
                            </button>
                        </Link>
                    </div>
                </BlurFade>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
                    {/* Cart Items Area */}
                    <div className="lg:col-span-8 space-y-8">
                        <BlurFade delay={0.2} inView>
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] backdrop-blur-3xl shadow-3xl overflow-hidden">
                                {/* Desktop Columns Header */}
                                <div className="hidden md:grid grid-cols-12 gap-8 p-8 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 dark:text-zinc-400">
                                    <div className="col-span-6">Thông tin Sản phẩm</div>
                                    <div className="col-span-3 text-center">Số lượng</div>
                                    <div className="col-span-3 text-right text-primary">Thành tiền</div>
                                </div>

                                {/* Items Iteration */}
                                <div className="divide-y divide-white/5">
                                    {items.map((item) => (
                                        <div key={item.id} className="group p-5 md:p-10 hover:bg-white/[0.02] transition-colors relative">
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                                                {/* Item Visual & Title */}
                                                <div className="col-span-12 md:col-span-6 flex gap-5 md:gap-8">
                                                    <Link href={`/products/${item.id}`} className="relative w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 flex-shrink-0 group-hover:border-primary/50 transition-all duration-500 hover:scale-105">
                                                        <Image
                                                            src={item.image || '/placeholder-product.jpg'}
                                                            alt={item.name}
                                                            fill
                                                            className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    </Link>
                                                    <div className="flex flex-col justify-center space-y-3">
                                                        <div className="space-y-1">
                                                            <Link href={`/products/${item.id}`} className="text-lg md:text-xl font-black text-foreground dark:text-white leading-tight uppercase tracking-tight hover:text-primary transition-colors block font-display">
                                                                {item.name}
                                                            </Link>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 dark:text-zinc-400 italic">
                                                                {item.category || 'High-End Gear'}
                                                            </p>
                                                        </div>
                                                        <div className="md:hidden font-black text-primary text-lg">
                                                            {formatCurrency(item.price)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quantity Management */}
                                                <div className="col-span-6 md:col-span-3 flex items-center md:justify-center">
                                                    <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                            disabled={item.quantity <= 1}
                                                            className="w-10 h-10 flex items-center justify-center text-foreground/40 dark:text-zinc-300 hover:text-foreground dark:text-white disabled:opacity-10 transition-colors"
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </button>
                                                        <div className="w-12 text-center text-sm font-black text-foreground dark:text-white tabular-nums">
                                                            {item.quantity}
                                                        </div>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-10 h-10 flex items-center justify-center text-foreground/40 dark:text-zinc-300 hover:text-foreground dark:text-white transition-colors"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="w-10 h-10 text-primary/40 dark:text-zinc-500 hover:text-primary hover:bg-primary/10 rounded-xl ml-auto md:hidden transition-all flex items-center justify-center border border-primary/10"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>

                                                {/* Pricing & Desktop Actions */}
                                                <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-6 text-right">
                                                    <div>
                                                        <div className="text-xl md:text-2xl font-black text-primary tracking-tighter tabular-nums drop-shadow-2xl">
                                                            {formatCurrency(item.price * item.quantity)}
                                                        </div>
                                                        {item.quantity > 1 && (
                                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 dark:text-zinc-500 mt-1 italic">
                                                                {formatCurrency(item.price)} / Unit
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="w-12 h-12 text-foreground/10 dark:text-white/10 hover:text-primary hover:bg-primary/5 rounded-2xl hidden md:flex items-center justify-center transition-all group/trash"
                                                    >
                                                        <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </BlurFade>

                        {/* Policy Highlights */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <BlurFade delay={0.3} inView>
                                <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex gap-5 md:gap-6 group hover:border-primary/40 transition-colors">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-primary">
                                        <ShieldCheck className="h-6 w-6 md:h-7 md:w-7 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2">
                                        <h4 className="text-xs md:text-sm font-black uppercase tracking-tight">Thanh đường bảo chứng</h4>
                                        <p className="text-[10px] md:text-[11px] text-foreground/40 dark:text-zinc-300 italic leading-relaxed">Sản phẩm chính hãng với tiêu chuẩn bảo hành High-End lên tới 24 tháng.</p>
                                    </div>
                                </div>
                            </BlurFade>
                            <BlurFade delay={0.4} inView>
                                <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex gap-5 md:gap-6 group hover:border-accent/40 transition-colors">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-accent">
                                        <RefreshCw className="h-6 w-6 md:h-7 md:w-7 group-hover:rotate-180 transition-transform duration-1000" />
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2">
                                        <h4 className="text-xs md:text-sm font-black uppercase tracking-tight">Đặc quyền Đổi mới</h4>
                                        <p className="text-[10px] md:text-[11px] text-foreground/40 dark:text-zinc-300 italic leading-relaxed">Hỗ trợ trao đổi, nâng cấp sản phẩm dễ dàng trong vòng 30 ngày sử dụng.</p>
                                    </div>
                                </div>
                            </BlurFade>
                        </div>
                    </div>

                    {/* Sticky Summaries Area */}
                    <div className="lg:col-span-4 lg:relative">
                        <BlurFade delay={0.5} inView>
                            <div className="sticky top-40 space-y-8">
                                <div className="p-6 md:p-10 bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] backdrop-blur-3xl shadow-3xl relative overflow-hidden group">
                                    {/* Accent Glow */}
                                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] -z-10" />

                                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-8 md:mb-10 italic">Tổng đơn <span className="text-primary">Giá trị</span></h2>

                                    <div className="space-y-6 mb-12">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 dark:text-zinc-400 italic">Giá trị thuần</span>
                                            <span className="text-lg font-bold tracking-tighter tabular-nums">{formatCurrency(totalPrice)}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 dark:text-zinc-400 italic">Ủy thác Vận hành</span>
                                            <span className="text-lg font-bold tracking-tighter tabular-nums">
                                                {shippingFee === 0 ? (
                                                    <span className="text-primary flex items-center gap-2">
                                                        <Sparkles className="h-4 w-4 animate-pulse" /> Compliment
                                                    </span>
                                                ) : (
                                                    formatCurrency(shippingFee)
                                                )}
                                            </span>
                                        </div>

                                        <div className="py-6 border-y border-white/5 flex justify-between items-end">
                                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Final Investment</span>
                                            <div className="text-right">
                                                <div className="text-3xl md:text-4xl font-black text-primary tracking-tighter tabular-nums drop-shadow-[0_10px_30px_rgba(220,38,38,0.4)]">
                                                    {formatCurrency(finalTotal)}
                                                </div>
                                                <p className="text-[9px] text-foreground/20 dark:text-zinc-500 italic font-medium mt-1 uppercase tracking-widest">(VAT inclusive)</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <Link href="/checkout" className="block w-full">
                                            <button className="w-full h-16 md:h-20 bg-primary text-foreground dark:text-white font-black uppercase tracking-[0.4em] rounded-[1.2rem] md:rounded-[1.5rem] hover:bg-red-500 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 group/checkout">
                                                Thanh toán
                                                <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-500" />
                                            </button>
                                        </Link>

                                        <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-foreground/20 dark:text-zinc-500">
                                            <ShieldCheck className="w-4 h-4 text-primary/40" />
                                            Encrypted Transaction
                                        </div>
                                    </div>
                                </div>

                                {/* Free Shipping Progress Indicator (Optional but cool) */}
                                {shippingFee > 0 && (
                                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-foreground/40 dark:text-zinc-300 italic">Free Shipping Milestone</span>
                                            <span className="text-primary italic">500k VND</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all duration-1000"
                                                style={{ width: `${Math.min(100, (totalPrice / 500000) * 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-foreground/20 dark:text-zinc-500 italic text-center">
                                            Cần thêm <span className="text-foreground dark:text-white">{formatCurrency(500000 - totalPrice)}</span> để nhận ưu đãi vận chuyển đặc biệt.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </BlurFade>
                    </div>
                </div>
            </div>
        </main>
    );
}
