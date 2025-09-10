'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Star, Users, Award, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  backgroundGradient: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    title: "Khám phá thế giới âm thanh đỉnh cao",
    subtitle: "Premium Audio Experience",
    description: "Nâng tầm trải nghiệm nghe nhạc với những thiết bị âm thanh cao cấp từ các thương hiệu hàng đầu thế giới",
    buttonText: "Khám phá ngay",
    buttonLink: "/products",
    imageUrl: "/images/hero-1.jpg",
    backgroundGradient: "from-blue-900 via-purple-900 to-indigo-900"
  },
  {
    id: 2,
    title: "Dịch vụ tư vấn chuyên nghiệp",
    subtitle: "Expert Audio Consultation",
    description: "Đội ngũ chuyên gia với hơn 10 năm kinh nghiệm sẽ giúp bạn tìm ra giải pháp âm thanh hoàn hảo",
    buttonText: "Tư vấn miễn phí",
    buttonLink: "/services/tu-van-setup",
    imageUrl: "/images/hero-2.jpg",
    backgroundGradient: "from-orange-900 via-red-900 to-pink-900"
  },
  {
    id: 3,
    title: "Thiết kế phòng nghe chuyên nghiệp",
    subtitle: "Custom Listening Room Design",
    description: "Tạo ra không gian âm thanh lý tưởng với dịch vụ thiết kế và setup phòng nghe chuyên nghiệp",
    buttonText: "Xem dự án",
    buttonLink: "/projects",
    imageUrl: "/images/hero-3.jpg",
    backgroundGradient: "from-slate-900 via-gray-900 to-zinc-900"
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Main Hero Carousel */}
      <div className="relative h-[600px] md:h-[700px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background with gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.backgroundGradient} opacity-95`} />
            
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
              }}
            />
            
            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl">
                  <div className="space-y-6 text-white">
                    {/* Subtitle */}
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                        {slide.subtitle}
                      </Badge>
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                      {slide.title}
                    </h1>
                    
                    {/* Description */}
                    <p className="text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed">
                      {slide.description}
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button size="lg" asChild className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                        <Link href={slide.buttonLink}>
                          {slide.buttonText}
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-3">
                        <Play className="mr-2 h-5 w-5" />
                        Xem video giới thiệu
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-orange-500' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 p-4 rounded-full">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">Khách hàng tin tưởng</div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 p-4 rounded-full">
                  <ShoppingBag className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">5K+</div>
              <div className="text-gray-600">Sản phẩm chất lượng</div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 p-4 rounded-full">
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100+</div>
              <div className="text-gray-600">Dự án hoàn thành</div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 p-4 rounded-full">
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4.9/5</div>
              <div className="text-gray-600">Đánh giá trung bình</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn Audio Tài Lộc?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm âm thanh tuyệt vời nhất cho khách hàng
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Sản phẩm chính hãng</h3>
                <p className="text-gray-600">
                  Cam kết 100% sản phẩm chính hãng từ các thương hiệu uy tín hàng đầu thế giới
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Tư vấn chuyên nghiệp</h3>
                <p className="text-gray-600">
                  Đội ngũ chuyên gia với hơn 10 năm kinh nghiệm sẽ tư vấn giải pháp tối ưu cho bạn
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Bảo hành tận tâm</h3>
                <p className="text-gray-600">
                  Chế độ bảo hành toàn diện và dịch vụ hỗ trợ khách hàng 24/7
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
