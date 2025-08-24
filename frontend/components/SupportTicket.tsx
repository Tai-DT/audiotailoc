"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SupportTicketFormProps {
  onSubmit?: (ticket: any) => void;
  userEmail?: string;
  userName?: string;
}

export default function SupportTicketForm({ 
  onSubmit, 
  userEmail = '', 
  userName = '' 
}: SupportTicketFormProps) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    email: userEmail,
    name: userName,
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim() || !formData.email.trim() || !formData.name.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const ticket = await response.json();
        setSubmitted(true);
        if (onSubmit) {
          onSubmit(ticket);
        }
      } else {
        throw new Error('Failed to create ticket');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Yêu cầu đã được gửi thành công!</h3>
            <p className="text-gray-600 mb-4">
              Chúng tôi đã nhận được yêu cầu hỗ trợ của bạn và sẽ phản hồi trong thời gian sớm nhất.
            </p>
            <p className="text-sm text-gray-500">
              Bạn sẽ nhận được email xác nhận và cập nhật về trạng thái yêu cầu.
            </p>
            <Button 
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  subject: '',
                  description: '',
                  email: userEmail,
                  name: userName,
                  priority: 'MEDIUM',
                });
              }}
              className="mt-4"
            >
              Gửi yêu cầu khác
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gửi yêu cầu hỗ trợ</CardTitle>
        <CardDescription>
          Mô tả vấn đề bạn gặp phải và chúng tôi sẽ hỗ trợ bạn sớm nhất có thể
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Họ và tên *
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Nhập địa chỉ email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-2">
              Mức độ ưu tiên
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Thấp</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="HIGH">Cao</option>
              <option value="URGENT">Khẩn cấp</option>
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Tiêu đề *
            </label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Mô tả ngắn gọn vấn đề"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Mô tả chi tiết *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Mô tả chi tiết vấn đề bạn gặp phải, bao gồm các bước đã thực hiện và kết quả mong muốn"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Mẹo để được hỗ trợ nhanh hơn:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Mô tả rõ ràng vấn đề và các bước đã thực hiện</li>
              <li>• Cung cấp thông tin sản phẩm (tên, model, số serial nếu có)</li>
              <li>• Đính kèm ảnh chụp màn hình nếu có lỗi hiển thị</li>
              <li>• Cho biết thời gian xảy ra vấn đề</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  subject: '',
                  description: '',
                  email: userEmail,
                  name: userName,
                  priority: 'MEDIUM',
                });
                setError('');
              }}
            >
              Đặt lại
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang gửi...
                </>
              ) : (
                'Gửi yêu cầu'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
