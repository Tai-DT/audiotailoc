import { useState, useCallback } from 'react';
import { fileUploadService, UploadResult, UploadProgress, FileUploadOptions } from '../lib/file-upload.service';

export interface FileUploadState {
  uploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
  result: UploadResult | null;
}

export interface UseFileUploadReturn {
  uploadFile: (file: File, options?: FileUploadOptions) => Promise<UploadResult>;
  uploadMultipleFiles: (files: File[], options?: FileUploadOptions) => Promise<UploadResult[]>;
  uploadUserAvatar: (avatar: File, options?: FileUploadOptions) => Promise<UploadResult>;
  uploadProductImage: (image: File, productId: string, options?: FileUploadOptions) => Promise<UploadResult>;
  uploadBannerImage: (banner: File, options?: FileUploadOptions) => Promise<UploadResult>;
  state: FileUploadState;
  reset: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [state, setState] = useState<FileUploadState>({
    uploading: false,
    progress: null,
    error: null,
    result: null,
  });

  const reset = useCallback(() => {
    setState({
      uploading: false,
      progress: null,
      error: null,
      result: null,
    });
  }, []);

  const handleProgress = useCallback((progress: UploadProgress) => {
    setState(prev => ({ ...prev, progress }));
  }, []);

  const handleError = useCallback((error: Error) => {
    setState(prev => ({
      ...prev,
      uploading: false,
      error: error.message,
      progress: null,
    }));
  }, []);

  const handleSuccess = useCallback((result: UploadResult) => {
    setState(prev => ({
      ...prev,
      uploading: false,
      error: null,
      result,
      progress: null,
    }));
  }, []);

  const uploadFile = useCallback(async (
    file: File,
    options: FileUploadOptions = {}
  ): Promise<UploadResult> => {
    try {
      setState(prev => ({ ...prev, uploading: true, error: null }));

      const result = await fileUploadService.uploadFile(file, '/files/upload', {
        ...options,
        onProgress: handleProgress,
      });

      handleSuccess(result);
      return result;
    } catch (error) {
      handleError(error as Error);
      throw error;
    }
  }, [handleProgress, handleError, handleSuccess]);

  const uploadMultipleFiles = useCallback(async (
    files: File[],
    options: FileUploadOptions = {}
  ): Promise<UploadResult[]> => {
    try {
      setState(prev => ({ ...prev, uploading: true, error: null }));

      const result = await fileUploadService.uploadMultipleFiles(files, '/files/upload-multiple', options);

      setState(prev => ({
        ...prev,
        uploading: false,
        error: null,
        result: result[0] || null, // Set first result for backward compatibility
        progress: null,
      }));

      return result;
    } catch (error) {
      handleError(error as Error);
      throw error;
    }
  }, [handleError]);

  const uploadUserAvatar = useCallback(async (
    avatar: File,
    options: FileUploadOptions = {}
  ): Promise<UploadResult> => {
    try {
      setState(prev => ({ ...prev, uploading: true, error: null }));

      const result = await fileUploadService.uploadUserAvatar(avatar, {
        ...options,
        onProgress: handleProgress,
      });

      handleSuccess(result);
      return result;
    } catch (error) {
      handleError(error as Error);
      throw error;
    }
  }, [handleProgress, handleError, handleSuccess]);

  const uploadProductImage = useCallback(async (
    image: File,
    productId: string,
    options: FileUploadOptions = {}
  ): Promise<UploadResult> => {
    try {
      setState(prev => ({ ...prev, uploading: true, error: null }));

      const result = await fileUploadService.uploadProductImage(image, productId, {
        ...options,
        onProgress: handleProgress,
      });

      handleSuccess(result);
      return result;
    } catch (error) {
      handleError(error as Error);
      throw error;
    }
  }, [handleProgress, handleError, handleSuccess]);

  const uploadBannerImage = useCallback(async (
    banner: File,
    options: FileUploadOptions = {}
  ): Promise<UploadResult> => {
    try {
      setState(prev => ({ ...prev, uploading: true, error: null }));

      const result = await fileUploadService.uploadBannerImage(banner, {
        ...options,
        onProgress: handleProgress,
      });

      handleSuccess(result);
      return result;
    } catch (error) {
      handleError(error as Error);
      throw error;
    }
  }, [handleProgress, handleError, handleSuccess]);

  return {
    uploadFile,
    uploadMultipleFiles,
    uploadUserAvatar,
    uploadProductImage,
    uploadBannerImage,
    state,
    reset,
  };
}

// Hook for drag and drop functionality
export function useDragAndDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  }, []);

  const resetFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    isDragging,
    files,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    resetFiles,
  };
}

// Hook for image preview
export function useImagePreview() {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const addPreview = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrls(prev => [...prev, url]);
    return url;
  }, []);

  const removePreview = useCallback((url: string) => {
    URL.revokeObjectURL(url);
    setPreviewUrls(prev => prev.filter(u => u !== url));
  }, []);

  const clearPreviews = useCallback(() => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  }, [previewUrls]);

  return {
    previewUrls,
    addPreview,
    removePreview,
    clearPreviews,
  };
}