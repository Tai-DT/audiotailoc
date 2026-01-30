
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, ArrowLeft, Github, Layers, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';

async function getProject(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1'}/projects/by-slug/${slug}`, {
        next: { revalidate: 60 } // Revalidate every minute
    });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch project');
    }
    return res.json();
}

function parseStringArrayField(value: unknown): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (typeof value !== 'string') return [];

    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[')) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
        } catch {
            // fall through
        }
    }

    if (trimmed.includes(',')) {
        return trimmed
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [trimmed];
}

type Props = {
    params: Promise<{ slug: string }>
};

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { slug } = await params;
    const data = await getProject(slug);
    if (!data) return { title: 'Project Not Found' };

    const project = data.data || data; // Handle likely wrapper

    return {
        title: project.metaTitle || `${project.name} | Audio Tai Loc Projects`,
        description: project.metaDescription || project.shortDescription || project.description?.slice(0, 160),
        openGraph: {
            title: project.ogTitle || project.name,
            description: project.ogDescription || project.shortDescription,
            images: project.ogImage ? [project.ogImage] : (project.thumbnailImage ? [project.thumbnailImage] : []),
        },
    };
}

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params;
    const data = await getProject(slug);

    if (!data) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold">Project Not Found</h1>
                <p className="text-muted-foreground mt-2">The project you are looking for does not exist.</p>
                <Button asChild className="mt-6">
                    <Link href="/projects">Back to Projects</Link>
                </Button>
            </div>
        );
    }

    const project = data.data || data;

    const technologies = parseStringArrayField(project.technologies);
    const galleryImages = parseStringArrayField(project.images);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: project.name,
        image: project.thumbnailImage ? [project.thumbnailImage, ...(galleryImages || [])] : undefined,
        datePublished: project.createdAt,
        dateModified: project.updatedAt,
        author: {
            '@type': 'Organization',
            name: 'Audio Tai Loc'
        },
        description: project.description
    };

    return (
        <article className="container mx-auto py-12 px-4 max-w-5xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Header */}
            <div className="mb-8">
                <Link href="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                </Link>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <Badge className="mb-3">{project.category || 'Portfolio'}</Badge>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">{project.name}</h1>
                        <p className="text-xl text-muted-foreground">{project.shortDescription}</p>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4 md:mt-0">

                        {project.githubUrl && (
                            <Button asChild variant="outline">
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                    <Github className="mr-2 h-4 w-4" /> Source Code
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Cover Video/Image */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 mb-12 shadow-md">
                {project.youtubeVideoUrl ? (
                    <iframe
                        src={project.youtubeVideoUrl.replace('watch?v=', 'embed/')}
                        title={`${project.name} video`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    project.coverImage ? (
                        <img src={project.coverImage} alt={project.name + ' Cover'} className="object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">No Cover Image</div>
                    )
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Content */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Overview */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
                        <div className="prose max-w-none text-muted-foreground whitespace-pre-line">
                            {project.description}
                        </div>
                    </section>

                    {/* Case Study Sections */}
                    {(project.challenges || project.solutions || project.results) && (
                        <section className="space-y-6">
                            <h2 className="text-2xl font-semibold">Case Study</h2>

                            {project.challenges && (
                                <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg border border-orange-100 dark:border-orange-900/50">
                                    <h3 className="flex items-center text-lg font-medium text-orange-700 dark:text-orange-400 mb-2">
                                        <AlertTriangle className="mr-2 h-5 w-5" /> The Challenge
                                    </h3>
                                    <p className="text-sm md:text-base">{project.challenges}</p>
                                </div>
                            )}

                            {project.solutions && (
                                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-100 dark:border-blue-900/50">
                                    <h3 className="flex items-center text-lg font-medium text-blue-700 dark:text-blue-400 mb-2">
                                        <Lightbulb className="mr-2 h-5 w-5" /> The Solution
                                    </h3>
                                    <p className="text-sm md:text-base">{project.solutions}</p>
                                </div>
                            )}

                            {project.results && (
                                <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-100 dark:border-green-900/50">
                                    <h3 className="flex items-center text-lg font-medium text-green-700 dark:text-green-400 mb-2">
                                        <CheckCircle className="mr-2 h-5 w-5" /> The Results
                                    </h3>
                                    <p className="text-sm md:text-base">{project.results}</p>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Gallery */}
                    {galleryImages.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {galleryImages.map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                                        <img src={img} alt={`${project.name}`} className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-8">
                    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                        <h3 className="font-semibold text-lg mb-4">Project Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center"><User className="h-4 w-4 mr-2" /> Client</span>
                                <span className="font-medium">{project.client || 'N/A'}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center"><Calendar className="h-4 w-4 mr-2" /> Date</span>
                                <span className="font-medium">
                                    {project.completionDate ? format(new Date(project.completionDate), 'MMM yyyy') : 'Ongoing'}
                                </span>
                            </div>
                            {project.role && (
                                <>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground flex items-center"><User className="h-4 w-4 mr-2" /> Role</span>
                                        <span className="font-medium">{project.role}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {technologies.length > 0 && (
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                            <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <Layers className="mr-2 h-5 w-5" /> Tech Stack
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {technologies.map((tech: string) => (
                                    <Badge key={tech} variant="secondary">{tech}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.clientLogo && (
                        <div className="p-6 flex justify-center">
                            <img src={project.clientLogo} alt="Client Logo" className="object-contain opacity-80 hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
