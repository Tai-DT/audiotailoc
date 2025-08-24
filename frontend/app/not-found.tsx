import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🔍</div>
            <CardTitle className="text-2xl">Không tìm thấy trang</CardTitle>
            <CardDescription>
              Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-8xl font-bold text-gray-200">404</div>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/">Về trang chủ</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/products">Xem sản phẩm</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
