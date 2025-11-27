"use client"

import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

export interface Backup {
  id: string
  name: string
  type: 'full' | 'incremental' | 'files'
  size: number
  status: 'completed' | 'failed' | 'in_progress'
  timestamp: string
  completedAt?: string
  errorMessage?: string
}

export interface BackupStatus {
  totalBackups: number
  totalSize: number
  failedBackups: number
  isBackupInProgress: boolean
  nextScheduledBackup: string | null
}

export function useBackups() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [status, setStatus] = useState<BackupStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all backups
  const fetchBackups = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/backup/list')
      const responseData = response.data as { backups?: Backup[] }
      setBackups(responseData?.backups || [])
    } catch {
      const errorMessage = 'Không thể tải danh sách backup'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch backup status
  const fetchStatus = useCallback(async () => {
    try {
      const response = await apiClient.get('/backup/status')
      const responseData = response.data as { status?: BackupStatus }
      setStatus(responseData?.status || null)
    } catch {
      // Silent error
    }
  }, [])

  // Create new backup
  const createBackup = useCallback(async (type: 'full' | 'incremental' | 'files') => {
    try {
      setLoading(true)
      let endpoint = ''

      switch (type) {
        case 'full':
          endpoint = '/backup/full'
          break
        case 'incremental':
          endpoint = '/backup/incremental'
          break
        case 'files':
          endpoint = '/backup/files'
          break
      }

      await apiClient.post(endpoint)
      toast.success(`Đã bắt đầu backup ${type === 'full' ? 'toàn bộ' : type === 'incremental' ? 'tăng dần' : 'files'}`)

      // Refresh data
      await fetchBackups()
      await fetchStatus()
    } catch {
      toast.error('Không thể tạo backup')
    } finally {
      setLoading(false)
    }
  }, [fetchBackups, fetchStatus])

  // Restore backup
  const restoreBackup = useCallback(async (backupId: string) => {
    try {
      setLoading(true)
      await apiClient.post(`/backup/restore/${backupId}`)
      toast.success('Đã bắt đầu quá trình khôi phục backup')

      // Refresh status
      await fetchStatus()
    } catch {
      toast.error('Không thể khôi phục backup')
    } finally {
      setLoading(false)
    }
  }, [fetchStatus])

  // Delete backup
  const deleteBackup = useCallback(async (backupId: string) => {
    try {
      setLoading(true)
      await apiClient.delete(`/backup/${backupId}`)
      toast.success('Đã xóa backup thành công')

      // Refresh data
      await fetchBackups()
      await fetchStatus()
    } catch {
      toast.error('Không thể xóa backup')
    } finally {
      setLoading(false)
    }
  }, [fetchBackups, fetchStatus])

  // Download backup
  const downloadBackup = useCallback(async (backupId: string) => {
    try {
      setLoading(true)
      const response = await apiClient.get(`/backup/${backupId}/download`)
      const responseData = response.data as { downloadUrl?: string }

      // Create download link
      if (responseData?.downloadUrl) {
        const link = document.createElement('a')
        link.href = responseData.downloadUrl
        link.download = `backup-${backupId}.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success('Đã bắt đầu tải xuống backup')
      }
    } catch {
      toast.error('Không thể tải xuống backup')
    } finally {
      setLoading(false)
    }
  }, [])

  // Point-in-time restore
  const restorePointInTime = useCallback(async (timestamp: string) => {
    try {
      setLoading(true)
      await apiClient.post('/backup/restore/point-in-time', { timestamp })
      toast.success('Đã bắt đầu khôi phục theo thời điểm')

      await fetchStatus()
    } catch {
      toast.error('Không thể khôi phục theo thời điểm')
    } finally {
      setLoading(false)
    }
  }, [fetchStatus])

  // Cleanup old backups
  const cleanupBackups = useCallback(async (options?: {
    olderThanDays?: number
    keepMinimum?: number
  }) => {
    try {
      setLoading(true)
      await apiClient.post('/backup/cleanup', options)
      toast.success('Đã dọn dẹp backup cũ thành công')

      await fetchBackups()
      await fetchStatus()
    } catch {
      toast.error('Không thể dọc dẹp backup cũ')
    } finally {
      setLoading(false)
    }
  }, [fetchBackups, fetchStatus])

  return {
    // State
    backups,
    status,
    loading,
    error,

    // Actions
    fetchBackups,
    fetchStatus,
    createBackup,
    restoreBackup,
    deleteBackup,
    downloadBackup,
    restorePointInTime,
    cleanupBackups,

    // Utilities
    refresh: fetchBackups
  }
}
