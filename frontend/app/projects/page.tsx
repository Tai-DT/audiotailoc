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
                <div className="rounded-lg border bg-card p-4">
                  <ProjectFilters />
                </div>
              )}
            </div>

            <div className="grid gap-8 lg:grid-cols-4">
              {/* Filters Sidebar */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-32 space-y-6">
                  <ProjectFilters />
                </div>
              </div>

              {/* Projects Grid */}
              <div className="lg:col-span-3">
                <ProjectGrid
                  projects={projectsData?.items ?? []}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
