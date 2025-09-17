'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, ArrowRight, Users, Clock } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  completionDate: string;
  duration: string;
  teamSize: number;
  images: string[];
  technologies: string[];
  status: 'completed' | 'ongoing' | 'upcoming';
  featured: boolean;
}

interface ProjectGridProps {
  projects?: Project[];
  isLoading?: boolean;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Hệ thống âm thanh hội trường Đại học Quốc gia',
    description: 'Lắp đặt hệ thống âm thanh chuyên nghiệp cho hội trường chính với sức chứa 2000 chỗ ngồi.',
    category: 'Hội trường',
    location: 'Hà Nội',
    completionDate: '2024-01-15',
    duration: '3 tháng',
    teamSize: 8,
    images: ['/images/projects/hall-1.jpg'],
    technologies: ['Line Array', 'Digital Mixer', 'DSP Processor'],
    status: 'completed',
    featured: true
  },
  {
    id: '2',
    title: 'Phòng thu âm hiện đại',
    description: 'Thiết kế và lắp đặt phòng thu âm chuyên nghiệp đạt chuẩn quốc tế cho studio âm nhạc.',
    category: 'Studio',
    location: 'TP.HCM',
    completionDate: '2024-02-20',
    duration: '2 tháng',
    teamSize: 5,
    images: ['/images/projects/studio-1.jpg'],
    technologies: ['Acoustic Panels', 'Microphones', 'Audio Interface'],
    status: 'completed',
    featured: true
  },
  {
    id: '3',
    title: 'Hệ thống sân khấu ngoài trời',
    description: 'Lắp đặt hệ thống âm thanh sân khấu cho sự kiện ngoài trời với công suất lớn.',
    category: 'Sân khấu',
    location: 'Đà Nẵng',
    completionDate: '2024-03-10',
    duration: '1.5 tháng',
    teamSize: 6,
    images: ['/images/projects/stage-1.jpg'],
    technologies: ['Line Array', 'Subwoofers', 'Power Amplifiers'],
    status: 'completed',
    featured: false
  }
];

export function ProjectGrid({ projects = mockProjects, isLoading = false }: ProjectGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏗️</div>
        <h3 className="text-xl font-semibold mb-2">Không tìm thấy dự án</h3>
        <p className="text-muted-foreground">
          Hiện tại chưa có dự án nào phù hợp với tiêu chí tìm kiếm của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Dự án ({projects.length})
        </h2>
        <div className="text-sm text-muted-foreground">
          Đã hoàn thành
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'ongoing':
        return 'Đang thực hiện';
      case 'upcoming':
        return 'Sắp tới';
      default:
        return status;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
      {/* Project Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10">
        {project.images && project.images[0] ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl">🏗️</div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={getStatusColor(project.status)}>
            {getStatusText(project.status)}
          </Badge>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              ⭐ Nổi bật
            </Badge>
          </div>
        )}
      </div>

      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
            {project.title}
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(project.completionDate).getFullYear()}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{project.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{project.teamSize} người</span>
            </div>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/projects/${project.id}`} className="w-full">
          <Button className="w-full group-hover:bg-primary/90">
            Xem chi tiết
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}