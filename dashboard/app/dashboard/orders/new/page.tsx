import { OrderForm } from '@/components/orders/OrderForm';

export default function NewOrderPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tạo đơn hàng mới</h1>
        <p className="text-muted-foreground">
          Chọn sản phẩm và số lượng để tạo đơn hàng mới
        </p>
      </div>
      
      <OrderForm />
    </div>
  );
}
