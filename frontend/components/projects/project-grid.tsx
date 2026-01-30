'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Clock, Pin, Music4 } from 'lucide-react';
import { Project } from '@/lib/types';
import { BlurFade } from '@/components/ui/blur-fade';
import { cn } from '@/lib/utils';

interface ProjectGridProps {
 projects?: Project[];
 isLoading?: boolean;
}

export function ProjectGrid({ projects = [], isLoading = false }: ProjectGridProps) {
 if (isLoading) {
 return (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {Array.from({ length: 4 }).map((_, i) => (
 <div key={i} className="aspect-[4/3] bg-white/5 border border-white/10 rounded-[2.5rem] animate-pulse" />
 ))}
 </div>
 );
 }

 return (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
 {projects.map((project, index) => {
 const isFeatured = project.featured ?? project.isFeatured ?? false;

 let technologies: string[] = [];
 if (Array.isArray(project.technologies)) {
 technologies = project.technologies;
 } else if (typeof project.technologies === 'string') {
 try {
 const parsed = JSON.parse(project.technologies);
 technologies = Array.isArray(parsed) ? parsed : [];
 } catch {
 technologies = [];
 }
 }

 return (
 <BlurFade key={project.id} delay={0.05 * index} inView>
 <Card className="group relative bg-card/80 border border-border/60 rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(220,38,38,0.3)] hover:-translate-y-2 flex flex-col h-full">
 {/* High-Impact Visual Wrapper */}
 <div className="relative aspect-[4/3] overflow-hidden">
 {project.thumbnailImage || project.coverImage ? (
 <Image
 src={project.thumbnailImage || project.coverImage || '/projects/placeholder-project.svg'}
 alt={project.name}
 fill
 className="object-cover transition-transform duration-1000 group-hover:scale-110 brightness-75 group-hover:brightness-100"
 />
 ) : (
 <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
 <Music4 className="h-20 w-20 text-foreground/5 dark:text-foreground/5 dark:text-foreground dark:text-white/5 group-hover:text-primary/20 transition-colors" />
 </div>
 )}

 {/* Glass Overlays */}
 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/95 via-background/60 to-transparent dark:from-slate-950 dark:via-slate-950/60" />

 {/* Status & Featured Badge */}
 <div className="absolute top-6 left-6 flex flex-col gap-2">
 {isFeatured && (
 <Badge className="bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full border border-primary/20 shadow-xl shadow-primary/20 flex items-center gap-2">
 <Pin className="w-3 h-3 fill-current rotate-45" />
 Kiệt tác tiêu biểu
 </Badge>
 )}
 <Badge
 className={cn(
 "font-black uppercase text-[9px] tracking-widest px-4 py-1.5 rounded-full border backdrop-blur-md",
 project.status === 'COMPLETED'
 ? 'bg-green-500/10 text-green-400 border-green-500/20'
 : project.status === 'IN_PROGRESS'
 ? 'bg-primary/10 text-primary border-primary/20'
 : 'bg-background/70 text-foreground/70 dark:bg-white/5 dark:text-white/60 border-border/60 dark:border-white/10'
 )}
 >
 {project.status === 'COMPLETED'
 ? 'Đã bàn giao'
 : project.status === 'IN_PROGRESS'
 ? 'Đang thực hiện'
 : project.status === 'ON_HOLD'
 ? 'Tạm dừng'
 : 'Bản thiết kế'}
 </Badge>
 </div>

 {/* Category Indicator */}
 {project.category && (
 <div className="absolute top-6 right-6">
 <div className="px-4 py-1.5 rounded-full bg-background/70 border border-border/60 backdrop-blur-xl text-[9px] font-black uppercase tracking-widest text-foreground/70 dark:bg-white/10 dark:border-white/10 dark:text-white/60">
 {project.category}
 </div>
 </div>
 )}

 {/* Project Title Floating */}
 <div className="absolute inset-x-8 bottom-8 transition-transform duration-500 group-hover:-translate-y-2">
 <h3 className="text-2xl lg:text-3xl font-black text-foreground dark:text-white leading-tight font-display tracking-tight drop-shadow-2xl">
 {project.name}
 </h3>
 </div>
 </div>

 <CardContent className="p-8 flex flex-col flex-1 space-y-6">
 {/* Meta Stats */}
 <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 dark:text-zinc-300">
 <div className="flex items-center gap-2">
 <Calendar className="w-4 h-4 text-primary" />
 <span>
 {project.startDate && project.endDate
 ? `${new Date(project.startDate).getFullYear()} - ${new Date(project.endDate).getFullYear()}`
 : project.createdAt
 ? new Date(project.createdAt).getFullYear()
 : '2024'}
 </span>
 </div>
 {project.duration && (
 <div className="flex items-center gap-2">
 <Clock className="w-4 h-4 text-accent" />
 <span>{project.duration}</span>
 </div>
 )}
 </div>

 {project.shortDescription && (
 <p className="text-foreground/70 dark:text-white/60 text-sm font-medium italic leading-[1.6] line-clamp-3">
 &ldquo;{project.shortDescription}&rdquo;
 </p>
 )}

 {/* Technologies / Key Features */}
 {technologies.length > 0 && (
 <div className="flex flex-wrap gap-2 pt-2">
 {technologies.slice(0, 4).map((tech, i) => (
 <span key={i} className="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-md bg-background/70 border border-border/60 text-foreground/60 dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 group-hover:text-primary transition-colors">
 {tech}
 </span>
 ))}
 {technologies.length > 4 && (
 <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 text-zinc-400 dark:text-zinc-300">
 +{technologies.length - 4}
 </span>
 )}
 </div>
 )}

 {/* Action Link */}
 <div className="pt-6 mt-auto border-t border-border/40">
 <Link
 href={`/du-an/${project.slug || project.id}`}
 className="group/btn inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-foreground dark:text-white transition-all"
 >
 <span className="relative">
 Minh chứng Đẳng cấp
 <div className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover/btn:w-full transition-all duration-500" />
 </span>
 <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:border-primary transition-all">
 <ArrowRight className="w-5 h-5 text-primary group-hover/btn:text-foreground dark:text-white transition-colors" />
 </div>
 </Link>
 </div>
 </CardContent>
 </Card>
 </BlurFade>
 );
 })}
 </div>
 );
}
