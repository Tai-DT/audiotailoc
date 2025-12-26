'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ArrowRight, Clock, ExternalLink } from 'lucide-react';
import { Project } from '@/lib/types';
import { MagicCard } from '@/components/ui/magic-card';
import { BlurFade } from '@/components/ui/blur-fade';

interface ProjectGridProps {
  projects?: Project[];
  isLoading?: boolean;
}

export function ProjectGrid({ projects = [], isLoading = false }: ProjectGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Chưa có dự án nào</h3>
        <p className="text-muted-foreground">
          Chúng tôi đang cập nhật các dự án mới. Vui lòng quay lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => {
        const isFeatured = project.featured ?? project.isFeatured ?? false;
        let technologies: string[] | undefined;

        if (Array.isArray(project.technologies)) {
          technologies = project.technologies;
        } else if (typeof project.technologies === 'string') {
          try {
            const parsed = JSON.parse(project.technologies);
            technologies = Array.isArray(parsed) ? parsed : undefined;
          } catch {
            technologies = undefined;
          }
        }

        return (
          <BlurFade key={project.id} delay={0.05 * index} inView>
            <MagicCard gradientColor="oklch(0.97 0.008 45)" className="p-0 border-none shadow-none h-full">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                {/* Project Image */}
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {project.thumbnailImage || project.coverImage ? (
                    <Image
                      src={project.thumbnailImage || project.coverImage || ''}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="text-4xl font-bold text-primary/20">
                        {project.name.charAt(0)}
                      </div>
                    </div>
                  )}
                  {isFeatured && (
                    <Badge className="absolute top-2 left-2 bg-primary">
                      Nổi bật
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 text-lg">
                    {project.name}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      {project.startDate && project.endDate
                        ? `${new Date(project.startDate).getFullYear()} - ${new Date(project.endDate).getFullYear()}`
                        : project.createdAt
                        ? new Date(project.createdAt).getFullYear()
                        : 'N/A'}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex-grow">
                  {project.shortDescription && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {project.shortDescription}
                    </p>
                  )}

                  {/* Project Status */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant={
                        project.status === 'COMPLETED'
                          ? 'default'
                          : project.status === 'IN_PROGRESS'
                          ? 'secondary'
                          : project.status === 'ON_HOLD'
                          ? 'outline'
                          : 'destructive'
                      }
                    >
                      {project.status === 'COMPLETED'
                        ? 'Hoàn thành'
                        : project.status === 'IN_PROGRESS'
                        ? 'Đang thực hiện'
                        : project.status === 'ON_HOLD'
                        ? 'Tạm dừng'
                        : 'Nháp'}
                    </Badge>
                    {project.duration && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{project.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Technologies */}
                  {technologies && technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {technologies.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-0 mt-auto">
                  <div className="flex gap-2 w-full">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/projects/${project.slug || project.id}`}>
                        Xem chi tiết
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                    {(project.liveUrl || project.demoUrl) && (
                      <Button asChild size="icon" variant="ghost">
                        <a
                          href={(project.liveUrl || project.demoUrl) ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Xem demo trực tiếp"
                          title="Xem demo trực tiếp"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </MagicCard>
          </BlurFade>
        );
      })}
    </div>
  );
}