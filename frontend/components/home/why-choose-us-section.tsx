'use client';

import React from 'react';
import { Shield, Truck, Headphones, Award, Clock, ThumbsUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSiteStats } from '@/lib/hooks/use-site-stats';

const features = [
    {
        icon: Shield,
        title: 'Bảo hành tối cao',
        description: 'Chính sách bảo hành độc quyền 24-36 tháng. Đổi mới trong 30 ngày cho mọi lỗi kỹ thuật từ nhà sản xuất.',
        gradient: 'from-primary to-red-800',
        bgGradient: 'from-primary/10 to-transparent',
    },
    {
        icon: Truck,
        title: 'Giao hàng hỏa tốc',
        description: 'Vận chuyển chuyên dụng cho thiết bị Hi-End. Miễn phí lắp đặt tận nơi trong nội thành Hà Nội & TP.HCM.',
        gradient: 'from-red-500 to-red-900',
        bgGradient: 'from-red-500/10 to-transparent',
    },
    {
        icon: Headphones,
        title: 'Cố vấn chuyên gia',
        description: 'Đội ngũ chuyên gia âm thanh giàu kinh nghiệm tư vấn giải pháp trọn gói, cá nhân hóa theo từng không gian.',
        gradient: 'from-primary to-red-600',
        bgGradient: 'from-primary/10 to-red-600/5',
    },
    {
        icon: Award,
        title: 'Tinh hoa chính hãng',
        description: 'Cam kết 100% thiết bị nhập khẩu từ các thương hiệu huyền thoại: JBL, Bose, Shure, Audio-Technica.',
        gradient: 'from-red-600 to-primary',
        bgGradient: 'from-red-600/10 to-primary/10',
    },
    {
        icon: Clock,
        title: 'Kỹ thuật tận tận tâm',
        description: 'Dịch vụ bảo trì định kỳ trọn đời. Cân chỉnh âm thanh chuẩn xác bằng máy đo chuyên dụng.',
        gradient: 'from-primary to-red-500',
        bgGradient: 'from-primary/5 to-red-500/5',
    },
    {
        icon: ThumbsUp,
        title: 'Giá trị vượt trội',
        description: 'Đầu tư xứng tầm với cam kết giá trị tốt nhất thị trường. Hỗ trợ trả góp Elite với lãi suất 0%.',
        gradient: 'from-red-500 to-red-400',
        bgGradient: 'from-red-500/10 to-transparent',
    },
];

export function WhyChooseUsSection() {
    const { data: siteStats } = useSiteStats();
    const stats = (siteStats || [])
        .filter((stat) => stat.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .slice(0, 4)
        .map((stat) => ({ value: stat.value, label: stat.label }));

    return (
        <section className="py-10 md:py-24 bg-background relative overflow-hidden">
            {/* Cinematic Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-0 w-[800px] h-[800px] rounded-full bg-primary/5 dark:bg-primary/5 blur-[140px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 dark:bg-accent/5 blur-[110px]" />
                <div className="absolute inset-0 bg-noise opacity-[0.02] dark:opacity-[0.03]" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-4xl mx-auto mb-6 md:mb-12">
                    <div className="section-badge mx-auto mb-8">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Sứ mệnh & Tinh hoa</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tighter mb-4 md:mb-8 font-display leading-[1.05] md:leading-[0.85] text-foreground">
                        Kiến tạo{' '}
                        <span className="premium-text-gradient italic">
                            Âm Thanh
                        </span>{' '}
                        Vượt Thời Gian
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed italic border-x-4 border-primary/20 dark:border-accent/20 px-4 md:px-8">
                        Audio Tài Lộc tự hào là đối tác chiến thuật, mang trọn vẹn tinh hoa âm nhạc và công nghệ đỉnh cao vào không gian sống thượng lưu của bạn.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-10 md:mb-16">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>

                {/* Stats Bar - Elite Console */}
                {stats.length > 0 && (
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative glass-panel rounded-3xl md:rounded-[4rem] p-4 md:p-12 shadow-2xl overflow-hidden group/stats">
                            {/* Decorative Grid */}
                            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
                            <div className="absolute inset-0 gold-royal-grain opacity-5 group-hover/stats:opacity-10 transition-opacity" />

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 relative z-10">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center group/stat">
                                        <div className="text-2xl sm:text-3xl md:text-6xl font-black text-primary dark:text-primary font-display mb-2 md:mb-5 tracking-tighter drop-shadow-sm group-hover/stat:scale-110 group-hover/stat:text-accent transition-all duration-700">
                                            {stat.value}
                                        </div>
                                        <div className="text-zinc-400 dark:text-zinc-300 font-semibold tracking-[0.14em] text-[9px] md:text-[11px] font-display group-hover/stat:text-primary transition-colors">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Trust Logos - Cinema Style */}
                <div className="mt-10 md:mt-24 text-center">
                    <p className="text-[9px] md:text-[11px] font-semibold tracking-[0.14em] md:tracking-[0.16em] text-muted-foreground/20 dark:text-foreground/20 dark:text-foreground dark:text-white/20 mb-6 md:mb-12 font-display">Đối tác ủy quyền toàn cầu</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-28 opacity-40 dark:opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000 saturate-[0.5] hover:saturate-100 px-6">
                        {['JBL', 'Bose', 'Shure', 'Yamaha', 'Pioneer', 'Sony'].map((brand) => (
                            <div
                                key={brand}
                                className="text-xl sm:text-2xl md:text-5xl font-black text-foreground dark:text-foreground dark:text-white hover:text-primary transition-all duration-700 font-display tracking-tighter cursor-default drop-shadow-sm"
                            >
                                {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

interface FeatureCardProps {
    feature: typeof features[0];
    index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
    const Icon = feature.icon;

    return (
        <article
            className="group relative p-4 md:p-8 overflow-hidden red-elite-card rounded-3xl md:rounded-[3.5rem]"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Luxury Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="absolute inset-0 gold-royal-grain opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-700" />

            {/* Content */}
            <div className="relative z-10">
                {/* Icon with Premium Container */}
                <div
                    className={cn(
                        "w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-10 transition-all duration-700",
                        "group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_20px_40px_rgba(220,38,38,0.2)]",
                        "bg-secondary dark:bg-white/5 text-primary dark:text-accent border border-border dark:border-white/10 group-hover:bg-primary dark:group-hover:bg-accent group-hover:text-foreground dark:text-foreground dark:text-white dark:group-hover:text-black"
                    )}
                >
                    <Icon size={24} className="md:size-9" />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-2xl font-black mb-3 md:mb-6 group-hover:text-primary transition-colors font-display tracking-tight leading-none relative overflow-hidden h-6 md:h-9">
                    <span className="absolute inset-0 translate-y-0 group-hover:-translate-y-full transition-transform duration-500 flex items-center">{feature.title}</span>
                    <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 text-primary dark:text-accent italic flex items-center">{feature.title}</span>
                </h3>

                {/* Description */}
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium text-sm">
                    {feature.description}
                </p>

                {/* Elite Badge - Fixed at bottom */}
                <div className="mt-6 pt-6 border-t border-border dark:border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-700">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[10px] font-semibold tracking-[0.14em] text-primary dark:text-accent font-display">Tiêu chuẩn Audio Tài Lộc</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
