'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/Footer';
import { FeaturedProjects } from '@/components/home/featured-projects';
import { ProjectGrid } from '@/components/projects/project-grid';
import { ProjectFilters } from '@/components/projects/project-filters';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Dự án đã thực hiện
              </h1>
              <p className="text-xl text-muted-foreground">
                Khám phá các dự án âm thanh chuyên nghiệp mà chúng tôi đã hoàn thành,
                từ hệ thống hội trường, sân khấu đến phòng thu âm hiện đại.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <ProjectFilters />
              </div>

              {/* Projects Grid */}
              <div className="lg:col-span-3">
                <ProjectGrid />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <FeaturedProjects />
      </main>
      <Footer />
    </div>
  );
}