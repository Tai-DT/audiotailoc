import { Metadata } from 'next';
import { ServiceTypeForm } from '@/components/services/service-type-form';

export const metadata: Metadata = {
  title: 'Thêm loại dịch vụ mới',
  description: 'Thêm loại dịch vụ mới vào hệ thống',
};

export default function NewServiceTypePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Thêm loại dịch vụ mới</h1>
          <p className="text-muted-foreground">
            Thêm thông tin loại dịch vụ mới vào hệ thống
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <ServiceTypeForm />
        </div>
      </div>
    </div>
  );
}
