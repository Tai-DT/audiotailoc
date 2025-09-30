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
    <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            {page}
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              {subtitle}
            </p>
          )}

          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}

          {showStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <Card key={index} className="border-none shadow-sm bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <div className="text-2xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
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