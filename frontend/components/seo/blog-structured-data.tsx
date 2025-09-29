import { BlogArticle } from '@/lib/types';

interface BlogStructuredDataProps {
  article: BlogArticle;
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, '');

export function BlogStructuredData({ article }: BlogStructuredDataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com';
  const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/blog/${article.slug}`;

  const description = (article.seoDescription || article.excerpt || stripHtml(article.content))
    .substring(0, 200)
    .trim();

  const keywords = article.seoKeywords
    ? article.seoKeywords.split(',').map((keyword) => keyword.trim()).filter(Boolean)
    : [];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.seoTitle || article.title,
    description,
    articleSection: article.category?.name,
    keywords: keywords.join(', '),
    image: article.imageUrl ? [article.imageUrl] : undefined,
    author: {
      '@type': 'Organization',
      name: 'Audio Tài Lộc',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Audio Tài Lộc',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl.replace(/\/$/, '')}/logo.png`,
      },
    },
    datePublished: article.publishedAt ?? article.createdAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ViewAction',
        userInteractionCount: article.viewCount,
      },
      article.likeCount > 0
        ? {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/LikeAction',
            userInteractionCount: article.likeCount,
          }
        : null,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
