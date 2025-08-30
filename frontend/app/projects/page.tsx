import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dự án - Audio Tài Lộc',
  description: 'Khám phá các dự án âm thanh chuyên nghiệp đã hoàn thành bởi Audio Tài Lộc.',
};

interface Project {
  id: string;
  slug: string;
  name: string;
  description?: string;
  images?: string[];
  tags?: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

async function fetchProjects(featured?: boolean) {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return [];

    const params = new URLSearchParams();
    if (featured) {
      params.set('featured', 'true');
    }

    const response = await fetch(`${base}/projects?${params.toString()}`, {
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const [allProjects, featuredProjects] = await Promise.all([
    fetchProjects(),
    fetchProjects(true)
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Dự án đã hoàn thành</h1>
        <p className="text-xl text-gray-600 mb-8">
          Khám phá các dự án âm thanh chuyên nghiệp mà chúng tôi đã thực hiện
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            🏠 Hệ thống âm thanh gia đình
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            🏢 Âm thanh văn phòng
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            🎭 Sân khấu biểu diễn
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            🎵 Phòng thu âm
          </Badge>
        </div>
      </div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="text-yellow-500 mr-2">⭐</span>
            Dự án nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project: Project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                {project.images && project.images.length > 0 && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.images[0]}
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                    <Badge className="absolute top-4 right-4 bg-yellow-500 text-white">
                      Nổi bật
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </CardTitle>
                  {project.description && (
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  <Link href={`/projects/${project.slug}`} className="w-full">
                    <Button className="w-full">
                      Xem chi tiết
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Projects */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Tất cả dự án</h2>
        {allProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProjects.map((project: Project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                {project.images && project.images.length > 0 && (
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={project.images[0]}
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                    {project.name}
                  </CardTitle>
                  {project.description && (
                    <CardDescription className="line-clamp-2 text-sm">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                  <Link href={`/projects/${project.slug}`} className="w-full">
                    <Button size="sm" className="w-full">
                      Chi tiết
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-2xl font-bold mb-2">Chưa có dự án nào</h3>
            <p className="text-gray-600 mb-6">
              Chúng tôi đang cập nhật portfolio. Vui lòng quay lại sau.
            </p>
            <Link href="/contact">
              <Button>Liên hệ tư vấn</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center mt-12">
        <h3 className="text-2xl font-bold mb-4">Có dự án âm thanh?</h3>
        <p className="text-lg mb-6">
          Hãy để chúng tôi giúp bạn xây dựng hệ thống âm thanh hoàn hảo
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button variant="secondary" size="lg">Tư vấn miễn phí</Button>
          </Link>
          <Link href="/services">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">Xem dịch vụ</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
