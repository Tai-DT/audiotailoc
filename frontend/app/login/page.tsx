import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  async function action(data: FormData) {
    'use server';
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ? '' : ''}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return;
    return;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Audio Tài Lộc</h1>
          <p className="text-gray-600 text-sm sm:text-base">Đăng nhập vào tài khoản của bạn</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
            <CardDescription>
              Nhập email và mật khẩu để truy cập tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="your@email.com"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  required
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Đăng nhập
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

