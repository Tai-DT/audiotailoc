import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ServiceTypeForm } from '@/components/services/service-type-form';
import { serviceTypeApi } from '@/lib/api/service-types';

interface EditServiceTypePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditServiceTypePageProps): Promise<Metadata> {
  const serviceType = await serviceTypeApi.getById(params.id).catch(() => null);
  
  return {
    title: serviceType ? `Chỉnh sửa: ${serviceType.name}` : 'Không tìm thấy loại dịch vụ',
  };
}

export default async function EditServiceTypePage({ params }: EditServiceTypePageProps) {
  const serviceType = await serviceTypeApi.getById(params.id).catch(() => null);
  
  if (!serviceType) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Chỉnh sửa loại dịch vụ</h1>
          <p className="text-muted-foreground">
            Cập nhật thông tin loại dịch vụ
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <ServiceTypeForm initialData={serviceType} />
        </div>
      </div>
    </div>
  );
}
