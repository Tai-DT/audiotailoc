import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dịch vụ - Audio Tài Lộc',
  description: 'Các dịch vụ chuyên nghiệp về âm thanh, lắp đặt, bảo trì và tư vấn từ Audio Tài Lộc.',
};

interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: 'INSTALLATION' | 'MAINTENANCE' | 'CONSULTATION' | 'REPAIR' | 'CUSTOM';
  type: 'ONSITE' | 'REMOTE' | 'HYBRID';
  basePriceCents: number;
  estimatedDuration: number;
  requirements?: string;
  features?: string;
  imageUrl?: string;
  isActive: boolean;
}

async function fetchServices() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return { items: [], total: 0 };

    const response = await fetch(`${base}/services?isActive=true`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return { items: [], total: 0 };
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return { items: [], total: 0 };
  }
}

const categoryLabels = {
  INSTALLATION: 'Lắp đặt',
  MAINTENANCE: 'Bảo trì',
  CONSULTATION: 'Tư vấn',
  REPAIR: 'Sửa chữa',
  CUSTOM: 'Tùy chỉnh'
};

const typeLabels = {
  ONSITE: 'Tại chỗ',
  REMOTE: 'Từ xa',
  HYBRID: 'Kết hợp'
};

const categoryIcons = {
  INSTALLATION: '🔧',
  MAINTENANCE: '🛠️',
  CONSULTATION: '💡',
  REPAIR: '🔨',
  CUSTOM: '⚙️'
};

export default async function ServicesPage() {
  const { items: services } = await fetchServices();

  const servicesByCategory = services.reduce((acc: Record<string, Service[]>, service: Service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Dịch vụ chuyên nghiệp</h1>
        <p className="text-xl text-gray-600 mb-8">
          Đội ngũ kỹ thuật viên giàu kinh nghiệm với các dịch vụ âm thanh chất lượng cao
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            🔧 Lắp đặt chuyên nghiệp
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            🛠️ Bảo trì định kỳ
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            💡 Tư vấn miễn phí
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            🔨 Sửa chữa nhanh chóng
          </Badge>
        </div>
      </div>

      {/* Services by Category */}
      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <div key={category} className="mb-12">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">{categoryIcons[category as keyof typeof categoryIcons]}</span>
            <h2 className="text-2xl font-bold">{categoryLabels[category as keyof typeof categoryLabels]}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{typeLabels[service.type]}</Badge>
                    <Badge variant="default" className="text-sm">
                      {formatPrice(service.basePriceCents)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>
                    Thời gian ước tính: {service.estimatedDuration} phút
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {service.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {service.description}
                    </p>
                  )}
                  
                  {service.features && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Tính năng:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.features.split(',').map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature.trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {service.requirements && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Yêu cầu:</h4>
                      <p className="text-sm text-gray-600">{service.requirements}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/services/${service.slug}`}>
                        Chi tiết
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/booking?service=${service.id}`}>
                        Đặt lịch
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {services.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-2xl font-bold mb-2">Chưa có dịch vụ nào</h3>
          <p className="text-gray-600 mb-6">
            Chúng tôi đang cập nhật danh sách dịch vụ. Vui lòng quay lại sau.
          </p>
          <Button asChild>
            <Link href="/contact">Liên hệ tư vấn</Link>
          </Button>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center mt-12">
        <h3 className="text-2xl font-bold mb-4">Cần dịch vụ đặc biệt?</h3>
        <p className="text-lg mb-6">
          Chúng tôi cung cấp các giải pháp âm thanh tùy chỉnh theo yêu cầu của bạn
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="secondary" size="lg">
            <Link href="/contact">Tư vấn miễn phí</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
            <Link href="/booking">Đặt lịch ngay</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
