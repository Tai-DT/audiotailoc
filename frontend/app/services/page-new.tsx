'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Wrench, Headphones, Home, Lightbulb, Settings, Shield,
  Clock, CheckCircle, Star, ArrowRight, Calendar, Users,
  Award, TrendingUp, Zap, Target, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useServiceStore } from '@/lib/store';
import { Service } from '@/lib/types-prisma';

const serviceCategories = [
  {
    id: 'consultation',
    name: 'Tư vấn âm thanh',
    icon: Headphones,
    description: 'Tư vấn giải pháp âm thanh phù hợp với nhu cầu và ngân sách'
  },
  {
    id: 'installation',
    name: 'Lắp đặt hệ thống',
    icon: Settings,
    description: 'Lắp đặt và cài đặt hệ thống âm thanh chuyên nghiệp'
  },
  {
    id: 'room-design',
    name: 'Thiết kế phòng nghe',
    icon: Home,
    description: 'Thiết kế và thi công phòng nghe với âm học tối ưu'
  },
  {
    id: 'maintenance',
    name: 'Bảo trì & Sửa chữa',
    icon: Wrench,
    description: 'Dịch vụ bảo trì định kỳ và sửa chữa thiết bị'
  },
  {
    id: 'rental',
    name: 'Cho thuê thiết bị',
    icon: Calendar,
    description: 'Cho thuê thiết bị âm thanh cho sự kiện'
  },
  {
    id: 'training',
    name: 'Đào tạo sử dụng',
    icon: Lightbulb,
    description: 'Hướng dẫn sử dụng và vận hành hệ thống'
  }
];

const popularServices = [
  {
    id: '1',
    name: 'Tư vấn Setup Phòng Nghe Gia Đình',
    category: 'consultation',
    price: 'Miễn phí',
    duration: '60 phút',
    rating: 4.9,
    reviews: 156,
    image: '/images/services/home-audio.jpg',
    features: ['Khảo sát không gian', 'Đề xuất thiết bị phù hợp', 'Báo giá chi tiết', 'Hỗ trợ sau tư vấn']
  },
  {
    id: '2',
    name: 'Lắp Đặt Hệ Thống Âm Thanh Hi-End',
    category: 'installation',
    price: 'Từ 2,000,000đ',
    duration: '4-8 giờ',
    rating: 4.8,
    reviews: 89,
    image: '/images/services/installation.jpg',
    features: ['Lắp đặt chuyên nghiệp', 'Cân chỉnh âm học', 'Bảo hành 12 tháng', 'Hướng dẫn sử dụng']
  },
  {
    id: '3',
    name: 'Thiết Kế Phòng Nghe Chuẩn Acoustic',
    category: 'room-design',
    price: 'Từ 5,000,000đ',
    duration: '2-4 tuần',
    rating: 5.0,
    reviews: 42,
    image: '/images/services/room-design.jpg',
    features: ['Thiết kế 3D', 'Vật liệu tiêu âm cao cấp', 'Thi công trọn gói', 'Đo đạc âm học']
  },
  {
    id: '4',
    name: 'Bảo Trì Định Kỳ Thiết Bị Âm Thanh',
    category: 'maintenance',
    price: 'Từ 500,000đ',
    duration: '2-3 giờ',
    rating: 4.7,
    reviews: 234,
    image: '/images/services/maintenance.jpg',
    features: ['Kiểm tra toàn diện', 'Vệ sinh thiết bị', 'Thay thế linh kiện', 'Báo cáo tình trạng']
  }
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { services, getServices, isLoading } = useServiceStore();
  
  useEffect(() => {
    getServices();
  }, [getServices]);

  const filteredServices = selectedCategory === 'all' 
    ? popularServices 
    : popularServices.filter(service => service.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Dịch vụ chuyên nghiệp
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Dịch Vụ Âm Thanh Toàn Diện
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Từ tư vấn, lắp đặt đến bảo trì - Chúng tôi đồng hành cùng bạn trong mọi nhu cầu âm thanh
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/booking">
                  <Calendar className="mr-2 h-5 w-5" />
                  Đặt lịch tư vấn
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-orange-600">
                <Phone className="mr-2 h-5 w-5" />
                Gọi ngay: 0901 234 567
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-white/80">Dự án hoàn thành</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-white/80">Khách hàng hài lòng</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10+</div>
                <div className="text-sm text-white/80">Năm kinh nghiệm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Danh Mục Dịch Vụ</h2>
            <p className="text-xl text-gray-600">
              Khám phá các dịch vụ chuyên nghiệp của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {serviceCategories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedCategory === category.id ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-6 text-center">
                  <category.icon className="h-10 w-10 mx-auto mb-3 text-orange-600" />
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full max-w-4xl mx-auto mb-8">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              {serviceCategories.slice(0, 6).map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id}>
                  {cat.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-orange-500">
                        Phổ biến
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">
                          {serviceCategories.find(c => c.id === service.category)?.name}
                        </Badge>
                        <div className="flex items-center text-sm">
                          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                          <span className="font-medium">{service.rating}</span>
                          <span className="text-gray-500 ml-1">({service.reviews})</span>
                        </div>
                      </div>
                      <CardTitle className="line-clamp-2">{service.name}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {service.duration}
                          </div>
                          <div className="text-lg font-bold text-orange-600">
                            {service.price}
                          </div>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button className="flex-1" asChild>
                        <Link href={`/services/${service.id}`}>
                          Xem chi tiết
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/booking?service=${service.id}`}>
                          Đặt lịch
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tại Sao Chọn Chúng Tôi?</h2>
            <p className="text-xl text-gray-600">
              Cam kết mang đến dịch vụ tốt nhất cho khách hàng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Đội Ngũ Chuyên Nghiệp</h3>
                <p className="text-sm text-gray-600">
                  Kỹ thuật viên được đào tạo bài bản với nhiều năm kinh nghiệm
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Bảo Hành Dài Hạn</h3>
                <p className="text-sm text-gray-600">
                  Chế độ bảo hành lên đến 24 tháng cho mọi dịch vụ
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Phản Hồi Nhanh</h3>
                <p className="text-sm text-gray-600">
                  Có mặt trong vòng 2 giờ cho các trường hợp khẩn cấp
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Giá Cả Minh Bạch</h3>
                <p className="text-sm text-gray-600">
                  Báo giá rõ ràng, không phát sinh chi phí ngoài dự kiến
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quy Trình Làm Việc</h2>
            <p className="text-xl text-gray-600">
              4 bước đơn giản để có được dịch vụ hoàn hảo
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 hidden md:block">
                <div className="h-full w-3/4 bg-gradient-to-r from-orange-500 to-red-500"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {[
                  { step: 1, title: 'Liên hệ tư vấn', desc: 'Gọi điện hoặc đặt lịch online' },
                  { step: 2, title: 'Khảo sát & Báo giá', desc: 'Khảo sát thực tế và báo giá chi tiết' },
                  { step: 3, title: 'Thực hiện dịch vụ', desc: 'Triển khai theo đúng kế hoạch' },
                  { step: 4, title: 'Bàn giao & Bảo hành', desc: 'Nghiệm thu và hỗ trợ sau dịch vụ' }
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="bg-white w-24 h-24 rounded-full border-4 border-orange-500 flex items-center justify-center mx-auto mb-4 relative z-10">
                      <span className="text-2xl font-bold text-orange-600">{item.step}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn Sàng Nâng Cấp Hệ Thống Âm Thanh?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Đặt lịch tư vấn miễn phí ngay hôm nay để được tư vấn giải pháp phù hợp nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Đặt lịch ngay
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-orange-600">
              <Award className="mr-2 h-5 w-5" />
              Xem portfolio
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
