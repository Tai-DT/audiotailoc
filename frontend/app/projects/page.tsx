'use client';

import React from 'react';
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
        <main className="container mx-auto px-4 py-8" role="main">
          <div className="text-center" role="alert">
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
      <main role="main" aria-labelledby="page-title">
        {/* Compact Page Header */}
        <div className="bg-gradient-to-b from-primary/5 to-background border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-3xl">
              <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Dự án</div>
              <h1 id="page-title" className="text-2xl sm:text-3xl font-bold mb-2">
                Dự án âm thanh nổi bật
              </h1>
              <p className="text-sm text-muted-foreground line-clamp-2">
                Khám phá các dự án âm thanh mà Audio Tài Lộc đã thực hiện thành công. Từ hội trường, nhà hát đến hệ thống âm thanh sân khấu, chúng tôi tạo nên chất lượng âm thanh hoàn hảo.
              </p>
            </div>
          </div>
        </div>

        {/* Projects Content */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="mb-4 flex flex-col gap-3 lg:hidden">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between h-9 text-sm"
                onClick={() => setShowFilters((prev) => !prev)}
                aria-expanded={showFilters}
                aria-controls="mobile-filters"
              >
                <span>Bộ lọc dự án</span>
                {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
              </Button>
              {showFilters && (
                <div id="mobile-filters" className="rounded-lg border bg-card p-3">
                  <ProjectFilters />
                </div>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
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
