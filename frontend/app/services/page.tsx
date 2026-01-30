'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useServices, useServiceTypes } from '@/lib/hooks/use-api';
import { ServiceFilters as ServiceFiltersType, ServiceType } from '@/lib/types';
import { useContactInfo } from '@/lib/hooks/use-contact-info';
import { useSiteStats } from '@/lib/hooks/use-site-stats';

import { ServiceGrid } from '@/components/services/service-grid';
import { ServiceFilters } from '@/components/services/service-filters';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BlurFade } from '@/components/ui/blur-fade';
import { cn } from '@/lib/utils';
import {
 SlidersHorizontal, Wrench,
 Star, Clock, Shield, Phone, ArrowRight, X,
 Headphones, Settings, Zap, Music4
} from 'lucide-react';

function ServicesLoading() {
 return (
 <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center p-12">
 <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center animate-pulse mb-6">
 <Music4 className="w-8 h-8 text-primary" />
 </div>
 <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
 <div className="h-full bg-primary animate-progress" style={{ width: '40%' }} />
 </div>
 </div>
 );
}

// Service type icons mapping
const serviceTypeIcons: Record<string, React.ElementType> = {
 'sua-chua': Wrench,
 'lap-dat': Settings,
 'bao-tri': Shield,
 'tu-van': Headphones,
};

function ServicesPageContent() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const { data: serviceTypes } = useServiceTypes();
 const { data: contactInfo } = useContactInfo();
 const { data: siteStats } = useSiteStats();
 const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
 const [hasMounted, setHasMounted] = useState(false);

 const [filters, setFilters] = useState<ServiceFiltersType>({
 typeId: undefined,
 minPrice: undefined,
 maxPrice: undefined,
 sortBy: 'createdAt',
 sortOrder: 'desc',
 page: 1,
 pageSize: 12
 });

 useEffect(() => {
 setHasMounted(true);
 }, []);

 // Initialize filters from URL
 useEffect(() => {
 const typeParam = searchParams.get('type');
 const pageParam = searchParams.get('page');

 let typeId: string | undefined;
 if (typeParam && serviceTypes) {
 const matchingType = serviceTypes.find(t => t.slug === typeParam || t.id === typeParam);
 typeId = matchingType?.id;
 }

 setFilters(prev => ({
 ...prev,
 typeId: typeId || prev.typeId,
 page: pageParam ? parseInt(pageParam, 10) : 1
 }));
 }, [searchParams, serviceTypes]);

 const { data, isLoading } = useServices(filters);
 const hotlineNumber = contactInfo?.phone?.hotline
 || contactInfo?.phone?.display?.replace(/\s+/g, '')
 || '';
 const hotlineDisplay = contactInfo?.phone?.display || contactInfo?.phone?.hotline || '';

 const handleFiltersChange = (newFilters: Partial<ServiceFiltersType>) => {
 const updatedFilters = { ...filters, ...newFilters, page: 1 };
 setFilters(updatedFilters);
 updateURL(updatedFilters);
 setIsMobileFilterOpen(false);
 };

 const handlePageChange = (newPage: number) => {
 const updatedFilters = { ...filters, page: newPage };
 setFilters(updatedFilters);
 updateURL(updatedFilters);
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const handleClearFilters = () => {
 const clearedFilters: ServiceFiltersType = {
 typeId: undefined,
 minPrice: undefined,
 maxPrice: undefined,
 sortBy: 'createdAt',
 sortOrder: 'desc',
 page: 1,
 pageSize: 12
 };
 setFilters(clearedFilters);
 router.push('/services', { scroll: false });
 };

 const updateURL = (updatedFilters: ServiceFiltersType) => {
 const params = new URLSearchParams();

 if (updatedFilters.typeId) {
 const serviceType = serviceTypes?.find(t => t.id === updatedFilters.typeId);
 if (serviceType) params.set('type', serviceType.slug);
 }
 if (updatedFilters.page && updatedFilters.page > 1) {
 params.set('page', updatedFilters.page.toString());
 }

 const queryString = params.toString();
 router.push(`/services${queryString ? `?${queryString}` : ''}`, { scroll: false });
 };

 const services = data?.items || [];
 const totalPages = data?.totalPages || 1;
 const totalItems = data?.total || services.length;

 const activeFilterCount = [filters.minPrice || filters.maxPrice, filters.typeId].filter(Boolean).length;
 const currentServiceType = serviceTypes?.find(t => t.id === filters.typeId);
 const heroStats = (siteStats || [])
 .filter((stat) => stat.isActive)
 .sort((a, b) => a.displayOrder - b.displayOrder)
 .slice(0, 3)
 .map((stat) => ({ value: stat.value, label: stat.label }));

 if (!hasMounted) {
 return <ServicesLoading />;
 }

 return (
 <main className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white selection:bg-primary/30" role="main">
 {/* Cinematic Hero */}
 <section className="relative pt-32 pb-24 overflow-hidden">
 <div className="absolute inset-0 z-0">
 <div className="absolute top-0 right-1/4 w-[1000px] h-[1000px] bg-primary/5 blur-[150px] animate-pulse" />
 <div className="absolute inset-0 bg-studio-grid opacity-20" />
 </div>

 <div className="container mx-auto px-6 relative z-10">
 <BlurFade delay={0.1} inView>
 <div className="grid lg:grid-cols-2 gap-20 items-center">
 <div className="space-y-10">
 <div className="space-y-6">
 <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 w-fit backdrop-blur-3xl">
 <Wrench className="w-4 h-4 text-primary animate-pulse" />
 <span className="text-[10px] uppercase font-black tracking-[0.3em] text-foreground/60 dark:text-zinc-200">Expert Craftsmanship</span>
 </div>
 <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none font-display text-foreground dark:text-white uppercase italic">
 {currentServiceType ? (
 <>
 {currentServiceType.name} <br />
 <span className="text-primary">Đẳng cấp</span>
 </>
 ) : (
 <>
 Dịch vụ <br />
 <span className="text-primary italic">Thượng hạng</span>
 </>
 )}
 </h1>
 <p className="text-foreground/40 dark:text-zinc-300 text-lg font-medium leading-relaxed italic border-l-2 border-primary/20 pl-8 max-w-lg">
 {currentServiceType?.description ||
 'Mỗi giải pháp kỹ thuật là một tác phẩm nghệ thuật, được thực thi bởi những kỹ sư âm học tâm huyết nhất của Audio Tài Lộc.'}
 </p>
 </div>

 {/* Hero Stats */}
 <div className="flex items-center gap-12">
 {heroStats.map((stat, idx) => (
 <div key={idx} className="space-y-1">
 <div className="text-3xl font-black text-foreground dark:text-white tracking-tighter tabular-nums">{stat.value}</div>
 <p className="text-[10px] font-black uppercase tracking-widest text-primary">{stat.label}</p>
 </div>
 ))}
 </div>

 <div className="flex flex-wrap gap-6 text-center">
 <a href={`tel:${hotlineNumber}`} className="group">
 <button className="h-14 px-10 bg-primary text-foreground dark:text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-primary/20 flex items-center gap-4">
 <Phone className="w-4 h-4" />
 Kết nối Chuyên gia
 </button>
 </a>
 <Link href="#services-grid">
 <button className="h-14 px-10 bg-white/5 border border-white/10 text-foreground dark:text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-4">
 Duyệt Danh mục
 <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
 </button>
 </Link>
 </div>
 </div>

 {/* Service Types Icons Display */}
 <div className="hidden lg:grid grid-cols-2 gap-6 relative">
 {/* Decorative Ambient Light */}
 <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10" />
 {serviceTypes?.slice(0, 4).map((type: ServiceType) => {
 const Icon = serviceTypeIcons[type.slug] || Wrench;
 const isActive = filters.typeId === type.id;

 return (
 <button
 key={type.id}
 onClick={() => handleFiltersChange({ typeId: isActive ? undefined : type.id })}
 className={cn(
 "group p-8 rounded-[2.5rem] text-left transition-all duration-700",
 "border backdrop-blur-3xl",
 isActive
 ? "bg-primary/10 border-primary/50 shadow-2xl shadow-primary/20 translate-y-[-8px]"
 : "bg-white/5 border-white/10 hover:border-primary/40 hover:-translate-y-2",
 )}
 >
 <div className={cn(
 "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110",
 isActive
 ? "bg-primary text-foreground dark:text-white shadow-lg shadow-primary/30"
 : "bg-white/5 text-primary border border-white/10"
 )}>
 <Icon className="w-7 h-7" />
 </div>
 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/30 dark:text-zinc-300 mb-2 group-hover:text-primary transition-colors">Specialty Service</p>
 <h3 className="text-lg font-black text-foreground dark:text-white uppercase tracking-tight italic mb-3">{type.name}</h3>
 <p className="text-[11px] text-foreground/40 dark:text-zinc-300 italic line-clamp-2 leading-relaxed font-medium">
 {type.description || 'Tiêu chuẩn quốc tế'}
 </p>
 </button>
 );
 })}
 </div>
 </div>
 </BlurFade>
 </div>
 </section>

 {/* Trust Line */}
 <section className="py-12 border-y border-white/5 bg-white/[0.02]">
 <div className="container mx-auto px-6">
 <div className="flex flex-wrap justify-between gap-12  font-black italic uppercase text-[10px] tracking-[0.4em]">
 {[
 { icon: Star, label: 'Thang điểm 5.0' },
 { icon: Clock, label: 'Linh hoạt 24/7' },
 { icon: Shield, label: 'Bảo hộ Platinum' },
 { icon: Zap, label: 'Thi hành Hỏa tốc' },
 ].map((item, index) => (
 <div key={index} className="flex items-center gap-4 group cursor-help">
 <item.icon className="w-4 h-4 text-primary group-hover:scale-125 transition-transform" />
 <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors">{item.label}</span>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Filter Bar: Elite Sticky Navigation */}
 <section className="sticky top-[72px] z-40 bg-background/80 dark:bg-background dark:bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
 <div className="container mx-auto px-6 py-4">
 <div className="flex items-center justify-between gap-8">
 {/* Mobile Filter */}
 <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
 <SheetTrigger asChild>
 <button
 className="lg:hidden h-12 px-6 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-foreground dark:text-white hover:bg-white/10 transition-all"
 >
 <SlidersHorizontal className="h-4 w-4 text-primary" />
 Filter
 {activeFilterCount > 0 && (
 <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary text-[10px]">
 {activeFilterCount}
 </span>
 )}
 </button>
 </SheetTrigger>
 <SheetContent side="left" className="w-full max-w-sm bg-background dark:bg-slate-950 border-white/10 text-foreground dark:text-white">
 <SheetHeader>
 <SheetTitle className="text-foreground dark:text-white font-black uppercase tracking-tight">Tùy biến bộ lọc</SheetTitle>
 </SheetHeader>
 <div className="mt-8">
 <ServiceFilters
 filters={filters}
 onFiltersChange={handleFiltersChange}
 className="border-0 p-0"
 />
 </div>
 </SheetContent>
 </Sheet>

 {/* Desktop Tabs */}
 <div className="hidden lg:flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
 <button
 onClick={() => handleFiltersChange({ typeId: undefined })}
 className={cn(
 "h-10 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
 !filters.typeId ? "bg-primary text-foreground dark:text-white shadow-lg" : "text-foreground/40 dark:text-zinc-300 hover:text-foreground dark:text-white"
 )}
 >
 Tất cả dịch vụ
 </button>
 {serviceTypes?.map((type: ServiceType) => (
 <button
 key={type.id}
 onClick={() => handleFiltersChange({ typeId: type.id })}
 className={cn(
 "h-10 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
 filters.typeId === type.id ? "bg-primary text-foreground dark:text-white shadow-lg" : "text-foreground/40 dark:text-zinc-300 hover:text-foreground dark:text-white"
 )}
 >
 {type.name}
 </button>
 ))}
 </div>

 <div className="ml-auto flex items-center gap-8">
 <div className="text-[10px] uppercase font-black tracking-widest text-foreground/20 dark:text-zinc-700 whitespace-nowrap">
 Displaying <span className="text-foreground dark:text-white">{totalItems}</span> Artisans
 </div>

 {activeFilterCount > 0 && (
 <button
 onClick={handleClearFilters}
 className="h-10 px-6 flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-foreground/40 dark:text-zinc-300 hover:text-primary transition-all"
 >
 <X className="w-3 h-3" />
 Clear Focus
 </button>
 )}
 </div>
 </div>
 </div>
 </section>

 {/* Main Grid Content */}
 <section className="py-20" id="services-grid">
 <div className="container mx-auto px-6">
 <div className="grid lg:grid-cols-4 gap-16">
 {/* Desktop Sidebar */}
 <aside className="hidden lg:block space-y-12">
 <BlurFade delay={0.2} direction="right" inView>
 <div className="space-y-12 sticky top-40">
 <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl">
 <h2 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
 <SlidersHorizontal className="w-5 h-5 text-primary" />
 Tiêu chí <span className="text-foreground/20 dark:text-zinc-700">Lọc</span>
 </h2>
 <ServiceFilters
 filters={filters}
 onFiltersChange={handleFiltersChange}
 className="border-0 p-0 bg-transparent"
 />
 </div>

 <div className="p-10 bg-gradient-to-br from-primary via-primary to-red-800 rounded-[2.5rem] text-foreground dark:text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
 <Music4 className="w-12 h-12 text-foreground/20 dark:text-zinc-700 mb-6" />
 <h3 className="text-2xl font-black uppercase tracking-tight italic mb-2 leading-none">Cần hỗ trợ cá nhân hóa?</h3>
 <p className="text-foreground/70 dark:text-white/70 text-sm font-medium italic mb-8">
 Kỹ thuật viên của chúng tôi luôn trực máy để tư vấn trực tiếp cho quý khách.
 </p>
 <a href={`tel:${hotlineNumber}`} className="block">
 <button className="h-14 px-8 w-full bg-white text-primary rounded-xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">
 Call {hotlineDisplay}
 </button>
 </a>
 </div>
 </div>
 </BlurFade>
 </aside>

 {/* Grid Area */}
 <div className="lg:col-span-3">
 <ServiceGrid
 services={services}
 isLoading={isLoading}
 totalPages={totalPages}
 currentPage={filters.page || 1}
 onPageChange={handlePageChange}
 totalItems={totalItems}
 />
 </div>
 </div>
 </div>
 </section>
 </main>
 );
}

export default function ServicesPage() {
 return (
 <Suspense fallback={
 <ServicesLoading />
 }>
 <ServicesPageContent />
 </Suspense>
 );
}
