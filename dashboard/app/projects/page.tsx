import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

// Since we are server component, we can fetch directly or use a lib. 
// But we should use the API URL from env usually. 
// For simplicity in this demo, I'll use fetch against localhost if on server.
type ProjectsApiResponse = {
    success?: boolean;
    data?: any;
};

async function getProjects() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1'}/projects?limit=100`, {
            next: { revalidate: 60 } // Revalidate every minute
        });

        if (!res.ok) {
            return { projects: [], total: 0 };
        }

        const payload = (await res.json()) as ProjectsApiResponse;
        const inner = payload?.data ?? payload;

        // Backend format (common): { success, data: { data: Project[], meta: ... } }
        const projects = (inner?.data ?? inner?.items ?? []) as any[];
        const total =
            (inner?.meta?.total as number | undefined) ??
            (inner?.total as number | undefined) ??
            projects.length;

        return { projects: Array.isArray(projects) ? projects : [], total: Number(total) || 0 };
    } catch {
        return { projects: [], total: 0 };
    }
}

export const metadata: Metadata = {
    title: 'Consolidated Projects | Audio Tai Loc',
    description: 'Explore our latest audio installation projects, including home cinema, karaoke systems, and car audio upgrades.',
    openGraph: {
        title: 'Our Projects - Audio Tai Loc',
        description: 'Browse our portfolio of high-end audio installations.',
        images: ['https://placehold.co/1200x630/2563eb/FFF?text=Projects+Gallery'],
    },
};

export default async function ProjectsPage() {
    const data = await getProjects();
    const projects = data.projects || [];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Audio Tai Loc Projects',
        description: 'A collection of our audio installation projects.',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: projects.map((project: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://audiotailoc.com/projects/${project.slug}`, // Assumption
                name: project.name,
                image: project.thumbnailImage,
                description: project.shortDescription
            }))
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            {/* SEO Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Our Projects</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover how we bring sound to life. From luxury home cinemas to professional commercial setups.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: any) => (
                    <Card key={project.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
                        <div className="relative h-48 w-full">
                            {project.thumbnailImage ? (
                                <img src={project.thumbnailImage} alt={project.name} className="object-cover" />
                            ) : (
                                <div className="h-full w-full bg-slate-200 flex items-center justify-center text-slate-400">
                                    No Image
                                </div>
                            )}
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={project.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                    {project.category || 'Project'}
                                </Badge>
                            </div>
                            <CardTitle className="line-clamp-2">{project.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground text-sm line-clamp-3">
                                {project.shortDescription || project.description}
                            </p>
                        </CardContent>
                        <CardFooter className="text-sm text-muted-foreground border-t pt-4 flex flex-col items-start gap-2">
                            <div className="flex items-center gap-2 w-full">
                                <User className="h-4 w-4" />
                                <span className="truncate">{project.client || 'Client'}</span>
                            </div>
                            {project.completionDate && (
                                <div className="flex items-center gap-2 w-full">
                                    <Calendar className="h-4 w-4" />
                                    <span>Completed: {format(new Date(project.completionDate), 'MMM yyyy')}</span>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No projects found. Check back soon!
                </div>
            )}
        </div>
    );
}
