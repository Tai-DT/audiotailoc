'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  CalendarIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  StarIcon,
  CheckCircleIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowLeftIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api-client';
import { Service } from '@/lib/api-client';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (params.slug) {
      fetchService();
    }
  }, [params.slug]);

  const fetchService = async () => {
    try {
      setIsLoading(true);
      const response = await api.services.getBySlug(params.slug as string);
      setService(response.data.data);
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Không thể tải thông tin dịch vụ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemToggle = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleBooking = () => {
    if (!service) return;
    
    const selectedItemsArray = Array.from(selectedItems);
    const queryParams = new URLSearchParams({
      serviceId: service.id,
      items: selectedItemsArray.join(',')
    });
    
    router.push(`/booking?${queryParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-gray-200 rounded-lg h-96 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy dịch vụ</h1>
          <Link href="/services" className="text-primary-600 hover:text-primary-500">
            Quay lại danh sách dịch vụ
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = service.basePriceCents + 
    service.items
      .filter(item => selectedItems.has(item.id))
      .reduce((sum, item) => sum + item.priceCents, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gray-500">
                  Trang chủ
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <Link href="/services" className="text-gray-400 hover:text-gray-500">
                    Dịch vụ
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-gray-900">{service.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Service Image */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                <div className="aspect-video relative">
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">AT</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">4.8 (128 đánh giá)</span>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Service Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Thời gian</p>
                      <p className="font-medium">{service.estimatedDuration} phút</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Giá cơ bản</p>
                      <p className="font-medium">{service.basePriceCents.toLocaleString()} VND</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Trạng thái</p>
                      <p className="font-medium text-green-600">Có sẵn</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                {service.features && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tính năng</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{service.features}</p>
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {service.requirements && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Yêu cầu</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{service.requirements}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Service Items */}
              {service.items && service.items.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Hạng mục dịch vụ</h3>
                  <div className="space-y-4">
                    {service.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedItems.has(item.id)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleItemToggle(item.id)}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => handleItemToggle(item.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <div className="ml-4">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {item.priceCents.toLocaleString()} VND
                          </p>
                          {item.isRequired && (
                            <p className="text-xs text-red-600">Bắt buộc</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-8"
            >
              {/* Booking Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Đặt lịch dịch vụ</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá cơ bản:</span>
                    <span className="font-medium">{service.basePriceCents.toLocaleString()} VND</span>
                  </div>
                  
                  {selectedItems.size > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-2">Hạng mục đã chọn:</p>
                      {service.items
                        .filter(item => selectedItems.has(item.id))
                        .map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.name}</span>
                            <span>{item.priceCents.toLocaleString()} VND</span>
                          </div>
                        ))}
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Tổng cộng:</span>
                      <span className="text-primary-600">{totalPrice.toLocaleString()} VND</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Đặt lịch ngay
                </button>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Liên hệ tư vấn</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Hotline</p>
                      <p className="font-medium">0912 345 678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Tư vấn viên</p>
                      <p className="font-medium">Hỗ trợ 24/7</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="font-medium">123 Đường ABC, Q1, TP.HCM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">Cam kết của chúng tôi</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Tư vấn miễn phí
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Bảo hành chính hãng
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Đúng tiến độ
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Giá cả minh bạch
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
