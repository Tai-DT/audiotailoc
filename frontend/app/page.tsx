'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  SpeakerWaveIcon, 
  MusicalNoteIcon,
  StarIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ShoppingCartIcon,
  SparklesIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api-client';
import CategoryProducts from '@/components/home/CategoryProducts';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: { name: string };
  averageRating: number;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  category: { name: string };
  badge?: string;
}

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      // Load banners
      const bannersData = [
        {
          id: '1',
          title: 'Audio Tài Lộc',
          subtitle: 'Nâng tầm trải nghiệm âm thanh với các sản phẩm chất lượng cao và dịch vụ chuyên nghiệp',
          imageUrl: '/images/banner1.jpg',
          ctaText: 'Khám phá ngay',
          ctaLink: '/products'
        },
        {
          id: '2',
          title: 'Khuyến mãi đặc biệt',
          subtitle: 'Giảm giá lên đến 50% cho các sản phẩm âm thanh cao cấp',
          imageUrl: '/images/banner2.jpg',
          ctaText: 'Xem ưu đãi',
          ctaLink: '/products?sale=true'
        }
      ];
      setBanners(bannersData);

      // Load featured products from API
      try {
        const productsRes = await api.products.getAll({ 
          pageSize: 8, 
          limit: 8,
          featured: true 
        });
        if (productsRes.success && productsRes.data) {
          const products = Array.isArray(productsRes.data) 
            ? productsRes.data 
            : productsRes.data?.items || [];
          setFeaturedProducts(products);
        } else {
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setFeaturedProducts([]);
      }

      // Load featured services from API
      try {
        const servicesRes = await api.services.getAll({ limit: 6, isActive: true });
        if (servicesRes.success && servicesRes.data) {
          const dataAny: any = servicesRes.data as any;
          const services = Array.isArray(dataAny)
            ? dataAny
            : dataAny?.items || dataAny?.services || [];
          setFeaturedServices(services);
        } else {
          setFeaturedServices([]);
        }
      } catch (error) {
        console.error('Error loading services:', error);
        // Use mock data if API fails
        setFeaturedServices([
          {
            id: '1',
            name: 'Lắp đặt hệ thống âm thanh',
            slug: 'lap-dat-he-thong-am-thanh',
            description: 'Thiết kế và lắp đặt hệ thống âm thanh chuyên nghiệp',
            basePrice: 2000000,
            category: { name: 'Lắp đặt' },
            badge: 'Phổ biến'
          },
          {
            id: '2',
            name: 'Bảo trì và sửa chữa',
            slug: 'bao-tri-sua-chua',
            description: 'Dịch vụ bảo trì định kỳ và sửa chữa thiết bị',
            basePrice: 500000,
            category: { name: 'Bảo trì' },
            badge: 'Tiết kiệm'
          },
          {
            id: '3',
            name: 'Tư vấn âm thanh',
            slug: 'tu-van-am-thanh',
            description: 'Tư vấn chuyên môn về thiết kế và lựa chọn thiết bị',
            basePrice: 300000,
            category: { name: 'Tư vấn' },
            badge: 'Miễn phí'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" suppressHydrationWarning>
      {/* Hero Section with Banner Carousel */}
      <section className="relative h-[600px] overflow-hidden">
        {loading ? (
          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
            <Skeleton className="w-32 h-32" />
          </div>
        ) : banners.length > 0 ? (
          <Carousel className="w-full h-full">
            <CarouselContent>
              {banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className="relative h-[600px] bg-gradient-to-br from-primary-600 to-primary-800">
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative h-full flex items-center justify-center text-white">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto px-4"
                      >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                          {banner.title}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8">
                          {banner.subtitle}
                        </p>
                        <Link href={banner.ctaLink}>
                          <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                            {banner.ctaText}
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        ) : (
          <div className="relative h-[600px] bg-gradient-to-br from-primary-600 to-primary-800">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative h-full flex items-center justify-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto px-4"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Audio Tài Lộc
                </h1>
                <p className="text-xl md:text-2xl mb-8">
                  Nâng tầm trải nghiệm âm thanh với các sản phẩm chất lượng cao và dịch vụ chuyên nghiệp
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/products">
                    <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                      Khám phá sản phẩm
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                      Xem dịch vụ
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá các sản phẩm âm thanh chất lượng cao được ưa chuộng nhất
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link href={`/products/${product.slug}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                      <div className="relative aspect-square bg-gray-100">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <SpeakerWaveIcon className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                          -20%
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.averageRating || 4)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-1">
                            ({product.averageRating || 4.5})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-primary-600">
                            {formatPrice(product.price)}
                          </p>
                          <Button size="sm" variant="outline">
                            <ShoppingCartIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Đang cập nhật sản phẩm...</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-12"
          >
            <Link href="/products">
              <Button size="lg">
                Xem tất cả sản phẩm
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Products by Category Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sản phẩm theo danh mục
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mỗi danh mục hiển thị 4 sản phẩm mới nhất
            </p>
          </motion.div>
          {/* Dynamic category sections */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <CategoryProducts />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn Audio Tài Lộc?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi mang đến giải pháp âm thanh toàn diện với chất lượng và dịch vụ hàng đầu
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShieldCheckIcon,
                title: 'Bảo hành chính hãng',
                description: 'Sản phẩm chính hãng 100% với chế độ bảo hành tốt nhất'
              },
              {
                icon: TruckIcon,
                title: 'Giao hàng toàn quốc',
                description: 'Miễn phí giao hàng cho đơn hàng trên 1 triệu đồng'
              },
              {
                icon: SparklesIcon,
                title: 'Kỹ thuật chuyên nghiệp',
                description: 'Đội ngũ kỹ thuật viên giàu kinh nghiệm, tận tâm'
              },
              {
                icon: CheckCircleIcon,
                title: 'Giá cả cạnh tranh',
                description: 'Cam kết giá tốt nhất thị trường, nhiều ưu đãi'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dịch vụ nổi bật
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Giải pháp âm thanh chuyên nghiệp cho mọi nhu cầu của bạn
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-full">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full mb-4" />
                    <Skeleton className="h-8 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-200">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        {service.badge && (
                          <Badge variant={service.badge === 'Phổ biến' ? 'default' : 'secondary'}>
                            {service.badge}
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {service.category?.name || 'Dịch vụ'}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-6">
                        {service.description}
                      </CardDescription>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Bắt đầu từ</p>
                          <p className="text-2xl font-bold text-primary-600">
                            {formatPrice(service.basePrice)}
                          </p>
                        </div>
                        <Link href={`/booking?service=${service.slug}`}>
                          <Button>
                            Đặt lịch ngay
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href="/services">
              <Button size="lg" variant="outline">
                Xem tất cả dịch vụ
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Nguyễn Văn A',
                role: 'Chủ nhà hàng',
                content: 'Dịch vụ rất chuyên nghiệp, âm thanh chất lượng cao. Khách hàng rất hài lòng!',
                rating: 5
              },
              {
                name: 'Trần Thị B',
                role: 'Chủ văn phòng',
                content: 'Kỹ thuật viên tận tâm, lắp đặt nhanh chóng và gọn gàng. Rất đáng tin cậy.',
                rating: 5
              },
              {
                name: 'Lê Văn C',
                role: 'Chủ gia đình',
                content: 'Hệ thống âm thanh gia đình tuyệt vời, giá cả hợp lý. Sẽ giới thiệu cho bạn bè.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Sẵn sàng tư vấn và hỗ trợ bạn mọi lúc
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center"
            >
              <PhoneIcon className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Điện thoại</h3>
              <p className="opacity-90">0901 234 567</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <EnvelopeIcon className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="opacity-90">info@audiotailoc.com</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center"
            >
              <MapPinIcon className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Địa chỉ</h3>
              <p className="opacity-90">123 Đường ABC, Quận 1, TP.HCM</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
              <Link href="/booking">
                Đặt lịch tư vấn miễn phí
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
