import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Software } from '@/lib/types';

export function useMySoftwareDownloads() {
  const [data, setData] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const response = await apiClient.get('/software/my-downloads');
        const payload = response?.data || response;
        const list = Array.isArray(payload) ? payload : (payload?.data || payload?.items || []);
        if (mounted) setData(list as Software[]);
      } catch {
        if (mounted) setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading };
}

export async function requestSoftwareDownload(id: string) {
  const response = await apiClient.get(`/software/${id}/download`);
  const payload = response?.data || response;
  return payload?.url || payload?.data?.url;
}
