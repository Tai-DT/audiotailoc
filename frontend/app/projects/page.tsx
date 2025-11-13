'use client';

import React from 'react';
import { PageBanner } from '@/components/ui/page-banner';
import { useProjects } from '@/lib/hooks/use-projects';
import { ProjectGrid } from '@/components/projects/project-grid';
import { ProjectFilters } from '@/components/projects/project-filters';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  const [showFilters, setShowFilters] = React.useState(false);

  const { data: projectsData, isLoading, error } = useProjects();

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Không thể tải dự án
            </h1>
            <p className="text-muted-foreground">
              Đã xảy ra lỗi khi tải danh sách dự án. Vui lòng thử lại sau.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Page Banner */}
        <PageBanner
          page="projects"
          title="Dự án âm thanh nổi bật"
          subtitle="Thực tế và chất lượng"
          description="Khám phá các dự án âm thanh mà Audio Tài Lộc đã thực hiện thành công. Từ hội trường, nhà hát đến hệ thống âm thanh sân khấu, chúng tôi tạo nên chất lượng âm thanh hoàn hảo."
          showStats={true}
        />

        {/* Projects Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex flex-col gap-4 lg:hidden">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <span>Bộ lọc dự án</span>
                {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
              </Button>
              {showFilters && (
                <div className="border rounded-lg p-4">
                  <ProjectFilters />
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters - Desktop */}
              <aside className="hidden lg:block lg:w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <ProjectFilters />
                </div>
              </aside>

              {/* Projects Grid */}
              <div className="flex-1">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {isLoading
                      ? 'Đang tải...'
                      : `Hiển thị ${projectsData?.items?.length || 0} trong tổng số ${projectsData?.total || 0} dự án`}
                  </p>
                </div>

                <ProjectGrid 
                  projects={projectsData?.items || []} 
                  isLoading={isLoading} 
                />

                {/* Pagination - Placeholder for future implementation */}
                {projectsData && projectsData.total > 12 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <Button variant="outline" disabled>
                      Trang trước
                    </Button>
                    <Button variant="default">1</Button>
                    <Button variant="outline" disabled>
                      Trang sau
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
