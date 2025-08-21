"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Send,
  Eye,
  Edit,
  Trash2,
  Mail,
  MessageCircle,
  Calendar,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  subject?: string;
  content?: string;
  targetAudience: string;
  scheduledDate?: string;
  sentCount?: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'email' as const,
    subject: '',
    content: '',
    targetAudience: 'all'
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      // Mock data for now - in real app, this would fetch from backend
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          name: 'Khuyến mãi tháng 10',
          type: 'email',
          status: 'active',
          subject: 'Giảm giá 30% cho tất cả sản phẩm âm thanh!',
          content: 'Chào bạn, chúng tôi có chương trình khuyến mãi đặc biệt...',
          targetAudience: 'all_customers',
          sentCount: 1250,
          openRate: 45.2,
          clickRate: 12.8,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Thông báo sản phẩm mới',
          type: 'push',
          status: 'scheduled',
          content: 'Khám phá bộ sưu tập loa Bluetooth mới!',
          targetAudience: 'premium_customers',
          scheduledDate: new Date(Date.now() + 86400000).toISOString(),
          createdAt: new Date().toISOString()
        }
      ];
      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would call backend API
    const campaign: Campaign = {
      id: Date.now().toString(),
      ...newCampaign,
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    setCampaigns(prev => [campaign, ...prev]);
    setShowCreateForm(false);
    setNewCampaign({
      name: '',
      type: 'email',
      subject: '',
      content: '',
      targetAudience: 'all'
    });
  };

  const getStatusBadge = (status: Campaign['status']) => {
    const config = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Nháp' },
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Đã lên lịch' },
      active: { color: 'bg-green-100 text-green-800', label: 'Đang chạy' },
      completed: { color: 'bg-purple-100 text-purple-800', label: 'Hoàn thành' },
      paused: { color: 'bg-orange-100 text-orange-800', label: 'Tạm dừng' }
    };
    const { color, label } = config[status];
    return <Badge className={`${color}`}>{label}</Badge>;
  };

  const getTypeIcon = (type: Campaign['type']) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageCircle className="h-4 w-4" />;
      case 'push': return <Send className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing</h1>
          <p className="text-gray-600">Quản lý chiến dịch marketing và thông báo</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo chiến dịch
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">Chiến dịch</TabsTrigger>
          <TabsTrigger value="analytics">Thống kê</TabsTrigger>
          <TabsTrigger value="templates">Mẫu</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          {/* Create Campaign Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>Tạo chiến dịch mới</CardTitle>
                <CardDescription>
                  Thiết lập thông tin cơ bản cho chiến dịch marketing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCampaign} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tên chiến dịch</Label>
                      <Input
                        id="name"
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nhập tên chiến dịch"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Loại chiến dịch</Label>
                      <select
                        id="type"
                        value={newCampaign.type}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="push">Push Notification</option>
                      </select>
                    </div>
                  </div>

                  {newCampaign.type === 'email' && (
                    <div className="space-y-2">
                      <Label htmlFor="subject">Tiêu đề email</Label>
                      <Input
                        id="subject"
                        value={newCampaign.subject}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Nhập tiêu đề email"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="content">Nội dung</Label>
                    <Textarea
                      id="content"
                      value={newCampaign.content}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Nhập nội dung chiến dịch"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audience">Đối tượng mục tiêu</Label>
                    <select
                      id="audience"
                      value={newCampaign.targetAudience}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, targetAudience: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="all">Tất cả khách hàng</option>
                      <option value="new">Khách hàng mới</option>
                      <option value="premium">Khách hàng VIP</option>
                      <option value="inactive">Khách hàng không hoạt động</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">Tạo chiến dịch</Button>
                    <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                      Hủy
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Campaigns List */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách chiến dịch</CardTitle>
              <CardDescription>
                Quản lý các chiến dịch marketing hiện có
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2">Đang tải...</p>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Chưa có chiến dịch nào</p>
                  <Button className="mt-2" onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo chiến dịch đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(campaign.type)}
                          <div>
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <p className="text-sm text-gray-600">
                              Tạo ngày {new Date(campaign.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(campaign.status)}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {campaign.subject && (
                        <p className="text-sm font-medium mb-2">Tiêu đề: {campaign.subject}</p>
                      )}

                      {campaign.scheduledDate && (
                        <p className="text-sm text-gray-600 mb-2">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Lên lịch: {new Date(campaign.scheduledDate).toLocaleDateString('vi-VN')}
                        </p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {campaign.sentCount !== undefined && (
                          <div>
                            <p className="text-gray-600">Đã gửi</p>
                            <p className="font-semibold">{campaign.sentCount.toLocaleString()}</p>
                          </div>
                        )}
                        {campaign.openRate !== undefined && (
                          <div>
                            <p className="text-gray-600">Tỷ lệ mở</p>
                            <p className="font-semibold">{campaign.openRate}%</p>
                          </div>
                        )}
                        {campaign.clickRate !== undefined && (
                          <div>
                            <p className="text-gray-600">Tỷ lệ nhấp</p>
                            <p className="font-semibold">{campaign.clickRate}%</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-600">Đối tượng</p>
                          <p className="font-semibold">
                            {campaign.targetAudience === 'all' ? 'Tất cả' :
                             campaign.targetAudience === 'new' ? 'Khách mới' :
                             campaign.targetAudience === 'premium' ? 'VIP' : 'Không hoạt động'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng email gửi</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ mở trung bình</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42.3%</div>
                <p className="text-xs text-muted-foreground">+5.2% so với tháng trước</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ chuyển đổi</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.7%</div>
                <p className="text-xs text-muted-foreground">+2.1% so với tháng trước</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê chi tiết</CardTitle>
              <CardDescription>
                Phân tích hiệu quả các chiến dịch marketing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Biểu đồ thống kê sẽ hiển thị ở đây</p>
                <p className="text-sm text-gray-400 mt-2">
                  Tích hợp với Google Analytics, Facebook Pixel, etc.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mẫu email marketing</CardTitle>
              <CardDescription>
                Các mẫu email được thiết kế sẵn cho chiến dịch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="font-semibold mb-2">Khuyến mãi</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Mẫu email thông báo chương trình khuyến mãi đặc biệt
                  </p>
                  <Button size="sm" variant="outline">Xem mẫu</Button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="font-semibold mb-2">Sản phẩm mới</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Giới thiệu sản phẩm mới ra mắt
                  </p>
                  <Button size="sm" variant="outline">Xem mẫu</Button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="font-semibold mb-2">Bản tin</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Bản tin hàng tuần với tin tức và cập nhật
                  </p>
                  <Button size="sm" variant="outline">Xem mẫu</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
