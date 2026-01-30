"use client"

import { useState, useCallback } from 'react'
import { apiClient, API_BASE_URL } from '@/lib/api-client'
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

type BackupMetadataDto = {
  id: string
  type: 'full' | 'incremental' | 'files'
  timestamp: string
  size: number
  status: 'completed' | 'failed' | 'in_progress'
  path: string
  checksum: string
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

function toUiBackup(dto: BackupMetadataDto): Backup {
  return {
    id: dto.id,
    name: dto.id,
    type: dto.type,
    size: dto.size,
    status: dto.status,
    createdAt: dto.timestamp,
  }
}

function normalizeStatus(raw: any): BackupStatus {
  return {
    totalBackups: Number(raw?.totalBackups ?? 0),
    totalSize: Number(raw?.totalSize ?? 0),
    failedBackups: Number(raw?.failedBackups ?? 0),
    isBackupInProgress: Boolean(raw?.isBackupInProgress ?? false),
    nextScheduledBackup: raw?.nextScheduledBackup ? String(raw.nextScheduledBackup) : null,
  }
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
      const responseData = response.data as { backups?: BackupMetadataDto[] }
      setBackups((responseData?.backups || []).map(toUiBackup))
    } catch (err) {
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
      const responseData = response.data as { status?: any }
      setStatus(responseData?.status ? normalizeStatus(responseData.status) : null)
    } catch (err) {
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
    } catch (err) {
      toast.error('Không thể tạo backup')
      throw err
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
    } catch (err) {
      toast.error('Không thể khôi phục backup')
      throw err
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
    } catch (err) {
      toast.error('Không thể xóa backup')
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchBackups, fetchStatus])

  // Download backup
  const downloadBackup = useCallback(async (backupId: string) => {
    try {
      setLoading(true)
      const url = new URL(`${API_BASE_URL}/backup/${backupId}/download`)

      const headers: Record<string, string> = {}
      const token = typeof window !== 'undefined'
        ? (localStorage.getItem('accessToken') || localStorage.getItem('token') || '')
        : ''
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers,
      })

      if (!res.ok) {
        toast.error('Không thể tải xuống backup')
        return
      }

      const blob = await res.blob()
      const downloadUrl = URL.createObjectURL(blob)

      const filenameFromHeader = getFilenameFromContentDisposition(res.headers.get('content-disposition'))
      const filename = filenameFromHeader || `backup-${backupId}.backup`

      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(downloadUrl)
      toast.success('Đã bắt đầu tải xuống backup')
    } catch (err) {
      toast.error('Không thể tải xuống backup')
      throw err
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
    } catch (err) {
      toast.error('Không thể khôi phục theo thời điểm')
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
      await apiClient.post('/backup/cleanup', options)
      toast.success('Đã dọn dẹp backup cũ thành công')
      
      await fetchBackups()
      await fetchStatus()
    } catch (err) {
      toast.error('Không thể dọc dẹp backup cũ')
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
