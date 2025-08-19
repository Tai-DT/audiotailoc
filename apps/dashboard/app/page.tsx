import AdminNotice from './AdminNotice';
import { apiFetch } from './lib/api';

export default async function AdminHome() {
  const me = await apiFetch<{ role?: string }>('/auth/me').catch(() => null);
  const isAdmin = me?.role === 'ADMIN';
  return (
    <main>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảng điều khiển quản trị</h1>
        <p className="text-gray-600">Chào mừng đến với hệ thống quản lý Audio Tài Lộc</p>
      </div>

      {!isAdmin ? (
        <AdminNotice>Đây là khu vực quản trị. Bạn đang ở chế độ xem chỉ đọc.</AdminNotice>
      ) : null}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              📦
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Sản phẩm</h3>
              <p className="text-2xl font-bold text-blue-600">-</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              📋
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Đơn hàng</h3>
              <p className="text-2xl font-bold text-green-600">-</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              👥
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Khách hàng</h3>
              <p className="text-2xl font-bold text-yellow-600">-</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              💰
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Doanh thu</h3>
              <p className="text-2xl font-bold text-purple-600">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="/products/new" 
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="font-medium">Thêm sản phẩm mới</div>
          </a>
          
          <a 
            href="/inventory" 
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">Quản lý kho hàng</div>
          </a>
          
          <a 
            href="/orders" 
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium">Xem đơn hàng</div>
          </a>
        </div>
      </div>
    </main>
  );
}

