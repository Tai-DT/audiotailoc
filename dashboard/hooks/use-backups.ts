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
  createdAt: string
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
      const response = await apiClient.get('/api/v1/backup/list')
      setBackups(response.data?.backups || [])
    } catch (err) {
      const errorMessage = 'Không thể tải danh sách backup'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error fetching backups:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch backup status
  const fetchStatus = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/v1/backup/status')
      setStatus(response.data?.status || null)
    } catch (err) {
      console.error('Error fetching backup status:', err)
    }
  }, [])

  // Create new backup
  const createBackup = useCallback(async (type: 'full' | 'incremental' | 'files') => {
    try {
      setLoading(true)
      let endpoint = ''
      
      switch (type) {
        case 'full':
          endpoint = '/api/v1/backup/full'
          break
        case 'incremental':
          endpoint = '/api/v1/backup/incremental'
          break
        case 'files':
          endpoint = '/api/v1/backup/files'
          break
      }

      await apiClient.post(endpoint)
      toast.success(`Đã bắt đầu backup ${type === 'full' ? 'toàn bộ' : type === 'incremental' ? 'tăng dần' : 'files'}`)
      
      // Refresh data
      await fetchBackups()
      await fetchStatus()
    } catch (err) {
      toast.error('Không thể tạo backup')
      console.error('Error creating backup:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchBackups, fetchStatus])

  // Restore backup
  const restoreBackup = useCallback(async (backupId: string) => {
    try {
      setLoading(true)
      await apiClient.post(`/api/v1/backup/restore/${backupId}`)
      toast.success('Đã bắt đầu quá trình khôi phục backup')
      
      // Refresh status
      await fetchStatus()
    } catch (err) {
      toast.error('Không thể khôi phục backup')
      console.error('Error restoring backup:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchStatus])

  // Delete backup
  const deleteBackup = useCallback(async (backupId: string) => {
    try {
      setLoading(true)
      await apiClient.delete(`/api/v1/backup/${backupId}`)
      toast.success('Đã xóa backup thành công')
      
      // Refresh data
      await fetchBackups()
      await fetchStatus()
    } catch (err) {
      toast.error('Không thể xóa backup')
      console.error('Error deleting backup:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchBackups, fetchStatus])

  // Download backup
  const downloadBackup = useCallback(async (backupId: string) => {
    try {
      setLoading(true)
      const response = await apiClient.get(`/api/v1/backup/${backupId}/download`)
      
      // Create download link
      if (response.data?.downloadUrl) {
        const link = document.createElement('a')
        link.href = response.data.downloadUrl
        link.download = `backup-${backupId}.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success('Đã bắt đầu tải xuống backup')
      }
    } catch (err) {
      toast.error('Không thể tải xuống backup')
      console.error('Error downloading backup:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Point-in-time restore
  const restorePointInTime = useCallback(async (timestamp: string) => {
    try {
      setLoading(true)
      await apiClient.post('/api/v1/backup/restore/point-in-time', { timestamp })
      toast.success('Đã bắt đầu khôi phục theo thời điểm')
      
      await fetchStatus()
    } catch (err) {
      toast.error('Không thể khôi phục theo thời điểm')
      console.error('Error with point-in-time restore:', err)
      throw err
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
      await apiClient.post('/api/v1/backup/cleanup', options)
      toast.success('Đã dọn dẹp backup cũ thành công')
      
      await fetchBackups()
      await fetchStatus()
    } catch (err) {
      toast.error('Không thể dọn dẹp backup cũ')
      console.error('Error cleaning up backups:', err)
      throw err
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
