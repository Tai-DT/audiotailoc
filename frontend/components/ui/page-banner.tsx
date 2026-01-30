import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Award, Shield } from 'lucide-react';

interface PageBannerProps {
 page: string;
 title: string;
 subtitle?: string;
 description?: string;
 showStats?: boolean;
}

export function PageBanner({
 page,
 title,
 subtitle,
 description,
 showStats = false
}: PageBannerProps) {
 const stats = [
 {
 icon: Users,
 value: '10,000+',
 label: 'Khách hàng hài lòng'
 },
 {
 icon: Award,
 value: '15+',
 label: 'Năm kinh nghiệm'
 },
 {
 icon: Star,
 value: '4.9/5',
 label: 'Đánh giá trung bình'
 },
 {
 icon: Shield,
 value: '100%',
 label: 'Bảo hành chính hãng'
 }
 ];

 return (
 <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-8 md:py-12">
 <div className="container mx-auto px-4">
 <div className="max-w-4xl mx-auto text-center">
 <Badge variant="secondary" className="mb-3">
 {page}
 </Badge>

 <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
 {title}
 </h1>

 {subtitle && (
 <p className="text-lg md:text-xl text-muted-foreground mb-4">
 {subtitle}
 </p>
 )}

 {description && (
 <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
 {description}
 </p>
 )}

 {showStats && (
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
 {stats.map((stat, index) => (
 <Card key={index} className="border-none shadow-sm bg-background/50 backdrop-blur-sm">
 <CardContent className="p-4 text-center">
 <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
 <div className="text-xl font-bold text-primary mb-0.5">
 {stat.value}
 </div>
 <div className="text-xs text-muted-foreground">
 {stat.label}
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 )}
 </div>
 </div>
 </section>
 );
}