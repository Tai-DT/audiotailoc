'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EliteSectionHeadingProps {
    title: string;
    subtitle?: string;
    badge?: string;
    centered?: boolean;
    className?: string;
}

export function EliteSectionHeading({
    title,
    subtitle,
    badge,
    centered = false,
    className
}: EliteSectionHeadingProps) {
    return (
        <div className={cn(
            "mb-12 md:mb-20 space-y-4",
            centered ? "text-center mx-auto" : "text-left",
            className
        )}>
            {badge && (
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] bg-primary/10 border border-primary/20 text-primary backdrop-blur-md"
                >
                    {badge}
                </motion.span>
            )}

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black tracking-tight leading-[1.1] uppercase"
            >
                {title}
            </motion.h2>

            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground leading-[1.6] max-w-2xl font-light"
                >
                    {subtitle}
                </motion.p>
            )}

            {!centered && (
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100px" }}
                    viewport={{ once: true }}
                    className="h-1 bg-gradient-to-r from-primary to-accent mt-6"
                />
            )}
        </div>
    );
}
