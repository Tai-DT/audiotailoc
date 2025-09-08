import { Metadata } from 'next';
import { ServiceTypeList } from '@/components/services/service-type-list';

export const metadata: Metadata = {
  title: 'Quản lý loại dịch vụ',
  description: 'Quản lý các loại dịch vụ trong hệ thống',
};

export default function ServiceTypesPage() {
  return (
    <div className="container mx-auto py-6">
      <ServiceTypeList />
    </div>
  );
}
