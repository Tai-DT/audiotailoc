'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useServiceBySlug } from '@/lib/hooks/use-api';
import { ServiceBookingModal } from '@/components/services/service-booking-modal';
import {
  Star,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ArrowLeft,
  Calendar,
  User,
  Wrench,
  Shield,
  Award
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ServiceStructuredData } from '@/components/seo/service-structured-data';

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
    } catch (err) {
      // Ignore JSON parse error and fallback to comma split
    }

    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
};

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
});

export default function ServiceDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const [selectedImage, setSelectedImage] = useState(0);
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

  const handleContact = () => {
    toast.success('Chúng tôi sẽ liên hệ với bạn sớm nhất!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg" />
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-muted rounded" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Không tìm thấy dịch vụ
            </h1>
            <p className="text-muted-foreground mb-8">
              Dịch vụ bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.
            </p>
            <Link href="/services">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách dịch vụ
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const images = parseStringArray(service.images as unknown).length > 0
    ? parseStringArray(service.images as unknown)
    : ['/placeholder-service.jpg'];

  const features = parseStringArray(service.features as unknown);
  const requirements = parseStringArray(service.requirements as unknown);
  const tags = parseStringArray(service.tags as unknown);

  const formatPrice = () => {
    switch (service.priceType) {
      case 'FIXED':
        return currencyFormatter.format(service.price ?? service.minPrice ?? 0);
      case 'RANGE':
        if (service.minPrice && service.maxPrice) {
          return `${currencyFormatter.format(service.minPrice)} - ${currencyFormatter.format(service.maxPrice)}`;
        }
        if (service.minPrice) {
          return `Từ ${currencyFormatter.format(service.minPrice)}`;
        }
        if (service.maxPrice) {
          return `Đến ${currencyFormatter.format(service.maxPrice)}`;
        }
        return 'Liên hệ tư vấn';
      case 'NEGOTIABLE':
        return 'Giá thỏa thuận';
      case 'CONTACT':
        return 'Liên hệ tư vấn';
      default:
        return currencyFormatter.format(service.price ?? 0);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ServiceStructuredData service={{ ...service, description: service.description ?? '' }} />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-primary">Dịch vụ</Link>
          <span>/</span>
          <span className="text-foreground">{service.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Service Images */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
              <Image
                src={images[selectedImage]}
                alt={service.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-muted'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${service.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {service.serviceType && (
                  <Badge variant="secondary" className="text-xs">
                    {service.serviceType.name}
                  </Badge>
                )}
                {service.isFeatured && (
                  <Badge variant="default" className="text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Nổi bật
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-4">{service.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {service.duration} phút
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-muted-foreground">
                    {service.viewCount} lượt xem
                  </span>
                </div>
              </div>

              <div className="text-3xl font-bold text-primary mb-6">
                {formatPrice()}
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag, index) => (
                    <Badge key={`${tag}-${index}`} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {service.shortDescription && (
                <p className="text-muted-foreground mb-6">
                  {service.shortDescription}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={handleBooking}
                disabled={service.priceType === 'CONTACT'}
              >
                <Calendar className="mr-2 h-5 w-5" />
                {service.priceType === 'CONTACT' ? 'Liên hệ tư vấn' : 'Đặt lịch ngay'}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleContact}>
                  <Phone className="mr-2 h-4 w-4" />
                  Gọi điện
                </Button>
                <Button variant="outline" onClick={handleContact}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              </div>
            </div>

            {/* Service Features */}
            {features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tính năng nổi bật</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Yêu cầu</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Service Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Mô tả chi tiết</TabsTrigger>
            <TabsTrigger value="process">Quy trình thực hiện</TabsTrigger>
            <TabsTrigger value="guarantee">Bảo hành & hỗ trợ</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none">
                  {service.description ? (
                    <div dangerouslySetInnerHTML={{ __html: service.description }} />
                  ) : (
                    <p className="text-muted-foreground">
                      Thông tin chi tiết về dịch vụ sẽ được cập nhật sớm.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="process" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Liên hệ & tư vấn</h4>
                      <p className="text-sm text-muted-foreground">
                        Khách hàng liên hệ và được tư vấn chi tiết về dịch vụ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Đặt lịch hẹn</h4>
                      <p className="text-sm text-muted-foreground">
                        Chọn thời gian và địa điểm phù hợp
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Thực hiện dịch vụ</h4>
                      <p className="text-sm text-muted-foreground">
                        Kỹ thuật viên chuyên nghiệp thực hiện theo đúng quy trình
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Hoàn thành & kiểm tra</h4>
                      <p className="text-sm text-muted-foreground">
                        Kiểm tra chất lượng và bàn giao cho khách hàng
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guarantee" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-8 w-8 text-green-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Bảo hành chính hãng</h4>
                      <p className="text-sm text-muted-foreground">
                        Bảo hành theo tiêu chuẩn nhà sản xuất với thời hạn lên đến 24 tháng
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Wrench className="h-8 w-8 text-blue-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Hỗ trợ kỹ thuật 24/7</h4>
                      <p className="text-sm text-muted-foreground">
                        Đội ngũ kỹ thuật viên luôn sẵn sàng hỗ trợ khách hàng mọi lúc
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-8 w-8 text-purple-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Tư vấn miễn phí</h4>
                      <p className="text-sm text-muted-foreground">
                        Tư vấn chuyên nghiệp trước và sau khi sử dụng dịch vụ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-8 w-8 text-orange-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Đảm bảo chất lượng</h4>
                      <p className="text-sm text-muted-foreground">
                        Cam kết chất lượng dịch vụ đạt tiêu chuẩn cao nhất
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Thông tin liên hệ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Hotline</p>
                  <p className="text-sm text-muted-foreground">1900 XXX XXX</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">support@audiotailoc.vn</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Địa chỉ</p>
                  <p className="text-sm text-muted-foreground">123 Đường ABC, Quận XYZ, TP.HCM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Service Booking Modal */}
      <ServiceBookingModal
        service={service}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}