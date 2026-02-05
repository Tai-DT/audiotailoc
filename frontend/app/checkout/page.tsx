'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart as useCartContext } from '@/components/providers/cart-provider';
import {
 ArrowLeft, CreditCard, Truck, MapPin, Phone,
 Mail, User, CheckCircle, ShieldCheck, ShoppingBag,
 Zap, Clock, Sparkles, ChevronRight, Lock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import { BlurFade } from '@/components/ui/blur-fade';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '@/lib/utils';

interface ShippingInfo {
 fullName: string;
 email: string;
 phone: string;
 address: string;
 city: string;
 district: string;
 notes: string;
}

interface PaymentMethod {
 id: string;
 name: string;
 description: string;
 icon: React.ElementType;
}

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

const paymentMethods: PaymentMethod[] = [
 {
 id: 'payos',
 name: 'PayOS (VNPay)',
 description: 'Thanh toán hỏa tốc qua hạ tầng VNPay an toàn.',
 icon: Zap
 },
 {
 id: 'cod',
 name: 'Thanh toán COD',
 description: 'Kiểm tra và thanh toán tiền mặt khi nhận kiệt tác.',
 icon: Truck
 },
];

export default function CheckoutPage() {
 const router = useRouter();
 const { items: cartItems, totalPrice, clearCart } = useCartContext();

 const items = cartItems;
 const total = totalPrice;
 const [currentStep, setCurrentStep] = useState(1);
 const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
 fullName: '',
 email: '',
 phone: '',
 address: '',
 city: '',
 district: '',
 notes: '',
 });
 const [paymentMethod, setPaymentMethod] = useState<string>('cod');
 const [agreeToTerms, setAgreeToTerms] = useState(false);
 const [isProcessing, setIsProcessing] = useState(false);
 const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
 const [isSearchingAddress, setIsSearchingAddress] = useState(false);
 const [selectedPlace, setSelectedPlace] = useState<AddressSuggestion | null>(null);
 const [shippingCoordinates, setShippingCoordinates] = useState<{ lat: number; lng: number } | null>(null);

 const shippingFee = total > 500000 ? 0 : 30000;
 const finalTotal = total + shippingFee;

 useEffect(() => {
 if (items.length === 0) {
 router.push('/cart');
 }
 }, [items.length, router]);

 const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
 const { name, value } = e.target;
 setShippingInfo((prev) => ({ ...prev, [name]: value }));

 if (name === 'address') {
 setSelectedPlace(null);
 setShippingCoordinates(null);
 }
 };

 useEffect(() => {
 const query = shippingInfo.address.trim();
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
 } catch (_error) {
 setAddressSuggestions([]);
 } finally {
 setIsSearchingAddress(false);
 }
 }, 400);

 return () => clearTimeout(timeout);
 }, [shippingInfo.address]);

 const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
 const description = suggestion.description || suggestion.name || '';
 const placeId = suggestion.place_id || suggestion.placeId;

 setShippingInfo((prev) => ({ ...prev, address: description }));
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
 setShippingCoordinates({ lat: location.lat, lng: location.lng });
 }
 } catch (error) {
 console.error('Failed to fetch place detail', error);
 }
 };

 const handleNextStep = () => {
 if (currentStep === 1) {
 const required = ['fullName', 'email', 'phone', 'address'];
 const missing = required.filter((field) => !shippingInfo[field as keyof ShippingInfo]);
 if (missing.length > 0) {
 toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
 return;
 }
 if (!shippingInfo.email.includes('@')) {
 toast.error('Email không hợp lệ');
 return;
 }
 if (!/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(shippingInfo.phone)) {
 toast.error('Số điện thoại không hợp lệ');
 return;
 }
 }

 setCurrentStep((prev) => Math.min(prev + 1, 3));
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const handlePrevStep = () => {
 setCurrentStep((prev) => Math.max(prev - 1, 1));
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const handlePlaceOrder = async () => {
 if (!agreeToTerms) {
 toast.error('Vui lòng đồng ý với điều khoản dịch vụ');
 return;
 }

 setIsProcessing(true);

 try {
 const orderData = {
 customerName: shippingInfo.fullName,
 customerPhone: shippingInfo.phone,
 customerEmail: shippingInfo.email,
 shippingAddress: shippingInfo.address,
 notes: shippingInfo.notes,
 paymentMethod,
 items: items.map((item) => ({
 productId: item.id,
 quantity: item.quantity,
 unitPrice: item.price,
 name: item.name,
 })),
 shippingCoordinates: shippingCoordinates ?? undefined,
 goongPlaceId: selectedPlace?.place_id || selectedPlace?.placeId,
 finalTotal,
 };

 const response = await fetch('/api/payment/process', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ orderData, paymentMethod }),
 });

 const result = await response.json();

 if (result.success) {
 if (paymentMethod === 'payos' && result.paymentUrl) {
 try {
 const orderId = typeof result?.orderId === 'string' ? result.orderId : '';
 const intentId = typeof result?.intentId === 'string' ? result.intentId : '';
 if (orderId && intentId) {
 localStorage.setItem(`atl_payos_intent_${orderId}`, intentId);
 localStorage.setItem('atl_last_payos_order', orderId);
 localStorage.setItem('atl_last_payos_intent', intentId);
 }
 } catch (_err) {
 // ignore storage errors
 }
 toast.success('Khởi tạo thanh toán hỏa tốc...');
 window.location.href = result.paymentUrl;
 return;
 }

 toast.success('Ủy thác đặt hàng thành công!');
 clearCart();
 router.push(`/order-success?orderId=${result.orderId}&method=${paymentMethod}`);
 } else {
 throw new Error(result.error || 'Ủy thác thất bại');
 }
 } catch (error) {
 const errorMessage = error instanceof Error ? error.message : 'Dịch vụ đang bận. Vui lòng thử lại sau.';
 toast.error(errorMessage);
 } finally {
 setIsProcessing(false);
 }
 };

 if (items.length === 0) return null;

 return (
 <main className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white selection:bg-primary/30 pb-20">
 {/* Background Decor */}
 <div className="absolute inset-0 z-0 pointer-events-none">
 <div className="absolute top-0 right-1/4 w-[1000px] h-[1000px] bg-primary/5 blur-[200px] animate-pulse" />
 <div className="absolute inset-0 bg-studio-grid opacity-10" />
 </div>

 <div className="container mx-auto px-4 sm:px-6 relative z-10">
 {/* Header Section */}
 <BlurFade delay={0.1} inView>
 <div className="pt-16 sm:pt-24 pb-8 sm:pb-12 flex flex-col md:flex-row justify-between items-end gap-4 md:gap-8 border-b border-white/5 mb-8 md:mb-12">
 <div className="space-y-4">
 <div className="flex items-center gap-3 px-4 py-2 bg-zinc-50 dark:bg-white/5 rounded-full border border-zinc-200 dark:border-white/10 w-fit">
 <Lock className="w-4 h-4 text-primary animate-pulse" />
 <span className="text-[10px] uppercase font-black tracking-[0.3em] text-foreground/60 dark:text-zinc-200">Secure Checkout Protocol</span>
 </div>
 <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none font-display text-foreground dark:text-white uppercase italic">
 Hoàn <span className="text-primary italic">Tất</span> Đơn hàng
 </h1>
 <p className="text-foreground/40 dark:text-zinc-300 text-sm md:text-base font-medium italic">
 Giai đoạn cuối trong hành trình sở hữu <span className="text-foreground dark:text-white font-bold">tinh hoa âm nhạc</span>
 </p>
 </div>

 <Link href="/cart">
 <button className="h-12 px-6 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-foreground dark:text-white rounded-xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 text-xs italic">
 <ArrowLeft className="w-4 h-4" />
 Hiệu chỉnh Giỏ hàng
 </button>
 </Link>
 </div>
 </BlurFade>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
 <div className="lg:col-span-8 space-y-6 md:space-y-10">
 {/* Elite Stepper */}
 <BlurFade delay={0.2} inView>
 <nav className="flex items-center justify-between bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] backdrop-blur-3xl">
 {[
 { step: 1, icon: User, label: 'Khai báo Giao hàng' },
 { step: 2, icon: CreditCard, label: 'Chọn Phương thức' },
 { step: 3, icon: CheckCircle, label: 'Xác nhận Ủy thác' },
 ].map((item, idx) => (
 <React.Fragment key={item.step}>
 <div className="flex flex-col items-center gap-3 group relative">
 <div className={cn(
 "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border",
 currentStep >= item.step
 ? "bg-primary border-primary text-foreground dark:text-white shadow-lg shadow-primary/30 scale-110"
 : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-foreground/20 dark:text-zinc-500"
 )}>
 <item.icon className="w-4 h-4 md:w-5 md:h-5" />
 </div>
 <span className={cn(
 "text-[9px] font-black uppercase tracking-widest transition-colors",
 currentStep >= item.step ? "text-foreground dark:text-white" : "text-foreground/20 dark:text-zinc-500"
 )}>{item.label}</span>
 </div>
 {idx < 2 && (
 <div className="flex-1 h-[2px] mx-4 md:mx-8 bg-zinc-50 dark:bg-white/5 relative overflow-hidden rounded-full">
 <motion.div
 className="absolute inset-0 bg-primary"
 initial={{ x: "-100%" }}
 animate={{ x: currentStep > item.step ? "0%" : "-100%" }}
 transition={{ duration: 0.8 }}
 />
 </div>
 )}
 </React.Fragment>
 ))}
 </nav>
 </BlurFade>

 {/* Stepper Content Area */}
 <AnimatePresence mode="wait">
 {currentStep === 1 && (
 <motion.div
 key="step1"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-8 backdrop-blur-3xl space-y-5 sm:space-y-8"
 >
 <div className="space-y-2">
 <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight italic">Danh tính <span className="text-primary">&</span> Địa điểm</h3>
 <p className="text-[11px] md:text-xs text-foreground/30 dark:text-zinc-400 italic">Cung cấp thông tin chính xác để quá trình vận chuyển diễn ra hoàn hảo nhất.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
 <div className="space-y-4">
 <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400 dark:text-zinc-300">Họ và tên *</Label>
 <Input
 name="fullName"
 value={shippingInfo.fullName}
 onChange={handleShippingInfoChange}
 placeholder="Ex: NGUYEN VAN A"
 className="h-11 md:h-14 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 rounded-xl focus:border-primary/50 transition-all font-bold"
 />
 </div>
 <div className="space-y-4">
 <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400 dark:text-zinc-300">Địa chỉ Email *</Label>
 <Input
 name="email"
 type="email"
 value={shippingInfo.email}
 onChange={handleShippingInfoChange}
 placeholder="your.email@premium.com"
 className="h-14 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 rounded-xl focus:border-primary/50 transition-all font-bold"
 />
 </div>
 <div className="space-y-4 md:col-span-2">
 <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400 dark:text-zinc-300">Số điện thoại *</Label>
 <Input
 name="phone"
 value={shippingInfo.phone}
 onChange={handleShippingInfoChange}
 placeholder="Ex: 090 123 4567"
 className="h-14 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 rounded-xl focus:border-primary/50 transition-all font-bold"
 />
 </div>
 <div className="space-y-4 md:col-span-2 relative">
 <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400 dark:text-zinc-300">Địa chỉ chi tiết *</Label>
 <Input
 name="address"
 value={shippingInfo.address}
 onChange={handleShippingInfoChange}
 placeholder="Số nhà, tên đường, phường/xã..."
 className="h-14 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 rounded-xl focus:border-primary/50 transition-all font-bold"
 />
 {isSearchingAddress && (
 <div className="absolute right-4 top-13">
 <div className="w-4 h-4 border-2 border-primary border-t-transparent animate-spin rounded-full" />
 </div>
 )}
 {addressSuggestions.length > 0 && (
 <div className="absolute z-50 left-0 right-0 top-[calc(100%+8px)] bg-white dark:bg-slate-900 border border-zinc-200 dark:border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-3xl divide-y divide-zinc-100 dark:divide-white/5">
 {addressSuggestions.map((suggestion, idx) => (
 <button
 key={idx}
 type="button"
 className="w-full text-left px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-50 dark:bg-white/5 transition-colors group"
 onClick={() => handleSelectSuggestion(suggestion)}
 >
 <div className="text-sm font-bold text-zinc-800 dark:text-white group-hover:text-primary transition-colors">
 {suggestion.structured_formatting?.main_text || suggestion.description}
 </div>
 <div className="text-[10px] text-zinc-500 dark:text-zinc-400 italic truncate">
 {suggestion.structured_formatting?.secondary_text || ''}
 </div>
 </button>
 ))}
 </div>
 )}
 </div>
 </div>

 <div className="space-y-4">
 <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400 dark:text-zinc-300">Ghi chú yêu cầu (Tùy chọn)</Label>
 <Textarea
 name="notes"
 value={shippingInfo.notes}
 onChange={handleShippingInfoChange}
 placeholder="Các yêu cầu đặc biệt về kỹ thuật hoặc giao hàng..."
 rows={4}
 className="bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 rounded-2xl focus:border-primary/50 transition-all font-bold p-6"
 />
 </div>
 </motion.div>
 )}

 {currentStep === 2 && (
 <motion.div
 key="step2"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 backdrop-blur-3xl space-y-10 sm:space-y-12"
 >
 <div className="space-y-2">
 <h3 className="text-2xl font-black uppercase tracking-tight italic">Lựa chọn <span className="text-primary">Thanh khoản</span></h3>
 <p className="text-xs text-foreground/30 dark:text-zinc-400 italic">Tất cả giao dịch đều được mã hóa theo tiêu chuẩn an ninh hạ tầng ngân hàng.</p>
 </div>

 <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {paymentMethods.map((method) => (
 <div key={method.id} className="relative group">
 <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
 <Label
 htmlFor={method.id}
 className={cn(
 "flex flex-col p-5 sm:p-8 rounded-[2rem] border transition-all duration-500 cursor-pointer h-full",
 "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 peer-checked:bg-primary/10 peer-checked:border-primary group-hover:border-primary/50"
 )}
 >
 <div className={cn(
 "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500",
 paymentMethod === method.id ? "bg-primary text-foreground dark:text-white" : "bg-zinc-50 dark:bg-white/5 text-foreground/40 dark:text-zinc-300 border-zinc-200 dark:border-white/10"
 )}>
 <method.icon className="w-7 h-7" />
 </div>
 <h4 className="text-xl font-black uppercase tracking-tight mb-2 italic">{method.name}</h4>
 <p className="text-[11px] text-foreground/40 dark:text-zinc-300 italic font-medium leading-relaxed">{method.description}</p>
 </Label>
 <div className={cn(
 "absolute top-6 right-6 w-6 h-6 rounded-full border-2 transition-all duration-500",
 paymentMethod === method.id ? "bg-primary border-primary scale-110" : "bg-transparent border-zinc-200 dark:border-white/10"
 )}>
 {paymentMethod === method.id && <CheckCircle className="w-5 h-5 text-foreground dark:text-white p-0.5" />}
 </div>
 </div>
 ))}
 </RadioGroup>
 </motion.div>
 )}

 {currentStep === 3 && (
 <motion.div
 key="step3"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 backdrop-blur-3xl space-y-10 sm:space-y-12"
 >
 <div className="space-y-2">
 <h3 className="text-2xl font-black uppercase tracking-tight italic">Kiểm duyệt <span className="text-primary">Ủy thác</span></h3>
 <p className="text-xs text-foreground/30 dark:text-zinc-400 italic">Lần soát xét cuối cùng trước khi chúng tôi tiến hành chuẩn bị kiệt tác của bạn.</p>
 </div>

 <div className="grid md:grid-cols-2 gap-12">
 <div className="p-8 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[2rem] space-y-6">
 <div className="flex items-center gap-4 text-primary">
 <MapPin className="w-5 h-5" />
 <h4 className="text-[10px] uppercase font-black tracking-widest text-foreground dark:text-white italic">Điểm đến Vận hành</h4>
 </div>
 <div className="space-y-3">
 <p className="text-lg font-black text-foreground dark:text-white">{shippingInfo.fullName}</p>
 <p className="text-sm text-zinc-400 dark:text-zinc-300 font-medium italic leading-relaxed">{shippingInfo.address}</p>
 <div className="flex gap-4 pt-2">
 <span className="flex items-center gap-2 text-xs font-bold text-foreground/40 dark:text-zinc-300 italic"><Phone className="w-3 h-3 text-primary" /> {shippingInfo.phone}</span>
 <span className="flex items-center gap-2 text-xs font-bold text-foreground/40 dark:text-zinc-300 italic"><Mail className="w-3 h-3 text-primary" /> {shippingInfo.email}</span>
 </div>
 </div>
 </div>

 <div className="p-8 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[2rem] space-y-6">
 <div className="flex items-center gap-4 text-primary">
 <CreditCard className="w-5 h-5" />
 <h4 className="text-[10px] uppercase font-black tracking-widest text-foreground dark:text-white italic">Kịch bản Thanh toán</h4>
 </div>
 <div className="space-y-3">
 <p className="text-lg font-black text-foreground dark:text-white">
 {paymentMethods.find(m => m.id === paymentMethod)?.name}
 </p>
 <p className="text-sm text-zinc-400 dark:text-zinc-300 font-medium italic leading-relaxed">
 {paymentMethods.find(m => m.id === paymentMethod)?.description}
 </p>
 </div>
 </div>
 </div>

 <div className="p-8 border border-zinc-200 dark:border-white/10 rounded-[2rem] flex items-start gap-6 group hover:border-primary/30 transition-colors">
 <Checkbox
 id="terms"
 checked={agreeToTerms}
 onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
 className="mt-1 w-6 h-6 rounded-lg border-zinc-200 dark:border-white/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
 />
 <Label htmlFor="terms" className="text-xs text-foreground/40 dark:text-zinc-300 font-medium italic leading-relaxed cursor-pointer group-hover:text-foreground/60 dark:text-zinc-200 transition-colors">
 Tôi cam kết các thông tin khai báo là hoàn toàn chính xác và xác nhận đồng ý với
 <Link href="/terms" className="text-primary font-bold hover:underline mx-1">Điều khoản ủy thác</Link>
 &
 <Link href="/privacy" className="text-primary font-bold hover:underline mx-1">Chính sách bảo mật</Link>
 của Audio Tài Lộc.
 </Label>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Stepper Navigation Buttons */}
 <div className="flex flex-wrap gap-6 pt-8">
 {currentStep > 1 && (
 <button
 onClick={handlePrevStep}
 className="h-16 px-12 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-foreground dark:text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-4 italic text-sm"
 >
 <ArrowLeft className="w-4 h-4" />
 Quay lại
 </button>
 )}
 {currentStep < 3 ? (
 <button
 onClick={handleNextStep}
 className="h-16 px-12 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-4 italic text-sm ml-auto shadow-2xl shadow-white/5"
 >
 Tiếp tục
 <ChevronRight className="w-4 h-4" />
 </button>
 ) : (
 <button
 onClick={handlePlaceOrder}
 disabled={isProcessing || !agreeToTerms}
 className={cn(
 "h-20 px-16 bg-primary text-foreground dark:text-white rounded-2xl font-black uppercase tracking-[0.4em] transition-all flex items-center gap-6 italic ml-auto shadow-2xl shadow-primary/30",
 "hover:bg-red-500 hover:scale-[1.02] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
 )}
 >
 {isProcessing ? (
 <>
 <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
 Đang Khởi tạo...
 </>
 ) : (
 <>
 Xác nhận Giao dịch
 <Sparkles className="w-6 h-6" />
 </>
 )}
 </button>
 )}
 </div>
 </div>

 {/* Right Summary Sidebar */}
 <div className="lg:col-span-4 lg:relative">
 <BlurFade delay={0.4} inView>
 <aside className="sticky top-40 space-y-8">
 <div className="p-10 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[3rem] backdrop-blur-3xl shadow-3xl relative overflow-hidden group">
 {/* Accent decoration */}
 <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
 <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] -z-10" />

 <div className="flex items-center gap-4 mb-10">
 <ShoppingBag className="w-6 h-6 text-primary" />
 <h2 className="text-2xl font-black uppercase tracking-tighter italic font-display">Tóm tắt <span className="text-primary">Ủy thác</span></h2>
 </div>

 <div className="space-y-6 mb-10 max-h-[30vh] overflow-y-auto no-scrollbar pr-2">
 {items.map((item) => (
 <div key={item.id} className="flex gap-5 group/item">
 <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-white/5 border border-white/5 flex-shrink-0 group-hover/item:border-primary/40 transition-colors">
 <Image
 src={item.image || '/placeholder-product.jpg'}
 alt={item.name}
 fill
 className="object-contain p-2"
 />
 </div>
 <div className="flex-1 min-w-0 space-y-1">
 <p className="text-xs font-black uppercase tracking-tight text-foreground dark:text-white line-clamp-1 italic group-hover/item:text-primary transition-colors">{item.name}</p>
 <p className="text-[10px] text-foreground/30 dark:text-zinc-400 font-bold italic tracking-widest">
 Qty: {item.quantity} × {formatCurrency(item.price)}
 </p>
 </div>
 <div className="text-sm font-black text-foreground/80 dark:text-white/80 tracking-tighter tabular-nums">
 {formatCurrency(item.price * item.quantity)}
 </div>
 </div>
 ))}
 </div>

 <div className="space-y-6 pt-10 border-t border-white/5">
 <div className="flex justify-between items-center">
 <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 dark:text-zinc-400 italic">Tạm tính Portfolio</span>
 <span className="text-sm font-bold tracking-tighter tabular-nums text-foreground/80 dark:text-white/80">{formatCurrency(total)}</span>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 dark:text-zinc-400 italic">Lao giới Vận hành</span>
 <span className={cn(
 "text-sm font-bold tracking-tighter tabular-nums",
 shippingFee === 0 ? "text-primary italic animate-pulse" : "text-foreground/80 dark:text-white/80"
 )}>
 {shippingFee === 0 ? "Complimentary" : formatCurrency(shippingFee)}
 </span>
 </div>

 <div className="pt-6 border-t border-white/5 flex justify-between items-end">
 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Final Balance</span>
 <div className="text-right">
 <div className="text-4xl font-black text-primary tracking-tighter tabular-nums drop-shadow-2xl">
 {formatCurrency(finalTotal)}
 </div>
 <p className="text-[9px] text-foreground/20 dark:text-zinc-500 italic font-medium mt-1 uppercase tracking-widest">Global Protocol Standards</p>
 </div>
 </div>
 </div>
 </div>

 {/* Trust Cards */}
 <div className="grid grid-cols-2 gap-6">
 <div className="p-6 bg-zinc-50 dark:bg-white/5 border border-white/5 rounded-2xl text-center space-y-3">
 <Clock className="w-5 h-5 mx-auto text-primary opacity-50" />
 <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 dark:text-zinc-300 italic">Giao hàng Hỏa tốc 48H</p>
 </div>
 <div className="p-6 bg-zinc-50 dark:bg-white/5 border border-white/5 rounded-2xl text-center space-y-3">
 <ShieldCheck className="w-5 h-5 mx-auto text-primary opacity-50" />
 <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 dark:text-zinc-300 italic">Mã hóa Giao dịch 256-bit</p>
 </div>
 </div>
 </aside>
 </BlurFade>
 </div>
 </div>
 </div>
 </main>
 );
}
