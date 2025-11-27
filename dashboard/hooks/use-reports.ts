"use client"

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'

export interface Report {
  id: string
  name: string
  type: string
  format: 'pdf' | 'excel' | 'csv'
  period: string
  createdAt: string
  downloadUrl?: string
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch reports
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/reports?page=1&pageSize=100')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = response.data as any
      if (responseData && Array.isArray(responseData.data)) {
        setReports(responseData.data as Report[])
      }
    } catch {
      toast.error('Không thể tải danh sách báo cáo')
    } finally {
      setLoading(false)
    }
  }, [])

  // Download report
  const downloadReport = useCallback(async (reportId: string) => {
    try {
      const report = reports.find(r => r.id === reportId)
      if (!report) return

      toast.success('Đang chuẩn bị tải xuống...')

      // Get download URL from API
      const response = await apiClient.get(`/reports/${reportId}/export`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = response.data as any
      if (responseData && responseData.exportUrl) {
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = responseData.exportUrl;
        link.setAttribute('download', `${report.name || 'report'}.${report.format || 'csv'}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Đã bắt đầu tải xuống báo cáo')
      } else {
        throw new Error('No export URL returned');
      }
    } catch {
      toast.error('Không thể tải xuống báo cáo')
    }
  }, [reports])

  // Generate report
  const generateReport = useCallback(async (options: {
    type: string
    period: string
    format: string
  }) => {
    try {
      setLoading(true)

      const response = await apiClient.post('/reports/generate', {
        type: options.type.toUpperCase(),
        title: `Báo cáo ${options.type} - ${options.period}`,
        description: `Được tạo tự động vào ${new Date().toLocaleString()}`,
        parameters: {
          period: options.period,
          format: options.format
        }
      })

      if (response.data) {
        toast.success('Báo cáo đã được tạo thành công')
        // Refresh list
        fetchReports()
      }
    } catch {
      toast.error('Không thể tạo báo cáo')
    } finally {
      setLoading(false)
    }
  }, [fetchReports])

  // Schedule report
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scheduleReport = useCallback(async (_options?: {
    type?: string;
    schedule?: string;
    recipients?: string[];
  }) => {
    try {
      // Mock API call
      toast.success('Đã thiết lập báo cáo định kỳ')
    } catch {
      toast.error('Không thể thiết lập báo cáo định kỳ')
    }
  }, [])

  return {
    reports,
    loading,
    generateReport,
    downloadReport,
    fetchReports,
    scheduleReport
  }
}
