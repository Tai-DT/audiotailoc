'use client';

import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function RegisterPage() {
  const handleSuccess = () => {
    // Redirect to home page after successful registration
    window.location.href = '/';
  };

  return (
    <AuthGuard requireGuest redirectTo="/">
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Audio Tài Lộc</h1>
            <p className="text-gray-600">Hệ thống âm thanh chuyên nghiệp</p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => window.location.href = '/login'}
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            © 2025 Audio Tài Lộc. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
