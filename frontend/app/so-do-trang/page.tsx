'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Map,
    Home,
    ShoppingBag,
    Folder,
    Wrench,
    BookOpen,
    FileText,
    Users,
    Phone,
    ChevronRight
} from 'lucide-react';

interface SitemapSection {
    title: string;
    icon: React.ReactNode;
    links: Array<{ label: string; href: string }>;
}

const sitemapData: SitemapSection[] = [
    {
        title: 'Trang Chính',
        icon: <Home className="w-5 h-5" />,
        links: [
            { label: 'Trang chủ', href: '/' },
            { label: 'Giới thiệu', href: '/about' },
            { label: 'Liên hệ', href: '/contact' },
            { label: 'Tin tức', href: '/news' },
            { label: 'FAQ', href: '/faq' },
        ],
    },
    {
        title: 'Sản Phẩm',
        icon: <ShoppingBag className="w-5 h-5" />,
        links: [
            { label: 'Tất cả sản phẩm', href: '/products' },
            { label: 'Danh mục', href: '/categories' },
            { label: 'Thương hiệu', href: '/brands' },
            { label: 'Khuyến mãi', href: '/deals' },
            { label: 'So sánh sản phẩm', href: '/compare' },
            { label: 'Tìm kiếm', href: '/search' },
        ],
    },
    {
        title: 'Danh Mục',
        icon: <Folder className="w-5 h-5" />,
        links: [
            { label: 'Dàn Karaoke', href: '/categories/dan-karaoke' },
            { label: 'Loa', href: '/categories/loa' },
            { label: 'Ampli', href: '/categories/ampli' },
            { label: 'Micro', href: '/categories/micro' },
            { label: 'Mixer & Vang số', href: '/categories/mixer-vang-so' },
            { label: 'Phụ kiện', href: '/categories/phu-kien' },
        ],
    },
    {
        title: 'Dịch Vụ',
        icon: <Wrench className="w-5 h-5" />,
        links: [
            { label: 'Tất cả dịch vụ', href: '/services' },
            { label: 'Dự án', href: '/projects' },
            { label: 'Đặt lịch dịch vụ', href: '/service-booking' },
            { label: 'Hỗ trợ kỹ thuật', href: '/technical-support' },
            { label: 'Báo cáo sự cố', href: '/report-issue' },
        ],
    },
    {
        title: 'Hướng Dẫn & Hỗ Trợ',
        icon: <BookOpen className="w-5 h-5" />,
        links: [
            { label: 'Hướng dẫn sử dụng', href: '/guides' },
            { label: 'Blog', href: '/blog' },
            { label: 'Hỗ trợ', href: '/support' },
            { label: 'Theo dõi đơn hàng', href: '/track-order' },
            { label: 'Đăng ký nhận tin', href: '/newsletter' },
        ],
    },
    {
        title: 'Chính Sách',
        icon: <FileText className="w-5 h-5" />,
        links: [
            { label: 'Chính sách bảo hành', href: '/warranty' },
            { label: 'Chính sách vận chuyển', href: '/shipping' },
            { label: 'Chính sách đổi trả', href: '/return-policy' },
            { label: 'Chính sách bảo mật', href: '/privacy' },
            { label: 'Điều khoản sử dụng', href: '/terms' },
        ],
    },
    {
        title: 'Tài Khoản',
        icon: <Users className="w-5 h-5" />,
        links: [
            { label: 'Đăng nhập', href: '/auth/login' },
            { label: 'Đăng ký', href: '/auth/register' },
            { label: 'Tài khoản của tôi', href: '/profile' },
            { label: 'Giỏ hàng', href: '/cart' },
            { label: 'Wishlist', href: '/wishlist' },
            { label: 'Đơn hàng', href: '/orders' },
        ],
    },
    {
        title: 'Liên Hệ',
        icon: <Phone className="w-5 h-5" />,
        links: [
            { label: 'Liên hệ', href: '/contact' },
            { label: 'Hệ thống showroom', href: '/stores' },
            { label: 'Đánh giá khách hàng', href: '/reviews' },
            { label: 'Nhận xét khách hàng', href: '/testimonials' },
        ],
    },
];

export default function SitemapPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
            <div className="container max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30">
                        <Map className="w-3 h-3 mr-1" />
                        Sitemap
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                        Sơ Đồ <span className="text-primary">Trang Web</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Danh sách tất cả các trang trên website Audio Tài Lộc để bạn dễ dàng điều hướng.
                    </p>
                </div>

                {/* Sitemap Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sitemapData.map((section, i) => (
                        <Card key={i} className="bg-card/80 backdrop-blur border-border/60">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        {section.icon}
                                    </div>
                                    {section.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {section.links.map((link, j) => (
                                        <li key={j}>
                                            <Link
                                                href={link.href}
                                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                                            >
                                                <ChevronRight className="w-4 h-4 text-primary/50 group-hover:translate-x-1 transition-transform" />
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer Info */}
                <Card className="mt-12 bg-muted/30">
                    <CardContent className="py-6 text-center">
                        <p className="text-muted-foreground mb-2">
                            Không tìm thấy nội dung bạn cần?
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link href="/search" className="text-primary hover:underline">
                                Tìm kiếm
                            </Link>
                            <span className="text-muted-foreground">•</span>
                            <Link href="/contact" className="text-primary hover:underline">
                                Liên hệ hỗ trợ
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
