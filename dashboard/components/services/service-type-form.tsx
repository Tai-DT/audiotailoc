'use client';

import { useState, useEffect } from 'react';
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
import { ServiceType, CreateServiceTypeDto, UpdateServiceTypeDto } from '@/types/service-type';
import { serviceTypeApi } from '@/lib/api/service-types';
import { serviceCategoryApi } from '@/lib/api/service-categories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(1, 'Tên là bắt buộc'),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
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
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const isEdit = !!initialData;

  const defaultValues: ServiceTypeFormValues = {
    name: '',
    description: '',
    icon: '',
    color: '#3b82f6',
    categoryId: '',
    isActive: true,
    sortOrder: 0,
  };

  const form = useForm<ServiceTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...defaultValues,
      ...initialData,
      sortOrder: initialData.sortOrder ?? 0,
      isActive: initialData.isActive ?? true,
    } : defaultValues,
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await serviceCategoryApi.getAll();
        setCategories(data);
        
        // Auto-select category if only one exists
        if (data.length === 1 && !initialData) {
          form.setValue('categoryId', data[0].id);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
        showToast({
          title: 'Lỗi',
          description: 'Không thể tải danh mục dịch vụ',
          variant: 'destructive',
        });
      }
    };

    loadCategories();
  }, [form, initialData, showToast]);

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
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biểu tượng</FormLabel>
                <FormControl>
                  <Input placeholder="Tên biểu tượng (VD: speaker, tv, etc.)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Màu sắc</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input type="color" className="h-10 w-16 p-1" {...field} />
                  </FormControl>
                  <Input
                    type="text"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-32"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thứ tự sắp xếp</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
