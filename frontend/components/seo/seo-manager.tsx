'use client';

import { useState } from 'react';
import { useGlobalSEO } from '@/lib/hooks/use-seo';

interface SEOManagerProps {
  entity?: {
    id: string;
    name: string;
    slug: string;
    type: 'product' | 'service' | 'blog' | 'page';
    currentSEO?: {
      title?: string;
      description?: string;
      keywords?: string[];
      canonical?: string;
    };
  };
}

export function SEOManager({ entity }: SEOManagerProps) {
  const { data: globalSEO } = useGlobalSEO();
  const [seoData, setSeoData] = useState({
    title: entity?.currentSEO?.title || '',
    description: entity?.currentSEO?.description || '',
    keywords: entity?.currentSEO?.keywords?.join(', ') || '',
    canonical: entity?.currentSEO?.canonical || '',
  });

  const handleSave = async () => {
    if (!entity) return;
    
    try {
      // Save SEO data via API
      const response = await fetch(`/api/seo/${entity.type}/${entity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seoTitle: seoData.title,
          seoDescription: seoData.description,
          metaKeywords: seoData.keywords.split(',').map(k => k.trim()).filter(Boolean),
          canonicalUrl: seoData.canonical,
        }),
      });
      
      if (response.ok) {
        alert('SEO data saved successfully!');
      } else {
        throw new Error('Failed to save SEO data');
      }
    } catch (error) {
      console.error('Error saving SEO data:', error);
      alert('Failed to save SEO data. Please try again.');
    }
  };

  const generateTitle = () => {
    if (!entity || !globalSEO) return;
    const generated = `${entity.name} | ${globalSEO.siteName}`;
    setSeoData(prev => ({ ...prev, title: generated }));
  };

  const generateDescription = () => {
    if (!entity) return;
    // This would be more sophisticated in a real implementation
    const generated = `Discover ${entity.name} at Audio Tài Lộc. Professional audio solutions for your needs.`;
    setSeoData(prev => ({ ...prev, description: generated }));
  };

  const generateCanonical = () => {
    if (!entity) return;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com';
    let path = '';
    
    switch (entity.type) {
      case 'product':
        path = `/products/${entity.slug}`;
        break;
      case 'service':
        path = `/services/${entity.slug}`;
        break;
      case 'blog':
        path = `/blog/${entity.slug}`;
        break;
      default:
        path = `/${entity.slug}`;
    }
    
    const generated = `${baseUrl}${path}`;
    setSeoData(prev => ({ ...prev, canonical: generated }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        SEO Management
        {entity && (
          <span className="text-lg font-normal text-gray-600 ml-2">
            - {entity.name} ({entity.type})
          </span>
        )}
      </h2>

      {!entity ? (
        <div className="text-center py-8 text-gray-500">
          <p>Select an entity to manage its SEO settings</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
              <span className="text-gray-500 font-normal ml-2">
                ({seoData.title.length}/60 characters recommended)
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={seoData.title}
                onChange={(e) => setSeoData(prev => ({ ...prev, title: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter meta title..."
              />
              <button
                onClick={generateTitle}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Generate
              </button>
            </div>
            {seoData.title.length > 60 && (
              <p className="text-red-500 text-sm mt-1">Title is too long (over 60 characters)</p>
            )}
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
              <span className="text-gray-500 font-normal ml-2">
                ({seoData.description.length}/160 characters recommended)
              </span>
            </label>
            <div className="flex flex-col gap-2">
              <textarea
                value={seoData.description}
                onChange={(e) => setSeoData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter meta description..."
              />
              <button
                onClick={generateDescription}
                className="self-start px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Generate Description
              </button>
            </div>
            {seoData.description.length > 160 && (
              <p className="text-red-500 text-sm mt-1">Description is too long (over 160 characters)</p>
            )}
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
              <span className="text-gray-500 font-normal ml-2">
                (comma-separated)
              </span>
            </label>
            <input
              type="text"
              value={seoData.keywords}
              onChange={(e) => setSeoData(prev => ({ ...prev, keywords: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="keyword1, keyword2, keyword3..."
            />
          </div>

          {/* Canonical URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canonical URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={seoData.canonical}
                onChange={(e) => setSeoData(prev => ({ ...prev, canonical: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://audiotailoc.com/..."
              />
              <button
                onClick={generateCanonical}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">SEO Preview</h3>
            
            {/* Google Search Preview */}
            <div className="bg-white p-3 rounded border">
              <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                {seoData.title || entity.name}
              </div>
              <div className="text-green-600 text-sm">
                {seoData.canonical || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/${entity.type}s/${entity.slug}`}
              </div>
              <div className="text-gray-600 text-sm mt-1">
                {seoData.description || `Learn more about ${entity.name} at Audio Tài Lộc.`}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Save SEO Data
            </button>
            <button
              onClick={() => setSeoData({
                title: entity.currentSEO?.title || '',
                description: entity.currentSEO?.description || '',
                keywords: entity.currentSEO?.keywords?.join(', ') || '',
                canonical: entity.currentSEO?.canonical || '',
              })}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SEOManager;