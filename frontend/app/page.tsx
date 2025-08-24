'use client';

import { motion } from 'framer-motion';
import { Button } from '../../shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  SpeakerWaveIcon, 
  MusicalNoteIcon,
  StarIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Audio Tài Lộc
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Nâng tầm trải nghiệm âm thanh với các sản phẩm chất lượng cao và dịch vụ chuyên nghiệp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                <Link href="/services">
                  Khám phá dịch vụ
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                <Link href="/booking">
                  Đặt lịch ngay
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
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
              Chúng tôi cam kết mang đến trải nghiệm âm thanh tuyệt vời với đội ngũ chuyên nghiệp
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SpeakerWaveIcon className="w-8 h-8 text-primary-600" />
                  </div>
                  <CardTitle>Chất lượng cao</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Sử dụng các thiết bị âm thanh chính hãng, chất lượng cao với độ bền và hiệu suất vượt trội
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SpeakerWaveIcon className="w-8 h-8 text-primary-600" />
                  </div>
                  <CardTitle>Kỹ thuật viên chuyên nghiệp</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Đội ngũ kỹ thuật viên giàu kinh nghiệm, được đào tạo chuyên sâu về âm thanh và lắp đặt
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MusicalNoteIcon className="w-8 h-8 text-primary-600" />
                  </div>
                  <CardTitle>Dịch vụ toàn diện</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Từ tư vấn, lắp đặt đến bảo trì, chúng tôi cung cấp dịch vụ trọn gói cho mọi nhu cầu âm thanh
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-gray-50">
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
              Khám phá các dịch vụ âm thanh chuyên nghiệp của chúng tôi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Lắp đặt hệ thống âm thanh',
                description: 'Thiết kế và lắp đặt hệ thống âm thanh chuyên nghiệp cho gia đình, văn phòng',
                price: '2,000,000 VND',
                badge: 'Phổ biến'
              },
              {
                title: 'Bảo trì và sửa chữa',
                description: 'Dịch vụ bảo trì định kỳ và sửa chữa các thiết bị âm thanh',
                price: '500,000 VND',
                badge: 'Tiết kiệm'
              },
              {
                title: 'Tư vấn âm thanh',
                description: 'Tư vấn chuyên môn về thiết kế và lựa chọn thiết bị âm thanh',
                price: '300,000 VND',
                badge: 'Miễn phí'
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <Badge variant="secondary">{service.badge}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {service.description}
                    </CardDescription>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary-600">
                        {service.price}
                      </span>
                      <Button asChild size="sm">
                        <Link href="/booking">Đặt lịch</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button asChild size="lg">
              <Link href="/services">
                Xem tất cả dịch vụ
              </Link>
            </Button>
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
                    <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
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
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
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

