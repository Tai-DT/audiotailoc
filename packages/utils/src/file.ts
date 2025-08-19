/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Get file name without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(
  originalName: string,
  prefix?: string,
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = getFileExtension(originalName);
  const name = getFileNameWithoutExtension(originalName);
  
  return `${prefix || ''}${name}_${timestamp}_${random}.${extension}`;
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if file is an image
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
}

/**
 * Check if file is a video
 */
export function isVideoFile(filename: string): boolean {
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
  const extension = getFileExtension(filename);
  return videoExtensions.includes(extension);
}

/**
 * Check if file is an audio
 */
export function isAudioFile(filename: string): boolean {
  const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'];
  const extension = getFileExtension(filename);
  return audioExtensions.includes(extension);
}

/**
 * Check if file is a document
 */
export function isDocumentFile(filename: string): boolean {
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
  const extension = getFileExtension(filename);
  return documentExtensions.includes(extension);
}

/**
 * Get MIME type from file extension
 */
export function getMimeType(filename: string): string {
  const extension = getFileExtension(filename);
  
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    
    // Videos
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    wmv: 'video/x-ms-wmv',
    flv: 'video/x-flv',
    webm: 'video/webm',
    mkv: 'video/x-matroska',
    
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    flac: 'audio/flac',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
    wma: 'audio/x-ms-wma',
    
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    rtf: 'application/rtf',
    odt: 'application/vnd.oasis.opendocument.text',
    
    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: any,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedMimeTypes?: string[];
  } = {},
): { isValid: boolean; error?: string } {
  const { maxSize, allowedTypes, allowedMimeTypes } = options;
  
  // Check file size
  if (maxSize && file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(maxSize)}`,
    };
  }
  
  // Check file type by extension
  if (allowedTypes && allowedTypes.length > 0) {
    const extension = getFileExtension(file.originalname);
    if (!allowedTypes.includes(extension)) {
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }
  }
  
  // Check MIME type
  if (allowedMimeTypes && allowedMimeTypes.length > 0) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return {
        isValid: false,
        error: `MIME type not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
      };
    }
  }
  
  return { isValid: true };
}

/**
 * Create file upload response
 */
export function createFileUploadResponse(
  file: any,
  url: string,
): {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  extension: string;
} {
  return {
    url,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    extension: getFileExtension(file.originalname),
  };
}
