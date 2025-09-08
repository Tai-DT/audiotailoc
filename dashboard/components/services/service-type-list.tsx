'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/components/ui/toast-component';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ServiceType } from '@/types/service-type';
import { serviceTypeApi } from '@/lib/api/service-types';

type ServiceTypeListProps = {
  categoryId?: string;
  onSelect?: (type: ServiceType) => void;
  mode?: 'select' | 'manage';
};

export function ServiceTypeList({ categoryId, onSelect, mode = 'manage' }: ServiceTypeListProps) {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();

  const loadServiceTypes = async () => {
    try {
      setLoading(true);
      const data = await serviceTypeApi.getAll(categoryId);
      setServiceTypes(data);
    } catch (error) {
      console.error('Failed to load service types:', error);
      showToast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách loại dịch vụ',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServiceTypes();
  }, [categoryId]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await serviceTypeApi.delete(id);
      setServiceTypes(prev => prev.filter(type => type.id !== id));
      showToast({
        title: 'Thành công',
        description: 'Đã xóa loại dịch vụ',
      });
    } catch (error) {
      console.error('Failed to delete service type:', error);
      showToast({
        title: 'Lỗi',
        description: 'Không thể xóa loại dịch vụ',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await serviceTypeApi.toggleStatus(id, !currentStatus);
      setServiceTypes(prev =>
        prev.map(type =>
          type.id === id ? { ...type, isActive: !currentStatus } : type
        )
      );
      showToast({
        title: 'Thành công',
        description: `Đã ${currentStatus ? 'tắt' : 'bật'} loại dịch vụ`,
      });
    } catch (error) {
      console.error('Failed to toggle service type status:', error);
      showToast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái',
        variant: 'destructive',
      });
    }
  };

  const columns: ColumnDef<ServiceType>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.name}
          {!row.original.isActive && (
            <span className="ml-2 text-xs text-muted-foreground">(Đã ẩn)</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
      cell: ({ row }) => (
        <div className="text-muted-foreground line-clamp-1">
          {row.original.description || 'Không có mô tả'}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Danh mục',
      cell: ({ row }) => row.original.category?.name || 'Chưa phân loại',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const type = row.original;
        return (
          <div className="flex items-center space-x-2">
            {mode === 'select' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelect?.(type)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/services/types/${type.id}/edit`)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteId(type.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Loại dịch vụ</h2>
        {mode === 'manage' && (
          <Button onClick={() => router.push('/admin/services/types/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm mới
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={serviceTypes}
        isLoading={loading}
        searchKey="name"
        emptyMessage="Không có loại dịch vụ nào"
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await handleDelete(deleteId);
          }
        }}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa loại dịch vụ này?"
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  );
}
