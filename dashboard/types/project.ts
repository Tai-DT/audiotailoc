export interface Project {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  client?: string;
  clientLogo?: string;
  category?: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  thumbnailImage?: string;
  coverImage?: string;
  images?: string[];
  youtubeVideoId?: string;
  youtubeVideoUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  teamSize?: number;
  budget?: string;
  technologies?: string[];
  features?: string[];
  tags?: string[];
  testimonial?: string;
  results?: string;
  challenges?: string;
  solutions?: string;
  displayOrder: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  client?: string;
  clientLogo?: string;
  category?: string;
  status?: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  thumbnailImage?: string;
  coverImage?: string;
  images?: string[];
  youtubeVideoUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  teamSize?: number;
  budget?: string;
  technologies?: string[];
  features?: string[];
  tags?: string[];
  testimonial?: string;
  results?: string;
  challenges?: string;
  solutions?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
}

export interface UpdateProjectRequest extends CreateProjectRequest {
  id: string;
}

export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  meta?: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface ProjectResponse {
  success: boolean;
  data: Project;
}
