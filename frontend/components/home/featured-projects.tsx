'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function FeaturedProjects() {
  const projects = [
    {
      id: '1',
      title: 'Hệ thống âm thanh sân khấu',
      description: 'Lắp đặt hệ thống âm thanh chuyên nghiệp cho sân khấu hội trường 500 chỗ ngồi.',
      image: '/placeholder-project-1.jpg',
      category: 'Sân khấu',
      client: 'Trung tâm Văn hóa ABC',
      technologies: ['Amplifier', 'Speaker', 'Mixer'],
      status: 'Hoàn thành'
    },
    {
      id: '2',
      title: 'Studio thu âm chuyên nghiệp',
      description: 'Thiết kế và lắp đặt studio thu âm với thiết bị cao cấp cho công ty giải trí.',
      image: '/placeholder-project-2.jpg',
      category: 'Studio',
      client: 'Công ty Giải trí XYZ',
      technologies: ['Microphone', 'Audio Interface', 'Monitor'],
      status: 'Hoàn thành'
    },
    {
      id: '3',
      title: 'Hệ thống hội nghị trực tuyến',
      description: 'Triển khai hệ thống âm thanh hội nghị trực tuyến cho tòa nhà văn phòng.',
      image: '/placeholder-project-3.jpg',
      category: 'Văn phòng',
      client: 'Tập đoàn DEF',
      technologies: ['Conference System', 'Wireless Mic', 'Audio Processor'],
      status: 'Đang triển khai'
    }
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dự án tiêu biểu
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá những dự án âm thanh thành công mà chúng tôi đã thực hiện 
            cho các khách hàng uy tín.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-project.jpg';
                  }}
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">
                    {project.status}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
              
              <CardHeader>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit">
                    {project.category}
                  </Badge>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Khách hàng:</p>
                    <p className="text-sm">{project.client}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Công nghệ sử dụng:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Xem chi tiết
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/projects">
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


