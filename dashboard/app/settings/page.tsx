"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Settings, Save, CreditCard, Bell } from 'lucide-react';
import ChangePasswordForm from '../../components/forms/change-password-form';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'Audio Tài Lộc',
    storeEmail: 'contact@audiotailoc.com',
    storePhone: '0901 234 567',
    storeAddress: '123 Đường ABC, Quận 1, TP.HCM',
    paymentGateway: 'vnpay',
    emailNotifications: true,
    smsNotifications: false
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // In real app, this would call backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Cài đặt đã được lưu thành công!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
          <p className="text-gray-600">Quản lý cấu hình hệ thống</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Thông tin cửa hàng
          </CardTitle>
          <CardDescription>
            Thông tin cơ bản về cửa hàng của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Tên cửa hàng</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => handleInputChange('storeName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Email cửa hàng</Label>
              <Input
                id="storeEmail"
                type="email"
                value={settings.storeEmail}
                onChange={(e) => handleInputChange('storeEmail', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone">Số điện thoại</Label>
              <Input
                id="storePhone"
                value={settings.storePhone}
                onChange={(e) => handleInputChange('storePhone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentGateway">Cổng thanh toán</Label>
              <select
                id="paymentGateway"
                value={settings.paymentGateway}
                onChange={(e) => handleInputChange('paymentGateway', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="vnpay">VNPay</option>
                <option value="momo">MoMo</option>
                <option value="payos">PayOS</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeAddress">Địa chỉ cửa hàng</Label>
            <Input
              id="storeAddress"
              value={settings.storeAddress}
              onChange={(e) => handleInputChange('storeAddress', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Cài đặt thông báo
          </CardTitle>
          <CardDescription>
            Quản lý các loại thông báo hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email thông báo</p>
                <p className="text-sm text-gray-600">Gửi thông báo qua email</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                className="h-4 w-4 text-blue-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS thông báo</p>
                <p className="text-sm text-gray-600">Gửi thông báo qua SMS</p>
              </div>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                className="h-4 w-4 text-blue-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <ChangePasswordForm />
    </div>
  );
}