import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { softwareService } from '@/lib/services/software-service';
import { Software, SoftwareFormData } from '@/types/software';

export function useSoftware() {
  const [items, setItems] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await softwareService.list({ limit: 100 });
      const data = response?.data || response;
      const list = Array.isArray(data) ? data : ((data as any)?.items || []);
      setItems(list as Software[]);
    } catch (err) {
      setError('Failed to load software list');
      toast.error('Không thể tải danh sách phần mềm');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (payload: SoftwareFormData) => {
    const response = await softwareService.create(payload);
    const newItem = response?.data || response;
    setItems(prev => [newItem as Software, ...prev]);
    toast.success('Tạo phần mềm thành công');
    return newItem;
  };

  const update = async (id: string, payload: Partial<SoftwareFormData>) => {
    const response = await softwareService.update(id, payload);
    const updated = response?.data || response;
    setItems(prev => prev.map(item => (item.id === id ? { ...item, ...(updated as Software) } : item)));
    toast.success('Cập nhật phần mềm thành công');
    return updated;
  };

  const remove = async (id: string) => {
    await softwareService.remove(id);
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success('Đã xóa phần mềm');
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    create,
    update,
    remove,
    refresh: fetchItems,
  };
}
