'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useServiceBySlug } from '@/lib/hooks/use-api';
import { ServiceBookingModal } from '@/components/services/service-booking-modal';
import {
  Star,
  Clock,
  Phone,
  CheckCircle,
  Calendar,
  Shield,
  Award,
  Wrench
} from 'lucide-react';
import { ServiceStructuredData } from '@/components/seo/service-structured-data';
import { BlurFade } from '@/components/ui/blur-fade';
import { ProductGallery } from '@/components/products/product-gallery';
import { Separator } from '@/components/ui/separator';
import { formatPrice, parseImages } from '@/lib/utils';

const parseStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => String(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item)).filter(Boolean);
      }
    } catch {
      // Ignore JSON parse error and fallback to comma split
    }

    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
};

export default function ServiceDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: service, isLoading, error } = useServiceBySlug(slug);

  // Handle URL parameter for auto-opening booking modal
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'book') {
      setIsBookingModalOpen(true);
    }
  }, [searchParams]);

  const handleBooking = () => {
    setIsBookingModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              <div className="h-24 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy dịch vụ</h1>
          <Link href="/services">
            <Button>Quay lại danh sách dịch vụ</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = parseImages(service.images);
  if (images.length === 0) {
    images.push('/placeholder-service.jpg');
  }

  const features = parseStringArray(service.features);
  const steps = parseStringArray(service.requirements); // Use requirements as steps

  return (
    <div className="min-h-screen bg-background">
      <ServiceStructuredData service={{...service, description: service.description || ''}} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/services" className="hover:text-primary transition-colors">Dịch vụ</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{service.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column: Gallery */}
          <BlurFade delay={0.1} inView>
            <ProductGallery images={images} productName={service.name} />
          </BlurFade>

          {/* Right Column: Service Info */}
          <BlurFade delay={0.2} inView>
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3 hover:bg-secondary/80">
                  Dịch vụ chuyên nghiệp
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  {service.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center text-warning">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="ml-1 font-medium text-foreground">5.0</span>
                    <span className="text-muted-foreground ml-1 text-sm">(Cam kết chất lượng)</span>
                  </div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Thời gian: {service.duration || 'Liên hệ'}</span>
                  </div>
                </div>

                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl font-bold text-primary">
                    {service.price ? formatPrice(service.price) : 'Liên hệ báo giá'}
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {service.shortDescription || service.description?.substring(0, 150) + '...'}
                </p>
              </div>

              <Separator />

              {/* Key Features */}
              {features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Đặc điểm nổi bật:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="flex-1 gap-2 text-base h-12"
                  onClick={handleBooking}
                >
                  <Calendar className="w-5 h-5" />
                  Đặt lịch ngay
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1 gap-2 text-base h-12"
                  asChild
                >
                  <Link href="tel:0909090909">
                    <Phone className="w-5 h-5" />
                    Tư vấn miễn phí
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">Chuyên gia hàng đầu</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <Wrench className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">Thiết bị hiện đại</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">Bảo hành uy tín</p>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 text-base"
              >
                Chi tiết dịch vụ
              </TabsTrigger>
              <TabsTrigger 
                value="process" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 text-base"
              >
                Quy trình thực hiện
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-8">
              <TabsContent value="description" className="animate-in fade-in-50 duration-300">
                <Card className="border-none shadow-none">
                  <CardContent className="p-0 prose prose-neutral dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: service.description || '' }} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="process" className="animate-in fade-in-50 duration-300">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-8">
                      {steps.length > 0 ? (
                        steps.map((step, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex-none">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                {index + 1}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">Bước {index + 1}</h4>
                              <p className="text-muted-foreground">{step}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">Vui lòng liên hệ để được tư vấn quy trình chi tiết.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      <ServiceBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        service={service}
      />
    </div>
  );
}
