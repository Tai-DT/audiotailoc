'use client';

import React from 'react';
import { ShieldCheck, Truck, Clock, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const POLICIES = [
    {
        icon: ShieldCheck,
        title: 'Bảo hành 24 tháng',
        desc: 'Chính sách Elite duy nhất tại Việt Nam',
        color: 'text-primary'
    },
    {
        icon: Truck,
        title: 'Miễn phí vận chuyển',
        desc: 'Nội thành Hà Nội & TP. Hồ Chí Minh',
        color: 'text-accent'
    },
    {
        icon: Headphones,
        title: 'Cố vấn 24/7',
        desc: 'Đội ngũ chuyên gia từ Red Elite',
        color: 'text-primary'
    },
    {
        icon: Clock,
        title: 'Đổi mới 30 ngày',
        desc: 'Nếu có bất kỳ lỗi từ nhà sản xuất',
        color: 'text-accent'
    }
];

export function ElitePolicyBar() {
    return (
        <section className="relative z-20 -mt-10 md:-mt-16 container mx-auto px-4 md:px-6">
            <div className="glass-panel dark:bg-card/40 backdrop-blur-2xl rounded-2xl md:rounded-[40px] border border-white/10 shadow-2xl overflow-hidden relative group">
                {/* Visual Accent */}
                <div className="absolute inset-0 gold-royal-grain opacity-[0.03] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border-white/5 divide-white/5">
                    {POLICIES.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 md:p-10 flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-3 sm:gap-6 group/item hover:bg-primary/5 transition-colors duration-500"
                        >
                            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-secondary dark:bg-white/5 flex items-center justify-center transition-all duration-500 group-hover/item:scale-110 group-hover/item:bg-primary group-hover/item:text-black ${item.color}`}>
                                <item.icon size={22} className="md:size-32" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-[10px] md:text-base font-black uppercase tracking-widest text-foreground group-hover/item:text-primary transition-colors font-display leading-tight">
                                    {item.title}
                                </h4>
                                <p className="text-[10px] md:text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
