/**
 * Date utility functions for dashboard
 */

/**
 * Format date to Vietnamese locale with error handling
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'N/A'
    }
    
    return dateObj.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    console.warn('Error formatting date:', error)
    return 'N/A'
  }
}

/**
 * Format date with time to Vietnamese locale
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return 'N/A'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return 'N/A'
    }
    
    return dateObj.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.warn('Error formatting datetime:', error)
    return 'N/A'
  }
}

/**
 * Format relative time (e.g., "2 giờ trước")
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return 'N/A'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return 'N/A'
    }
    
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Vừa xong'
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays} ngày trước`
    }
    
    return formatDate(dateObj)
  } catch (error) {
    console.warn('Error formatting relative time:', error)
    return 'N/A'
  }
}

/**
 * Check if date is valid
 */
export function isValidDate(date: string | Date | null | undefined): boolean {
  if (!date) return false
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return !isNaN(dateObj.getTime())
  } catch {
    return false
  }
}




