'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useFeaturedProjects } from '@/lib/hooks/use-projects';

export function FeaturedProjects() {
  const { data: projects, isLoading, error } = useFeaturedProjects(6);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardHeader>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex space-x-2 pt-2">
                      <Skeleton className="h-8 flex-1" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Skeleton className="h-12 w-48 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dự án tiêu biểu
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Không thể tải dữ liệu dự án tiêu biểu. Vui lòng thử lại sau.
            </p>
            <Link href="/du-an">
              <Button variant="outline" size="lg">
                Xem tất cả dự án
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // No projects state
  if (!projects || projects.length === 0) {
    return (
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dự án tiêu biểu
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Chưa có dự án tiêu biểu nào được chọn. Hãy khám phá các dự án khác của chúng tôi!
            </p>
            <Link href="/du-an">
              <Button variant="outline" size="lg">
                Xem tất cả dự án
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dự án tiêu biểu
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá những dự án âm thanh xuất sắc nhất mà chúng tôi đã thực hiện
            cho các khách hàng uy tín, thể hiện sự chuyên nghiệp và chất lượng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={project.thumbnailImage || project.coverImage || project.images?.[0] || '/placeholder-project.jpg'}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-project.jpg';
                  }}
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">
                    {project.status === 'COMPLETED' ? 'Hoàn thành' :
                     project.status === 'IN_PROGRESS' ? 'Đang triển khai' :
                     project.status === 'ON_HOLD' ? 'Tạm dừng' : 'Draft'}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>

              <CardHeader>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit">
                    {project.category || 'Dự án'}
                  </Badge>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>{project.shortDescription || project.description}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {project.client && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Khách hàng:</p>
                      <p className="text-sm">{project.client}</p>
                    </div>
                  )}

                  {(() => {
                    let technologies: string[] = [];
                    try {
                      technologies = typeof project.technologies === 'string' 
                        ? JSON.parse(project.technologies) 
                        : project.technologies || [];
                    } catch {
                      technologies = [];
                    }
                    return technologies && technologies.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Công nghệ sử dụng:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {technologies.map((tech, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex space-x-2 pt-2">
                    <Link href={`/projects/${project.slug}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Xem chi tiết
                      </Button>
                    </Link>
                    {project.liveUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/du-an">
            <Button variant="outline" size="lg">
              Xem tất cả dự án
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}


