"use client"

import { useState, useCallback } from 'react'
import { apiClient, API_BASE_URL } from '@/lib/api-client'
import { toast } from 'sonner'

export interface Report {
  id: string
  name: string
  type: 'SALES' | 'INVENTORY' | 'CUSTOMERS' | 'PRODUCTS' | 'SERVICES' | 'CUSTOM'
  format: 'pdf' | 'excel' | 'csv'
  period: string
  createdAt: string
  downloadUrl?: string
}

interface ReportsListResponse {
  data: Array<{
    id: string
    type: string
    title: string
    description?: string | null
    parameters?: string | null
    generatedAt: string
    createdAt: string
    updatedAt: string
  }>
  total: number
  page: number
  pageSize: number
  totalPages: number
}

function safeJsonParse<T>(raw: string | null | undefined): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function getExportPath(type: Report['type'], format: Report['format']): string | null {
  switch (type) {
    case 'SALES':
      return `/reports/export/sales/${format}`
    case 'INVENTORY':
      return `/reports/export/inventory/${format}`
    case 'CUSTOMERS':
      return `/reports/export/customers/${format}`
    default:
      return null
  }
}

function getFilenameFromContentDisposition(value: string | null): string | null {
  if (!value) return null

  // Try RFC 5987: filename*=UTF-8''...
  const starMatch = value.match(/filename\*=UTF-8''([^;]+)/i)
  if (starMatch?.[1]) {
    try {
      return decodeURIComponent(starMatch[1].trim().replace(/^"|"$/g, ''))
    } catch {
      // ignore
    }
  }

  // Fallback: filename="..." or filename=...
  const match = value.match(/filename\s*=\s*(?:"([^"]+)"|([^;]+))/i)
  const raw = (match?.[1] || match?.[2] || '').trim()
  if (!raw) return null
  return raw.replace(/^"|"$/g, '')
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch reports
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<ReportsListResponse>('/reports', {
        params: { page: 1, pageSize: 20 },
      })

      const mapped: Report[] = (response.data?.data || []).map((r) => {
        const params = safeJsonParse<{ format?: Report['format']; period?: string }>(r.parameters)
        const type = (String(r.type || 'CUSTOM').toUpperCase() as Report['type'])
        const format = params?.format || 'pdf'
        const period = params?.period || 'N/A'

        return {
          id: r.id,
          name: r.title,
          type,
          format,
          period,
          createdAt: r.generatedAt || r.createdAt,
        }
      })

      setReports(mapped)
    } catch (err) {
      toast.error('Không thể tải danh sách báo cáo')
    } finally {
      setLoading(false)
    }
  }, [])

  const downloadReport = useCallback(async (report: Report, options?: { startDate?: string; endDate?: string }) => {
    try {
      const exportPath = getExportPath(report.type, report.format)
      if (!exportPath) {
        toast.error('Loại báo cáo này chưa hỗ trợ tải xuống')
        return
      }

      const url = new URL(`${API_BASE_URL}${exportPath}`)
      if (report.type === 'SALES') {
        if (options?.startDate) url.searchParams.set('startDate', options.startDate)
        if (options?.endDate) url.searchParams.set('endDate', options.endDate)
      }

      const headers: Record<string, string> = {}
      const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('token') || '') : ''
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers,
      })

      if (!res.ok) {
        toast.error('Không thể tải xuống báo cáo')
        return
      }

      const blob = await res.blob()
      const downloadUrl = URL.createObjectURL(blob)

      const filenameFromHeader = getFilenameFromContentDisposition(res.headers.get('content-disposition'))
      const fallbackName = `${report.name}.${report.format === 'excel' ? 'xlsx' : report.format}`
      const filename = filenameFromHeader || fallbackName

      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(downloadUrl)
      toast.success('Đã bắt đầu tải xuống báo cáo')
    } catch (err) {
      toast.error('Không thể tải xuống báo cáo')
    }
  }, [])

  // Generate report
  const generateReport = useCallback(async (options: {
    type: Report['type']
    period: string
    format: Report['format']
    startDate?: string
    endDate?: string
  }) => {
    try {
      setLoading(true)

      const title = `Báo cáo ${options.type} - ${options.period}`
      await apiClient.post('/reports', {
        type: options.type,
        title,
        parameters: {
          period: options.period,
          format: options.format,
          startDate: options.startDate,
          endDate: options.endDate,
        },
        startDate: options.startDate,
        endDate: options.endDate,
      })

      toast.success('Báo cáo đã được tạo thành công')
      await fetchReports()

      await downloadReport({
        id: 'latest',
        name: title,
        type: options.type,
        format: options.format,
        period: options.period,
        createdAt: new Date().toISOString(),
      }, { startDate: options.startDate, endDate: options.endDate })
    } catch (err) {
      toast.error('Không thể tạo báo cáo')
    } finally {
      setLoading(false)
    }
  }, [downloadReport, fetchReports])

  // Schedule report
   
  const scheduleReport = useCallback(async (_options?: {
    type?: string;
    schedule?: string;
    recipients?: string[];
  }) => {
    try {
      // Mock API call
      toast.success('Đã thiết lập báo cáo định kỳ')
    } catch (err) {
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
