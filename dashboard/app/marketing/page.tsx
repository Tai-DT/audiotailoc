"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Mail, Users, TrendingUp, Calendar, Megaphone, Target } from 'lucide-react';

export default function MarketingPage() {
  const campaigns = [
    {
      id: '1',
      name: 'Khuyến mãi cuối năm',
      type: 'Email',
      status: 'Active',
      reach: 1250,
      engagement: 15.2,
      startDate: '2024-12-01',
      endDate: '2024-12-31'
    },
    {
      id: '2',
      name: 'Flash Sale Soundbar',
      type: 'Social Media',
      status: 'Scheduled',
      reach: 0,
      engagement: 0,
      startDate: '2024-12-15',
      endDate: '2024-12-15'
    },
    {
      id: '3',
      name: 'Newsletter tháng 12',
      type: 'Email',
      status: 'Completed',
      reach: 2100,
      engagement: 8.7,
      startDate: '2024-12-01',
      endDate: '2024-12-07'
    }
  ];

  const stats = [
    {
      title: 'Email Subscribers',
      value: '2,847',
      change: '+12.5%',
      icon: Mail,
      color: 'text-blue-600'
    },
    {
      title: 'Campaign Reach',
      value: '45.2K',
      change: '+8.3%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+0.8%',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
    {
      title: 'Active Campaigns',
      value: '7',
      change: '+2',
      icon: Target,
      color: 'text-purple-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing</h1>
          <p className="text-gray-600">Quản lý chiến dịch marketing và khách hàng tiềm năng</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Lịch trình
          </Button>
          <Button>
            <Megaphone className="h-4 w-4 mr-2" />
            Tạo chiến dịch
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600">
                {stat.change} so với tháng trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Chiến dịch marketing</CardTitle>
          <CardDescription>
            Quản lý các chiến dịch marketing đang chạy và đã hoàn thành
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{campaign.name}</h3>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <span className="text-sm text-gray-500">{campaign.type}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span>Reach: {campaign.reach.toLocaleString()}</span>
                    <span>Engagement: {campaign.engagement}%</span>
                    <span>
                      {new Date(campaign.startDate).toLocaleDateString('vi-VN')} - {new Date(campaign.endDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Chỉnh sửa
                  </Button>
                  <Button size="sm" variant="outline">
                    Báo cáo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Marketing</CardTitle>
            <CardDescription>Gửi email marketing tới khách hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Tạo email campaign
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Quản lý nội dung trên mạng xã hội</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Tạo bài đăng
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}