'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, X, Check, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ProjectFiltersProps {
 categories: string[];
 statuses: Array<{ value: string; label: string }>;
 selectedCategory: string;
 selectedStatus: string;
 searchQuery: string;
 onCategoryChange: (value: string) => void;
 onStatusChange: (value: string) => void;
 onSearchChange: (value: string) => void;
 onClear: () => void;
}

export function ProjectFilters({
 categories,
 statuses,
 selectedCategory,
 selectedStatus,
 searchQuery,
 onCategoryChange,
 onStatusChange,
 onSearchChange,
 onClear,
}: ProjectFiltersProps) {
 const categoryOptions = ['Tất cả', ...categories];
 const statusOptions = [{ value: '', label: 'Tất cả' }, ...statuses];
 const hasActiveFilters = Boolean(selectedCategory || selectedStatus || searchQuery.trim());

 return (
 <div className="space-y-10">
 {/* Search Filter Redesign */}
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 dark:text-foreground/30 dark:text-foreground dark:text-white/30 flex items-center gap-2">
 <Search className="w-3 h-3 text-primary" />
 Truy vấn định danh
 </label>
 <div className="relative group/input">
 <Input
 value={searchQuery}
 onChange={(e) => onSearchChange(e.target.value)}
 placeholder="Tên dự án, khách hàng..."
 className="h-12 bg-white/5 border-white/10 rounded-xl text-foreground dark:text-foreground dark:text-white placeholder:text-foreground/10 dark:text-foreground/10 dark:text-foreground dark:text-white/10 focus:border-primary/50 transition-all text-xs font-medium ring-0"
 />
 {searchQuery && (
 <button
 onClick={() => onSearchChange('')}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/20 dark:text-foreground/20 dark:text-foreground dark:text-white/20 hover:text-foreground dark:text-foreground dark:text-white transition-colors"
 >
 <X className="w-4 h-4" />
 </button>
 )}
 </div>
 </div>

 {/* Category Filter Redesign */}
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 dark:text-foreground/30 dark:text-foreground dark:text-white/30 flex items-center gap-2">
 <Filter className="w-3 h-3 text-accent" />
 Phân loại Kiến trúc
 </label>
 <div className="space-y-2">
 {categoryOptions.map((category) => (
 <button
 key={category}
 onClick={() => onCategoryChange(category === 'Tất cả' ? '' : category)}
 className={cn(
 "w-full flex items-center justify-between h-11 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left",
 selectedCategory === category || (!selectedCategory && category === 'Tất cả')
 ? "bg-primary text-foreground dark:text-foreground dark:text-white shadow-lg shadow-primary/20"
 : "bg-white/5 text-foreground/40 dark:text-foreground/40 dark:text-foreground dark:text-zinc-300 hover:bg-white/10 hover:text-foreground dark:text-foreground dark:text-white border border-white/5"
 )}
 >
 <span className="truncate pr-2">{category}</span>
 {(selectedCategory === category || (!selectedCategory && category === 'Tất cả')) && (
 <Check className="w-3 h-3 flex-shrink-0" />
 )}
 </button>
 ))}
 </div>
 </div>

 {/* Status Filter Redesign */}
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 dark:text-foreground/30 dark:text-foreground dark:text-white/30 flex items-center gap-2">
 <div className="w-3 h-3 rounded-full border-2 border-primary/40 animate-pulse" />
 Tiến độ Triển khai
 </label>
 <div className="flex flex-wrap gap-2">
 {statusOptions.map((status) => (
 <button
 key={status.value || status.label}
 onClick={() => onStatusChange(status.value)}
 className={cn(
 "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
 selectedStatus === status.value || (!selectedStatus && status.value === '')
 ? "bg-accent text-foreground dark:text-foreground dark:text-white shadow-lg shadow-accent/20"
 : "bg-white/5 text-foreground/40 dark:text-foreground/40 dark:text-foreground dark:text-zinc-300 hover:bg-white/10 hover:border-white/20 border border-white/5"
 )}
 >
 {status.label}
 </button>
 ))}
 </div>
 </div>

 {/* Footer / Clear Actions */}
 {hasActiveFilters && (
 <div className="pt-6 border-t border-white/5">
 <Button
 variant="ghost"
 onClick={onClear}
 className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:bg-primary/10 hover:text-primary transition-all border border-primary/20"
 >
 <X className="h-4 w-4 mr-2" />
 Làm mới bộ lọc
 </Button>
 </div>
 )}
 </div>
 );
}
