'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateServiceBooking } from '@/lib/hooks/use-booking';
import { useAuth } from '@/lib/hooks/use-auth';
import { Service } from '@/lib/types';
import { CalendarIcon, Clock, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api';

interface ServiceBookingModalProps {
 service: Service;
 isOpen: boolean;
 onClose: () => void;
}

const timeSlots = [
 '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

type AddressSuggestion = {
 description?: string;
 place_id?: string;
 placeId?: string;
 name?: string;
 structured_formatting?: {
 main_text?: string;
 secondary_text?: string;
 };
};

export function ServiceBookingModal({ service, isOpen, onClose }: ServiceBookingModalProps) {
 const authResult = useAuth();
 const user = authResult.data;
 const isAuthenticated = !!user;

 console.log('ServiceBookingModal Rendered! Hooks Version Check.');

 const [formData, setFormData] = useState({
 customerName: '',
 phone: '',
 email: '',
 address: '',
 preferredDate: '',
 preferredTime: '',
 notes: ''
 });
 const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
 const [isSearchingAddress, setIsSearchingAddress] = useState(false);
 const [selectedPlace, setSelectedPlace] = useState<AddressSuggestion | null>(null);
 const [bookingCoordinates, setBookingCoordinates] = useState<{ lat: number; lng: number } | null>(null);

 // Auto-fill user info when logged in
 useEffect(() => {
 if (isAuthenticated && user) {
 setFormData(prev => ({
 ...prev,
 customerName: user.name || prev.customerName,
 email: user.email || prev.email,
 phone: user.phone || prev.phone,
 address: user.address || prev.address
 }));
 }
 }, [isAuthenticated, user, isOpen]);

 const createBooking = useCreateServiceBooking();

 const handleInputChange = (field: string, value: string) => {
 setFormData(prev => ({ ...prev, [field]: value }));

 if (field === 'address') {
 setSelectedPlace(null);
 setBookingCoordinates(null);
 }
 };

 useEffect(() => {
 const query = formData.address.trim();
 if (query.length < 3) {
 setAddressSuggestions([]);
 return;
 }

 const timeout = setTimeout(async () => {
 try {
 setIsSearchingAddress(true);
 const response = await apiClient.get('/maps/geocode', { params: { query } });

 const responseData = response.data;
 let suggestions: AddressSuggestion[] = [];

 if (responseData?.success && responseData?.data) {
 suggestions = responseData.data.predictions || [];
 } else if (responseData?.predictions) {
 suggestions = responseData.predictions || [];
 } else if (Array.isArray(responseData)) {
 suggestions = responseData;
 }

 setAddressSuggestions(suggestions);
 } catch (error) {
 console.error('Failed to fetch address suggestions', error);
 setAddressSuggestions([]);
 } finally {
 setIsSearchingAddress(false);
 }
 }, 400);

 return () => clearTimeout(timeout);
 }, [formData.address]);

 const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
 const description = suggestion.description || suggestion.name || '';
 const placeId = suggestion.place_id || suggestion.placeId;

 setFormData(prev => ({ ...prev, address: description }));
 setSelectedPlace(suggestion);
 setAddressSuggestions([]);

 if (!placeId) return;

 try {
 const response = await apiClient.get('/maps/place-detail', { params: { placeId } });
 const responseData = response.data;
 let detail = null;

 if (responseData?.success && responseData?.data) {
 detail = responseData.data.result || responseData.data;
 } else if (responseData?.result) {
 detail = responseData.result;
 } else {
 detail = responseData;
 }

 const location = detail?.geometry?.location;
 if (location && typeof location.lat === 'number' && typeof location.lng === 'number') {
 setBookingCoordinates({ lat: location.lat, lng: location.lng });
 }
 } catch (error) {
 console.error('Failed to fetch place detail', error);
 }
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();

 // Validation
 if (!formData.customerName || !formData.phone || !formData.email || !formData.preferredDate || !formData.preferredTime) {
 toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
 return;
 }

 if (!/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
 toast.error('Số điện thoại không hợp lệ');
 return;
 }

 if (!formData.email.includes('@')) {
 toast.error('Email không hợp lệ');
 return;
 }

 try {
 await createBooking.mutateAsync({
 serviceId: service.id,
 customerName: formData.customerName,
 customerPhone: formData.phone,
 customerEmail: formData.email,
 customerAddress: formData.address || '',
 coordinates: bookingCoordinates || undefined,
 goongPlaceId: selectedPlace?.place_id || selectedPlace?.placeId,
 scheduledDate: formData.preferredDate,
 scheduledTime: formData.preferredTime,
 notes: formData.notes,
 });

 toast.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
 onClose();

 // Reset form
 setFormData({
 customerName: '',
 phone: '',
 email: '',
 address: '',
 preferredDate: '',
 preferredTime: '',
 notes: ''
 });
 setSelectedPlace(null);
 setBookingCoordinates(null);
 } catch (error) {
 console.error('Booking error:', error);
 toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
 }
 };

 return (
 <Dialog open={isOpen} onOpenChange={onClose}>
 <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
 <DialogHeader>
 <DialogTitle className="flex items-center gap-2">
 <CalendarIcon className="h-5 w-5" />
 Đặt lịch dịch vụ: {service.name}
 </DialogTitle>
 <DialogDescription>
 Điền thông tin để đặt lịch dịch vụ
 </DialogDescription>
 </DialogHeader>

 <form onSubmit={handleSubmit} className="space-y-6">
 {/* Service Info */}
 <div className="bg-muted/50 p-4 rounded-lg">
 <h3 className="font-semibold mb-2">{service.name}</h3>
 <div className="flex items-center gap-4 text-sm text-muted-foreground">
 <div className="flex items-center gap-1">
 <Clock className="h-4 w-4" />
 {service.duration} phút
 </div>
 <div className="font-semibold text-primary">
 {service.priceType === 'FIXED' && `${service.price.toLocaleString('vi-VN')}₫`}
 {service.priceType === 'RANGE' && `Từ ${service.price.toLocaleString('vi-VN')}₫`}
 {service.priceType === 'NEGOTIABLE' && 'Giá thỏa thuận'}
 {service.priceType === 'CONTACT' && 'Liên hệ tư vấn'}
 </div>
 </div>
 </div>

 {/* Customer Information */}
 <div className="space-y-4">
 <h4 className="font-semibold flex items-center gap-2">
 <User className="h-4 w-4" />
 Thông tin khách hàng
 </h4>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-2">
 <Label htmlFor="customerName">Họ và tên *</Label>
 <Input
 id="customerName"
 value={formData.customerName}
 onChange={(e) => handleInputChange('customerName', e.target.value)}
 placeholder="Nhập họ và tên"
 required
 />
 </div>

 <div className="space-y-2">
 <Label htmlFor="phone">Số điện thoại *</Label>
 <Input
 id="phone"
 type="tel"
 value={formData.phone}
 onChange={(e) => handleInputChange('phone', e.target.value)}
 placeholder="Nhập số điện thoại"
 required
 />
 </div>

 <div className="space-y-2">
 <Label htmlFor="email">Email *</Label>
 <Input
 id="email"
 type="email"
 value={formData.email}
 onChange={(e) => handleInputChange('email', e.target.value)}
 placeholder="Nhập địa chỉ email"
 required
 />
 </div>

 <div className="space-y-2">
 <Label htmlFor="address">Địa chỉ</Label>
 <Input
 id="address"
 value={formData.address}
 onChange={(e) => handleInputChange('address', e.target.value)}
 placeholder="Nhập địa chỉ thực hiện dịch vụ"
 aria-describedby="address-suggestions"
 />
 {isSearchingAddress && (
 <p className="text-xs text-muted-foreground">Đang tìm kiếm địa chỉ...</p>
 )}
 {!isSearchingAddress && addressSuggestions.length > 0 && (
 <div className="border rounded-lg mt-2 divide-y bg-background overflow-hidden">
 {addressSuggestions.map((suggestion, index) => (
 <button
 key={`${suggestion.place_id || suggestion.placeId || index}`}
 type="button"
 className="w-full text-left px-3 py-2 hover:bg-muted"
 onClick={() => handleSelectSuggestion(suggestion)}
 >
 <div className="text-sm font-medium">
 {suggestion.structured_formatting?.main_text || suggestion.description || suggestion.name}
 </div>
 {suggestion.structured_formatting?.secondary_text && (
 <div className="text-xs text-muted-foreground">
 {suggestion.structured_formatting.secondary_text}
 </div>
 )}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Schedule Selection */}
 <div className="space-y-4">
 <h4 className="font-semibold">Chọn thời gian</h4>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-2">
 <Label htmlFor="preferredDate">Ngày thực hiện *</Label>
 <Input
 id="preferredDate"
 type="date"
 value={formData.preferredDate}
 onChange={(e) => handleInputChange('preferredDate', e.target.value)}
 min={new Date().toISOString().split('T')[0]}
 required
 />
 </div>

 <div className="space-y-2">
 <Label>Giờ thực hiện *</Label>
 <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
 <SelectTrigger>
 <SelectValue placeholder="Chọn giờ" />
 </SelectTrigger>
 <SelectContent>
 {timeSlots.map((time) => (
 <SelectItem key={time} value={time}>
 {time}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 </div>
 </div>

 {/* Notes */}
 <div className="space-y-2">
 <Label htmlFor="notes">Ghi chú thêm</Label>
 <Textarea
 id="notes"
 value={formData.notes}
 onChange={(e) => handleInputChange('notes', e.target.value)}
 placeholder="Mô tả chi tiết về vấn đề cần sửa chữa hoặc yêu cầu đặc biệt..."
 rows={3}
 />
 </div>

 {/* Submit Buttons */}
 <div className="flex gap-3 pt-4">
 <Button
 type="button"
 variant="outline"
 onClick={onClose}
 className="flex-1"
 >
 Hủy
 </Button>
 <Button
 type="submit"
 className="flex-1"
 disabled={createBooking.isPending}
 >
 {createBooking.isPending ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
 </Button>
 </div>
 </form>
 </DialogContent>
 </Dialog>
 );
}
