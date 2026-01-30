'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft, Phone } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center">
                {/* 404 Number with Animation */}
                <div className="relative mb-8">
                    <h1 className="text-[180px] md:text-[240px] font-black text-primary/10 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-full p-8 shadow-2xl shadow-primary/30">
                            <Search className="w-16 h-16" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
                    Không Tìm Thấy Trang
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                    Hãy quay lại trang chủ hoặc liên hệ chúng tôi để được hỗ trợ.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Button asChild size="lg" className="rounded-full shadow-lg">
                        <Link href="/">
                            <Home className="w-5 h-5 mr-2" />
                            Về Trang Chủ
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full">
                        <Link href="/products">
                            <Search className="w-5 h-5 mr-2" />
                            Tìm Sản Phẩm
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" size="lg" className="rounded-full">
                        <Link href="/contact">
                            <Phone className="w-5 h-5 mr-2" />
                            Liên Hệ
                        </Link>
                    </Button>
                </div>

                {/* Quick Links */}
                <div className="border-t border-border/50 pt-8">
                    <p className="text-sm text-muted-foreground mb-4">Có thể bạn muốn tìm:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {[
                            { label: 'Dàn Karaoke', href: '/categories/dan-karaoke' },
                            { label: 'Loa', href: '/categories/loa' },
                            { label: 'Ampli', href: '/categories/ampli' },
                            { label: 'Micro', href: '/categories/micro' },
                            { label: 'Dịch Vụ', href: '/services' },
                            { label: 'Dự Án', href: '/projects' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 bg-card hover:bg-primary/10 border border-border/50 rounded-full text-sm font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="mt-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại trang trước
                </button>
            </div>
        </div>
    );
}
