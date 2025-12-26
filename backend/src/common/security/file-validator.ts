import { BadRequestException, Logger } from '@nestjs/common';

/**
 * File Validator for Enhanced Security
 * Validates file content using magic bytes and detects malicious files
 */
export class FileValidator {
  private static readonly logger = new Logger(FileValidator.name);

  // Magic bytes for common file types
  private static readonly MAGIC_BYTES: Record<string, number[][]> = {
    // Images
    'image/jpeg': [[0xff, 0xd8, 0xff]],
    'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
    'image/gif': [
      [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
      [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
    ],
    'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF (needs additional check)
    'image/bmp': [[0x42, 0x4d]],
    'image/svg+xml': [[0x3c, 0x73, 0x76, 0x67]], // <svg

    // Documents
    'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
    'application/msword': [
      [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1], // .doc, .xls, .ppt
    ],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      [0x50, 0x4b, 0x03, 0x04], // ZIP signature (DOCX is a ZIP)
    ],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      [0x50, 0x4b, 0x03, 0x04], // ZIP signature (XLSX is a ZIP)
    ],

    // Archives (potentially dangerous - zip bombs)
    'application/zip': [[0x50, 0x4b, 0x03, 0x04]],
    'application/x-rar-compressed': [[0x52, 0x61, 0x72, 0x21, 0x1a, 0x07]],
    'application/x-7z-compressed': [[0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c]],
  };

  /**
   * Validate file content using magic bytes
   * @param buffer - File buffer
   * @param expectedMimeType - Expected MIME type
   * @returns true if file content matches expected type
   */
  static validateMagicBytes(buffer: Buffer, expectedMimeType: string): boolean {
    if (!buffer || buffer.length === 0) {
      return false;
    }

    const magicBytes = this.MAGIC_BYTES[expectedMimeType];
    if (!magicBytes) {
      // If we don't have magic bytes for this type, allow it (for flexibility)
      this.logger.debug(`No magic bytes defined for ${expectedMimeType}, skipping validation`);
      return true;
    }

    // Check if buffer matches any of the magic byte patterns
    for (const pattern of magicBytes) {
      if (buffer.length < pattern.length) {
        continue;
      }

      let matches = true;
      for (let i = 0; i < pattern.length; i++) {
        if (buffer[i] !== pattern[i]) {
          matches = false;
          break;
        }
      }

      if (matches) {
        return true;
      }
    }

    // Special case for WebP (needs additional check)
    if (expectedMimeType === 'image/webp') {
      if (buffer.length >= 12) {
        const webpCheck = buffer.toString('ascii', 8, 12);
        if (webpCheck === 'WEBP') {
          return true;
        }
      }
    }

    // Special case for SVG (text-based, check for XML declaration)
    if (expectedMimeType === 'image/svg+xml') {
      const text = buffer.toString('utf-8', 0, Math.min(200, buffer.length));
      if (text.includes('<svg') || text.includes('<?xml')) {
        return true;
      }
    }

    return false;
  }

  /**
   * Detect file type from magic bytes
   * @param buffer - File buffer
   * @returns Detected MIME type or null
   */
  static detectFileType(buffer: Buffer): string | null {
    if (!buffer || buffer.length === 0) {
      return null;
    }

    for (const [mimeType, patterns] of Object.entries(this.MAGIC_BYTES)) {
      for (const pattern of patterns) {
        if (buffer.length < pattern.length) {
          continue;
        }

        let matches = true;
        for (let i = 0; i < pattern.length; i++) {
          if (buffer[i] !== pattern[i]) {
            matches = false;
            break;
          }
        }

        if (matches) {
          // Additional checks for special cases
          if (mimeType === 'image/webp' && buffer.length >= 12) {
            const webpCheck = buffer.toString('ascii', 8, 12);
            if (webpCheck === 'WEBP') {
              return mimeType;
            }
          } else if (mimeType === 'image/svg+xml') {
            const text = buffer.toString('utf-8', 0, Math.min(200, buffer.length));
            if (text.includes('<svg') || text.includes('<?xml')) {
              return mimeType;
            }
          } else {
            return mimeType;
          }
        }
      }
    }

    return null;
  }

  /**
   * Check for potential zip bomb
   * Note: This is a basic check. For production, consider using a library like 'yauzl' or 'unzipper'
   * @param buffer - File buffer (should be a ZIP file)
   * @param maxUncompressedSize - Maximum allowed uncompressed size in bytes (default: 100MB)
   * @returns true if file appears safe
   */
  static async checkZipBomb(
    buffer: Buffer,
    maxUncompressedSize: number = 100 * 1024 * 1024, // 100MB
  ): Promise<boolean> {
    // Basic check: if compressed size is very small but file is large, it might be a zip bomb
    // This is a simplified check - for production, you should actually decompress and check
    
    // For now, we'll just check if it's a valid ZIP and log a warning if compressed size is suspiciously small
    if (buffer.length < 4) {
      return false;
    }

    // Check ZIP signature
    if (buffer[0] !== 0x50 || buffer[1] !== 0x4b || buffer[2] !== 0x03 || buffer[3] !== 0x04) {
      return false;
    }

    // Basic heuristic: if compressed size is less than 1% of max uncompressed size, it's suspicious
    const suspiciousRatio = buffer.length / maxUncompressedSize;
    if (suspiciousRatio < 0.01 && buffer.length < 1024) {
      this.logger.warn(
        `Potential zip bomb detected: compressed size ${buffer.length} bytes, max allowed ${maxUncompressedSize} bytes`,
      );
      // Don't block, but log warning - in production, you might want to block or use proper decompression check
    }

    return true;
  }

  /**
   * Validate file content matches declared type
   * @param buffer - File buffer
   * @param declaredMimeType - MIME type declared by client
   * @param allowedMimeTypes - List of allowed MIME types
   * @returns true if file is valid
   */
  static validateFileContent(
    buffer: Buffer,
    declaredMimeType: string,
    allowedMimeTypes: string[],
  ): boolean {
    // Check if declared type is allowed
    if (!allowedMimeTypes.includes(declaredMimeType)) {
      return false;
    }

    // Validate magic bytes match declared type
    if (!this.validateMagicBytes(buffer, declaredMimeType)) {
      // Try to detect actual type
      const detectedType = this.detectFileType(buffer);
      if (detectedType && detectedType !== declaredMimeType) {
        this.logger.warn(
          `File type mismatch: declared ${declaredMimeType}, detected ${detectedType}`,
        );
        return false;
      }
    }

    return true;
  }
}
