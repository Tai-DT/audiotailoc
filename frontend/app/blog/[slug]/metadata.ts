import { Metadata } from 'next';
import { apiClient, handleApiResponse } from '@/lib/api';
import { BlogArticle } from '@/lib/types';

async function getBlogArticle ( slug: string ): Promise<BlogArticle | null>
{
    try
    {
        const response = await apiClient.get( `/blog/articles/${ slug }` );
        return handleApiResponse<BlogArticle>( response );
    } catch ( error )
    {
        console.error( 'Failed to fetch blog article for metadata:', error );
        return null;
    }
}

export async function generateMetadata ( { params }: { params: Promise<{ slug: string }> } ): Promise<Metadata>
{
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const article = await getBlogArticle( slug );

    if ( !article )
    {
        return {
            title: 'Bài viết không tìm thấy | Audio Tài Lộc',
            description: 'Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
        };
    }

    const title = article.seoTitle || `${ article.title } | Blog Audio Tài Lộc`;
    const description = article.seoDescription || article.excerpt || ( article.content || '' ).substring( 0, 160 ).replace( /<[^>]*>/g, '' );
    const keywords = article.seoKeywords || article.tags?.join( ', ' ) || 'blog, âm thanh, audio tài lộc';
    const image = article.imageUrl || '/og-image.jpg';

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
            type: 'article',
            publishedTime: article.publishedAt || article.createdAt,
            authors: [ article.author?.name || 'Audio Tài Lộc' ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ image ],
        },
        alternates: {
            canonical: `${ process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com' }/blog/${ article.slug || slug }`,
        },
    };
}
