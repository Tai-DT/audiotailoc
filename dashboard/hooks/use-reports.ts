"use client"

import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

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
      
      // Mock data - replace with actual API
      const mockReports: Report[] = [
        {
          id: '1',
          name: 'Báo cáo doanh số tháng 9/2025',
          type: 'sales',
          format: 'pdf',
          period: 'Tháng 9/2025',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Báo cáo tồn kho Q3/2025',
          type: 'inventory',
          format: 'excel',
          period: 'Q3/2025',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]
      
      setReports(mockReports)
    } catch (err) {
      console.error('Error fetching reports:', err)
      toast.error('Không thể tải danh sách báo cáo')
    } finally {
      setLoading(false)
    }
  }, [])

  // Generate report
  const generateReport = useCallback(async (options: {
    type: string
    period: string
    format: string
  }) => {
    try {
      setLoading(true)
      
      // Mock API call
      const newReport: Report = {
        id: Date.now().toString(),
        name: `Báo cáo ${options.type} - ${options.period}`,
        type: options.type,
        format: options.format as Report['format'],
        period: options.period,
        createdAt: new Date().toISOString()
      }
      
      setReports(prev => [newReport, ...prev])
      toast.success('Báo cáo đã được tạo thành công')
      
      // Trigger download
      setTimeout(() => {
        downloadReport(newReport.id)
      }, 1000)
    } catch (err) {
      toast.error('Không thể tạo báo cáo')
      console.error('Error generating report:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Download report
  const downloadReport = useCallback(async (reportId: string) => {
    try {
      const report = reports.find(r => r.id === reportId)
      if (!report) return
      
      // Mock download
      const link = document.createElement('a')
      link.href = '#' // Replace with actual download URL
      link.download = `report-${reportId}.${report.format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Đã bắt đầu tải xuống báo cáo')
    } catch (err) {
      toast.error('Không thể tải xuống báo cáo')
      console.error('Error downloading report:', err)
    }
  }, [reports])

  // Schedule report
  const scheduleReport = useCallback(async (options: {
    type: string
    schedule: string
    recipients: string[]
  }) => {
    try {
      // Mock API call
      toast.success('Đã thiết lập báo cáo định kỳ')
    } catch (err) {
      toast.error('Không thể thiết lập báo cáo định kỳ')
      console.error('Error scheduling report:', err)
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
