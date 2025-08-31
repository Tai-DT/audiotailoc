"use client"

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  viewCount: number;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeBaseProps {
  showSearch?: boolean;
  category?: string;
  limit?: number;
}

export default function KnowledgeBase({ 
  showSearch = true, 
  category, 
  limit 
}: KnowledgeBaseProps) {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/support/kb/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }, []);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
      params.set('published', 'true');
      if (limit) params.set('pageSize', limit.toString());

      const response = await fetch(`/api/support/kb/articles?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data.items || []);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, limit]);

  useEffect(() => {
    loadCategories();
    loadArticles();
  }, [loadCategories, loadArticles]);

  const searchArticles = async () => {
    if (!searchQuery.trim()) {
      loadArticles();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/support/kb/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Failed to search articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = async (article: KnowledgeBaseArticle) => {
    setSelectedArticle(article);
    
    // Track view (in real app, this would increment view count)
    try {
      await fetch(`/api/support/kb/articles/${article.id}/view`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  };

  const handleHelpfulVote = async (articleId: string, helpful: boolean) => {
    try {
      await fetch(`/api/support/kb/articles/${articleId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful })
      });
      
      // Refresh article data
      loadArticles();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedArticle(null)}
            className="mb-4"
          >
            ← Quay lại
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
                <CardDescription>
                  Danh mục: {selectedArticle.category} • 
                  Lượt xem: {selectedArticle.viewCount} • 
                  Cập nhật: {new Date(selectedArticle.updatedAt).toLocaleDateString('vi-VN')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
            </div>

            {/* Tags */}
            {selectedArticle.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Helpful voting */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium mb-3">Bài viết này có hữu ích không?</h4>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleHelpfulVote(selectedArticle.id, true)}
                  className="flex items-center space-x-2"
                >
                  <span>👍</span>
                  <span>Có ({selectedArticle.helpful})</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleHelpfulVote(selectedArticle.id, false)}
                  className="flex items-center space-x-2"
                >
                  <span>👎</span>
                  <span>Không ({selectedArticle.notHelpful})</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Trung tâm trợ giúp</h2>
        <p className="text-gray-600">Tìm câu trả lời cho các câu hỏi thường gặp</p>
      </div>
      {/* Search and Filters */}
      {showSearch && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchArticles()}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Button onClick={searchArticles}>Tìm kiếm</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Articles List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid gap-4">
          {articles.map((article) => (
            <Card 
              key={article.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleArticleClick(article)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{article.title}</CardTitle>
                <CardDescription>
                  {article.category} • {article.viewCount} lượt xem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-2">
                  {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold mb-2">Không tìm thấy bài viết</h3>
              <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
