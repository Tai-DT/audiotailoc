export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width?: number
  height?: number
  format?: string
  bytes?: number
  duration?: number
  [key: string]: unknown
}

export interface UploadEventData {
  event_category: string
  event_label: string
  value?: number | string
  custom_parameters?: Record<string, unknown>
}

export class UploadMonitor {
  private static instance: UploadMonitor
  private isProduction = process.env.NODE_ENV === 'production'

  private constructor() {}

  static getInstance(): UploadMonitor {
    if (!UploadMonitor.instance) {
      UploadMonitor.instance = new UploadMonitor()
    }
    return UploadMonitor.instance
  }

  // Track upload events
  trackEvent(eventName: string, data: UploadEventData): void {
    // Console logging for development
    if (!this.isProduction) {
      console.log(`📊 Upload Event: ${eventName}`, data)
      return
    }

    // Google Analytics tracking for production
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, data)
    }

    // Additional monitoring services can be added here
    // Example: Sentry, Mixpanel, etc.
  }

  // Track upload attempt
  trackUploadAttempt(file: File): void {
    this.trackEvent('file_upload_attempt', {
      event_category: 'upload',
      event_label: file.type,
      value: Math.round(file.size / 1024), // size in KB
      custom_parameters: {
        file_name: file.name,
        file_size_bytes: file.size
      }
    })
  }

  // Track upload success
  trackUploadSuccess(file: File, result: CloudinaryUploadResult): void {
    this.trackEvent('file_upload_success', {
      event_category: 'upload',
      event_label: file.type,
      value: Math.round(file.size / 1024), // size in KB
      custom_parameters: {
        file_name: file.name,
        upload_duration: result?.duration || 0,
        cloudinary_url: result?.secure_url
      }
    })
  }

  // Track upload error
  trackUploadError(errorType: string, error: string | Error, file?: File): void {
    const errorMessage = error instanceof Error ? error.message : error

    this.trackEvent('file_upload_error', {
      event_category: 'upload',
      event_label: errorType,
      value: errorMessage,
      custom_parameters: {
        file_name: file?.name,
        file_size: file?.size,
        error_details: errorMessage
      }
    })
  }

  // Track validation errors
  trackValidationError(errorType: 'file_too_large' | 'invalid_file_type', file: File): void {
    this.trackEvent('file_upload_validation_error', {
      event_category: 'upload',
      event_label: errorType,
      value: errorType === 'file_too_large' ? Math.round(file.size / 1024 / 1024) : file.type,
      custom_parameters: {
        file_name: file.name,
        file_size_bytes: file.size
      }
    })
  }
}

// Export singleton instance
export const uploadMonitor = UploadMonitor.getInstance()

// Utility functions for easy usage
export const trackUploadAttempt = (file: File) => uploadMonitor.trackUploadAttempt(file)
export const trackUploadSuccess = (file: File, result: CloudinaryUploadResult) => uploadMonitor.trackUploadSuccess(file, result)
export const trackUploadError = (errorType: string, error: string | Error, file?: File) =>
  uploadMonitor.trackUploadError(errorType, error, file)
export const trackValidationError = (errorType: 'file_too_large' | 'invalid_file_type', file: File) =>
  uploadMonitor.trackValidationError(errorType, file)
