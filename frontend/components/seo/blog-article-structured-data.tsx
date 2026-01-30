import React from 'react';
import { BlogArticle } from '@/lib/types';

interface BlogStructuredDataProps {
 article: BlogArticle;
}

export function BlogStructuredData({ article }: BlogStructuredDataProps) {
 const structuredData = {
 '@context': 'https://schema.org',
 '@type': 'BlogPosting',
 headline: article.title,
 description: article.excerpt || article.seoDescription || article.title,
 image: article.imageUrl ? [article.imageUrl] : [],
 datePublished: article.publishedAt || article.createdAt,
 dateModified: article.updatedAt,
 author: {
 '@type': 'Person',
 name: article.author?.name || 'Audio Tài Lộc',
 url: 'https://audiotailoc.com',
 },
 publisher: {
 '@type': 'Organization',
 name: 'Audio Tài Lộc',
 logo: {
 '@type': 'ImageObject',
 url: 'https://audiotailoc.com/images/logo/logo-light.png',
 },
 },
 mainEntityOfPage: {
 '@type': 'WebPage',
 '@id': `https://audiotailoc.com/blog/${article.slug}`,
 },
 articleSection: article.category?.name,
 keywords: article.seoKeywords ? article.seoKeywords.split(',').map(k => k.trim()) : [],
 interactionStatistic: [
 {
 '@type': 'InteractionCounter',
 interactionType: 'https://schema.org/ViewAction',
 userInteractionCount: article.viewCount,
 },
 {
 '@type': 'InteractionCounter',
 interactionType: 'https://schema.org/LikeAction',
 userInteractionCount: article.likeCount,
 },
 ],
 commentCount: article.commentCount,
 wordCount: article.content.split(' ').length,
 timeRequired: `PT${Math.ceil(article.content.split(' ').length / 200)}M`, // Rough estimate
 inLanguage: 'vi',
 isFamilyFriendly: true,
 copyrightHolder: {
 '@type': 'Organization',
 name: 'Audio Tài Lộc',
 },
 license: 'https://creativecommons.org/licenses/by/4.0/', // Adjust as needed
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