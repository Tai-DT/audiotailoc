'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/toast-component';
import { serviceTypeApi } from '@/lib/api-client';

const formSchema = z.object({
  name: z.string().min(1, 'Tên là bắt buộc'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type ServiceTypeFormValues = z.infer<typeof formSchema>;

interface ServiceTypeFormProps {
  initialData?: ServiceType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ServiceTypeForm({ initialData, onSuccess, onCancel }: ServiceTypeFormProps) {
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData;

  const defaultValues: ServiceTypeFormValues = {
    name: '',
    description: '',
    isActive: true,
  };

  const form = useForm<ServiceTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...defaultValues,
      ...initialData,
      isActive: initialData.isActive ?? true,
    } : defaultValues,
  });

  const onSubmit = async (values: ServiceTypeFormValues) => {
    try {
      setLoading(true);
      
      if (isEdit) {
        await serviceTypeApi.update(initialData.id, values);
        showToast({
          title: 'Thành công',
          description: 'Đã cập nhật loại dịch vụ',
        });
      } else {
        await serviceTypeApi.create(values);
        showToast({
          title: 'Thành công',
          description: 'Đã thêm loại dịch vụ mới',
        });
      }

      onSuccess?.();
      
      if (!onSuccess) {
        router.push('/admin/services/types');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to save service type:', error);
      showToast({
        title: 'Lỗi',
        description: 'Không thể lưu loại dịch vụ',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên loại dịch vụ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên loại dịch vụ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả về loại dịch vụ"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Hiển thị</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    {field.value ? 'Đang hiển thị' : 'Đang ẩn'}
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel || (() => router.back())}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <span>Đang lưu...</span>
            ) : isEdit ? (
              'Cập nhật'
            ) : (
              'Thêm mới'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
