'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProject } from '@/lib/hooks/use-projects';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Github,
  Play,
  User,
  CheckCircle,
  Star,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { parseImages } from '@/lib/utils';

const parseStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => String(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item)).filter(Boolean);
      }
    } catch {
      // Ignore JSON parse error and fallback to comma split
    }

    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: project, isLoading, error } = useProject(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg" />
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-muted rounded" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Không tìm thấy dự án
            </h1>
            <p className="text-muted-foreground mb-8">
              Dự án bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.
            </p>
            <Link href="/projects">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách dự án
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const images = parseImages(project.images);
  const technologies = parseStringArray(project.technologies);
  const features = parseStringArray(project.features);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-success';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'ON_HOLD':
        return 'bg-yellow-500';
      case 'DRAFT':
        return 'bg-muted-foreground';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'IN_PROGRESS':
        return 'Đang thực hiện';
      case 'ON_HOLD':
        return 'Tạm dừng';
      case 'DRAFT':
        return 'Bản nháp';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-primary">Dự án</Link>
          <span>/</span>
          <span className="text-foreground">{project.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Project Images */}
          <div className="space-y-4">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
              {images.length > 0 ? (
                <Image
                  src={images[0]}
                  alt={project.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : project.coverImage ? (
                <Image
                  src={project.coverImage}
                  alt={project.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Không có hình ảnh
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    title={`Xem ảnh ${index + 1}`}
                    onClick={() => {
                      // In a real implementation, you would update the main image
                      toast.success('Tính năng xem ảnh chi tiết sẽ được cập nhật');
                    }}
                    className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 border-muted hover:border-primary"
                  >
                    <Image
                      src={image}
                      alt={`${project.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* YouTube Video */}
            {project.youtubeVideoId && (
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${project.youtubeVideoId}`}
                  title={project.name}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Project Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {project.category || 'Dự án'}
                </Badge>
                {project.isFeatured && (
                  <Badge variant="default" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Nổi bật
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(project.status)}`} />
                  <span className="text-xs text-muted-foreground">
                    {getStatusText(project.status)}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-4">{project.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {project.viewCount} lượt xem
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>

              {project.client && (
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Khách hàng:</strong> {project.client}
                  </span>
                </div>
              )}

              {project.shortDescription && (
                <p className="text-muted-foreground mb-6">
                  {project.shortDescription}
                </p>
              )}
            </div>

            {/* Technologies */}
            {technologies.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Công nghệ sử dụng</h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <Badge key={`${tech}-${index}`} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {project.liveUrl && (
                <Button
                  className="w-full"
                  onClick={() => window.open(project.liveUrl, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Xem dự án trực tiếp
                </Button>
              )}

              {project.demoUrl && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(project.demoUrl, '_blank')}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Xem demo
                </Button>
              )}

              {project.githubUrl && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(project.githubUrl, '_blank')}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Xem source code
                </Button>
              )}
            </div>

            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin dự án</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.startDate && project.endDate && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Thời gian:</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </span>
                  </div>
                )}

                {project.duration && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Thời lượng:</span>
                    <span className="text-sm text-muted-foreground">
                      {project.duration}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-sm font-medium">Trạng thái:</span>
                  <span className="text-sm text-muted-foreground">
                    {getStatusText(project.status)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium">Lượt xem:</span>
                  <span className="text-sm text-muted-foreground">
                    {project.viewCount}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Project Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Mô tả chi tiết</TabsTrigger>
            <TabsTrigger value="features">Tính năng</TabsTrigger>
            <TabsTrigger value="gallery">Thư viện ảnh</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none">
                  {project.description ? (
                    <div dangerouslySetInnerHTML={{ __html: project.description }} />
                  ) : (
                    <p className="text-muted-foreground">
                      Thông tin chi tiết về dự án sẽ được cập nhật sớm.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {features.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Danh sách tính năng sẽ được cập nhật sớm.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <div key={index} className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={image}
                    alt={`${project.name} - Ảnh ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
              {images.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    Chưa có hình ảnh nào cho dự án này.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Projects or Call to Action */}
        <div className="mt-16 text-center">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Quan tâm đến dự án tương tự?</h3>
              <p className="text-muted-foreground mb-6">
                Chúng tôi có nhiều dự án âm thanh chất lượng khác. Hãy khám phá thêm!
              </p>
              <Link href="/projects">
                <Button size="lg">
                  Xem tất cả dự án
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}