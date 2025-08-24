'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Heart, 
  Search, 
  Languages, 
  MessageSquare, 
  Brain,
  Zap,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';
import AIContentGenerator from '@/components/ai/AIContentGenerator';
import AISentimentAnalyzer from '@/components/ai/AISentimentAnalyzer';
import AIProductRecommender from '@/components/ai/AIProductRecommender';
import AITranslator from '@/components/ai/AITranslator';

const aiTools = [
  {
    id: 'content-generator',
    name: 'Content Generator',
    description: 'Tạo mô tả sản phẩm, bài viết marketing tự động',
    icon: Sparkles,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    features: ['Mô tả sản phẩm', 'Email templates', 'Marketing copy', 'Blog posts', 'FAQ'],
    component: AIContentGenerator
  },
  {
    id: 'sentiment-analyzer',
    name: 'Sentiment Analyzer',
    description: 'Phân tích cảm xúc từ feedback khách hàng',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    features: ['Phân tích cảm xúc', 'Đánh giá mức độ hài lòng', 'Phát hiện vấn đề', 'Insights tự động'],
    component: AISentimentAnalyzer
  },
  {
    id: 'product-recommender',
    name: 'Product Recommender',
    description: 'Gợi ý sản phẩm thông minh dựa trên nhu cầu',
    icon: Search,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    features: ['Gợi ý sản phẩm', 'Tư vấn thông minh', 'Cross-selling', 'Personalization'],
    component: AIProductRecommender
  },
  {
    id: 'translator',
    name: 'AI Translator',
    description: 'Dịch thuật đa ngôn ngữ chính xác',
    icon: Languages,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    features: ['Đa ngôn ngữ', 'Dịch tự động', 'Hỗ trợ khách quốc tế', 'Chính xác cao'],
    component: AITranslator
  }
];

const stats = [
  { label: 'Tổng số tính năng AI', value: '8', icon: Brain, color: 'text-blue-600' },
  { label: 'Độ chính xác', value: '95%', icon: Star, color: 'text-yellow-600' },
  { label: 'Tốc độ xử lý', value: '< 2s', icon: Zap, color: 'text-green-600' },
  { label: 'Khách hàng phục vụ', value: '1000+', icon: Users, color: 'text-purple-600' }
];

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Tools Hub
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bộ công cụ AI thông minh được tối ưu hóa đặc biệt cho Audio Tài Lộc, 
            giúp tăng doanh số và cải thiện trải nghiệm khách hàng
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="content-generator">Content Generator</TabsTrigger>
            <TabsTrigger value="sentiment-analyzer">Sentiment Analyzer</TabsTrigger>
            <TabsTrigger value="product-recommender">Product Recommender</TabsTrigger>
            <TabsTrigger value="translator">Translator</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* AI Tools Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiTools.map((tool) => (
                <Card 
                  key={tool.id} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setActiveTab(tool.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${tool.bgColor}`}>
                        <tool.icon className={`h-6 w-6 ${tool.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {tool.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveTab(tool.id)}
                      >
                        Sử dụng ngay
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Benefits Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Lợi ích của AI Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="p-3 bg-green-100 rounded-full w-fit mx-auto">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold">Tăng doanh số</h3>
                    <p className="text-sm text-muted-foreground">
                      Gợi ý sản phẩm thông minh và nội dung marketing hấp dẫn
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold">Cải thiện dịch vụ</h3>
                    <p className="text-sm text-muted-foreground">
                      Phân tích feedback và hỗ trợ khách hàng 24/7
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Tiết kiệm thời gian</h3>
                    <p className="text-sm text-muted-foreground">
                      Tự động hóa các tác vụ lặp đi lặp lại
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {aiTools.map((tool) => (
            <TabsContent key={tool.id} value={tool.id}>
              <tool.component />
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">
              Sẵn sàng sử dụng AI Tools?
            </h3>
            <p className="text-muted-foreground mb-4">
              Tất cả các công cụ AI đã được tối ưu hóa và sẵn sàng sử dụng
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={() => setActiveTab('content-generator')}>
                <Sparkles className="mr-2 h-4 w-4" />
                Tạo nội dung
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('product-recommender')}>
                <Search className="mr-2 h-4 w-4" />
                Gợi ý sản phẩm
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('translator')}>
                <Languages className="mr-2 h-4 w-4" />
                Dịch thuật
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
