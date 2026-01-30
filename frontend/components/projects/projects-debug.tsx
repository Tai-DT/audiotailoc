import { useProjects, useFeaturedProjects } from '@/lib/hooks/use-projects';

export function ProjectsDebug() {
 const { data: allProjects, isLoading: allLoading, error: allError } = useProjects();
 const { data: featuredProjects, isLoading: featuredLoading, error: featuredError } = useFeaturedProjects();

 // Debug info only shown in development
 if (process.env.NODE_ENV === 'production') {
 return null;
 }

 return (
 <div style={{ padding: '20px', background: '#f0f0f0', margin: '10px 0' }}>
 <h3>Projects Debug Info</h3>
 <div>
 <strong>All Projects:</strong>
 <pre>{JSON.stringify({ isLoading: allLoading, error: allError, count: allProjects?.items?.length || 0 }, null, 2)}</pre>
 </div>
 <div>
 <strong>Featured Projects:</strong>
 <pre>{JSON.stringify({ isLoading: featuredLoading, error: featuredError, count: featuredProjects?.length || 0 }, null, 2)}</pre>
 </div>
 </div>
 );
}
