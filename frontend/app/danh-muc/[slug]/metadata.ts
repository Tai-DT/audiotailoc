import { Metadata } from 'next';
import { apiClient, handleApiResponse } from '@/lib/api';
import { Category } from '@/lib/types';

async function getCategory ( slug: string ): Promise<Category | null>
{
    try
    {
        const response = await apiClient.get( `/catalog/categories/slug/${ slug }` );
        return handleApiResponse<Category>( response );
    } catch ( error )
    {
        console.error( 'Failed to fetch category for metadata:', error );
        return null;
    }
}

export async function generateMetadata ( { params }: { params: Promise<{ slug: string }> } ): Promise<Metadata>
{
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const category = await getCategory( slug );

    if ( !category )
    {
        return {
            title: 'Danh mục không tìm thấy | Audio Tài Lộc',
            description: 'Danh mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
        };
    }

    const title = category.metaTitle || `${ category.name } | Audio Tài Lộc`;
    const description = category.metaDescription || category.description || `Khám phá các sản phẩm trong danh mục ${ category.name } tại Audio Tài Lộc.`;
    const keywords = category.metaKeywords || `${ category.name }, âm thanh, karaoke, thiết bị âm thanh`;

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            images: category.imageUrl ? [ { url: category.imageUrl } ] : undefined,
            type: 'website',
        },
        alternates: {
            canonical: `${ process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com' }/danh-muc/${ category.slug || slug }`,
        },
    };
}
