'use client';

import React from 'react';
import { useProjects } from '@/lib/hooks/use-projects';
import { ProjectGrid } from '@/components/projects/project-grid';
import { ProjectFilters } from '@/components/projects/project-filters';
import { X, Music4, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlurFade } from '@/components/ui/blur-fade';

export default function ProjectsPage() {
 const [mounted, setMounted] = React.useState(false);
 const [showFilters, setShowFilters] = React.useState(false);
 const [filters, setFilters] = React.useState({
 category: '',
 status: '',
 search: '',
 });

 React.useEffect(() => {
 setMounted(true);
 }, []);

 const { data: projectsData, isLoading, error } = useProjects({
 category: filters.category || undefined,
 status: filters.status || undefined,
 search: filters.search.trim() || undefined,
 });

 const categoryOptions = React.useMemo(() => {
 const categories = (projectsData?.items || [])
 .map((project) => project.category)
 .filter((category): category is string => Boolean(category));
 return Array.from(new Set(categories));
 }, [projectsData?.items]);

 const statusOptions = React.useMemo(() => {
 const statusLabels: Record<string, string> = {
 COMPLETED: 'Hoàn thành',
 IN_PROGRESS: 'Đang thực hiện',
 ON_HOLD: 'Tạm dừng',
 DRAFT: 'Nháp',
 };
 const statuses = (projectsData?.items || [])
 .map((project) => project.status)
 .filter(Boolean);
 return Array.from(new Set(statuses)).map((status) => ({
 value: status,
 label: statusLabels[status] || status,
 }));
 }, [projectsData?.items]);

 const handleFilterChange = (next: Partial<typeof filters>) => {
 setFilters((prev) => ({ ...prev, ...next }));
 };

 const handleClearFilters = () => {
 setFilters({ category: '', status: '', search: '' });
 };

 if (!mounted) {
 return (
 <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
 <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-primary/20" />
 <div className="h-6 w-56 rounded-full bg-muted/40 mb-4" />
 <div className="h-4 w-72 rounded-full bg-muted/30" />
 </div>
 );
 }

 if (error) {
 return (
 <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
 <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
 <X className="w-10 h-10 text-primary" />
 </div>
 <h1 className="text-3xl font-black tracking-tight mb-4 text-foreground dark:text-white">
 Kiến trúc gián đoạn
 </h1>
 <p className="text-foreground/40 dark:text-zinc-300 max-w-md italic mb-8">
 Chúng tôi đang bảo trì hệ thống portfolio. Vui lòng quay lại sau để chiêm ngưỡng các kiệt tác.
 </p>
 <Button onClick={() => window.location.reload()} className="bg-primary text-foreground dark:text-white font-semibold tracking-wide px-8 h-12 rounded-xl">
 Thử lại ngay
 </Button>
 </div>
 );
 }

 return (
 <main className="min-h-screen bg-background dark:bg-slate-950 text-foreground dark:text-white selection:bg-primary/30 pb-12 md:pb-20">
 {/* Cinematic Hero Banner */}
 <section className="relative py-16 md:py-24 overflow-hidden border-b border-white/5">
 <div className="absolute inset-0 z-0">
 <div className="absolute top-0 right-1/4 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-[110px]" />
 <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[90px]" />
 <div className="absolute inset-0 bg-studio-grid opacity-20" />
 </div>

 <div className="container mx-auto px-4 md:px-6 relative z-10">
 <BlurFade delay={0.1} inView>
 <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
 <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
 <Music4 className="w-4 h-4 text-primary" />
 <span className="text-[10px] font-semibold tracking-[0.14em] text-foreground/60 dark:text-zinc-200">Portfolio of Excellence</span>
 </div>

 <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1] max-w-5xl">
 Kiến Tạo <span className="text-primary italic">Không Gian</span><br />
 Trình Diễn <span className="bg-gradient-to-br from-primary via-red-500 to-red-800 bg-clip-text text-transparent italic inline-block">Độc Bản</span>
 </h1>

 <p className="text-foreground/40 dark:text-zinc-300 text-sm sm:text-base md:text-lg max-w-3xl font-medium leading-relaxed italic">
 Chiêm ngưỡng những tuyệt tác âm thanh được Audio Tài Lộc thiết kế và thi công. Từ các khán phòng tráng lệ đến những hệ thống giải trí gia đình High-End.
 </p>

 <div className="flex flex-wrap justify-center gap-4 pt-2">
 <div className="flex items-center gap-3 group">
 <div className="w-1.5 h-1.5 rounded-full bg-primary" />
 <span className="text-[10px] font-semibold tracking-wide text-foreground/60 dark:text-zinc-200">Professional Installation</span>
 </div>
 <div className="flex items-center gap-3 group">
 <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
 <span className="text-[10px] font-semibold tracking-wide text-foreground/60 dark:text-zinc-200">Acoustic Engineering</span>
 </div>
 </div>
 </div>
 </BlurFade>
 </div>
 </section>

 {/* Projects Content */}
 <section className="py-8 md:py-12">
 <div className="container mx-auto px-4 md:px-6">
 {/* Mobile Filter Trigger */}
 <div className="mb-6 lg:hidden">
 <Button
 variant="outline"
 className="w-full justify-between h-11 bg-white/5 border-white/10 rounded-2xl text-[10px] font-semibold tracking-wide"
 onClick={() => setShowFilters((prev) => !prev)}
 >
 <div className="flex items-center gap-3">
 <SlidersHorizontal className="h-4 w-4 text-primary" />
 <span>Tinh chỉnh Bộ lọc</span>
 </div>
 {showFilters ? <X className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
 </Button>

 {showFilters && (
 <BlurFade delay={0.1}>
 <div className="mt-3 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
 <ProjectFilters
 categories={categoryOptions}
 statuses={statusOptions}
 selectedCategory={filters.category}
 selectedStatus={filters.status}
 searchQuery={filters.search}
 onCategoryChange={(category) => handleFilterChange({ category })}
 onStatusChange={(status) => handleFilterChange({ status })}
 onSearchChange={(search) => handleFilterChange({ search })}
 onClear={handleClearFilters}
 />
 </div>
 </BlurFade>
 )}
 </div>

 <div className="grid gap-6 md:gap-10 lg:grid-cols-4">
 {/* Filters Sidebar - Desktop */}
 <div className="hidden lg:block lg:col-span-1">
 <BlurFade delay={0.2} inView>
 <div className="sticky top-32 space-y-6">
 <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
 <div className="relative z-10 space-y-8">
 <div>
 <p className="text-primary font-semibold tracking-[0.14em] text-[10px] mb-2">Refine Search</p>
 <h3 className="text-xl font-black tracking-tight">Bộ lọc chuyên sâu</h3>
 </div>
 <ProjectFilters
 categories={categoryOptions}
 statuses={statusOptions}
 selectedCategory={filters.category}
 selectedStatus={filters.status}
 searchQuery={filters.search}
 onCategoryChange={(category) => handleFilterChange({ category })}
 onStatusChange={(status) => handleFilterChange({ status })}
 onSearchChange={(search) => handleFilterChange({ search })}
 onClear={handleClearFilters}
 />
 </div>
 </div>
 </div>
 </BlurFade>
 </div>

 {/* Projects Grid Container */}
 <div className="lg:col-span-3">
 <BlurFade delay={0.3} inView>
 <ProjectGrid
 projects={projectsData?.items ?? []}
 isLoading={isLoading}
 />
 </BlurFade>

 {/* Empty State Redesign */}
 {!isLoading && (projectsData?.items ?? []).length === 0 && (
 <div className="flex flex-col items-center justify-center py-40 text-center space-y-8 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl">
 <div className="relative">
 <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
 <Music4 className="w-24 h-24 text-foreground/5 dark:text-white/5 relative z-10" />
 </div>
 <div className="space-y-3 px-6">
 <h3 className="text-3xl font-black tracking-tight">Không gian trống</h3>
 <p className="text-foreground/40 dark:text-zinc-300 max-w-md mx-auto font-medium italic">
 Chúng tôi chưa tìm thấy dự án nào khớp với tiêu chí lựa chọn của bạn. Vui lòng điều chỉnh lại bộ lọc.
 </p>
 </div>
 <Button onClick={handleClearFilters} className="h-14 px-10 bg-white text-slate-950 rounded-2xl font-semibold tracking-wide hover:bg-white/90 transition-all">
 Xem tất cả kiệt tác
 </Button>
 </div>
 )}
 </div>
 </div>
 </div>
 </section>
 </main>
 );
}

const ChevronRight = ({ className }: { className: string }) => (
 <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="m9 18 6-6-6-6" />
 </svg>
);
