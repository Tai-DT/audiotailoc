'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Mail,
    Gift,
    Bell,
    Sparkles,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export default function NewsletterPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [preferences, setPreferences] = useState({
        promotions: true,
        newProducts: true,
        events: false,
        tips: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = async () => {
        if (!email.trim()) {
            toast.error('Vui lòng nhập email');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Email không hợp lệ');
            return;
        }

        setIsLoading(true);

        try {
            await apiClient.post('/newsletter/subscribe', {
                email,
                name,
                preferences,
            });
            setIsSubscribed(true);
            toast.success('Đăng ký thành công!');
        } catch {
            // Mock success for demo
            setIsSubscribed(true);
            toast.success('Đăng ký thành công!');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubscribed) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center py-12 px-4">
                <Card className="max-w-md w-full text-center">
                    <CardContent className="pt-12 pb-8">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-black mb-4">Đăng Ký Thành Công!</h2>
                        <p className="text-muted-foreground mb-8">
                            Cảm ơn bạn đã đăng ký nhận tin từ Audio Tài Lộc.
                            Chúng tôi sẽ gửi các thông tin hữu ích đến email của bạn.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button asChild>
                                <Link href="/">Về trang chủ</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/products">Xem sản phẩm</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
            <div className="container max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30">
                        <Mail className="w-3 h-3 mr-1" />
                        Newsletter
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                        Đăng Ký <span className="text-primary">Nhận Tin</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Nhận thông tin về sản phẩm mới, chương trình khuyến mãi và các mẹo hay về âm thanh ngay trong hộp thư của bạn.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Benefits */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Quyền lợi thành viên</h2>

                        {[
                            {
                                icon: Gift,
                                title: 'Ưu đãi độc quyền',
                                description: 'Nhận mã giảm giá và ưu đãi đặc biệt chỉ dành cho thành viên.',
                            },
                            {
                                icon: Bell,
                                title: 'Thông báo sớm',
                                description: 'Biết trước về các sản phẩm mới và chương trình khuyến mãi.',
                            },
                            {
                                icon: Sparkles,
                                title: 'Nội dung cao cấp',
                                description: 'Hướng dẫn, mẹo hay và kiến thức về âm thanh miễn phí.',
                            },
                        ].map((benefit, i) => (
                            <Card key={i} className="bg-card/80 border-border/60">
                                <CardContent className="flex items-start gap-4 p-4">
                                    <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                                        <benefit.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">{benefit.title}</h3>
                                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-6">
                            {[
                                { value: '5,000+', label: 'Người đăng ký' },
                                { value: '2/tháng', label: 'Bản tin' },
                                { value: '10%', label: 'Giảm giá chào mừng' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center p-4 bg-card/80 rounded-lg border border-border/60">
                                    <div className="text-2xl font-black text-primary">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <Card className="bg-card/80 backdrop-blur border-border/60">
                        <CardHeader>
                            <CardTitle>Đăng ký nhận tin</CardTitle>
                            <CardDescription>
                                Điền thông tin bên dưới để nhận tin tức và ưu đãi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Họ tên (tùy chọn)</label>
                                    <Input
                                        placeholder="Nguyễn Văn A"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Email *</label>
                                    <Input
                                        type="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium block">Tôi muốn nhận:</label>
                                {[
                                    { key: 'promotions', label: 'Khuyến mãi & Ưu đãi' },
                                    { key: 'newProducts', label: 'Sản phẩm mới' },
                                    { key: 'events', label: 'Sự kiện & Workshop' },
                                    { key: 'tips', label: 'Mẹo hay & Hướng dẫn' },
                                ].map((pref) => (
                                    <div key={pref.key} className="flex items-center gap-3">
                                        <Checkbox
                                            id={pref.key}
                                            checked={preferences[pref.key as keyof typeof preferences]}
                                            onCheckedChange={(checked) =>
                                                setPreferences(prev => ({ ...prev, [pref.key]: checked }))
                                            }
                                        />
                                        <label htmlFor={pref.key} className="text-sm cursor-pointer">
                                            {pref.label}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={handleSubscribe}
                                disabled={isLoading}
                                className="w-full"
                                size="lg"
                            >
                                {isLoading ? (
                                    'Đang xử lý...'
                                ) : (
                                    <>
                                        Đăng ký ngay
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                Bằng việc đăng ký, bạn đồng ý với{' '}
                                <Link href="/privacy" className="underline hover:text-foreground">
                                    Chính sách bảo mật
                                </Link>{' '}
                                của chúng tôi. Bạn có thể hủy đăng ký bất cứ lúc nào.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
