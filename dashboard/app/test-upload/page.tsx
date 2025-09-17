'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CloudinaryService } from '@/lib/cloudinary';

interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

export default function TestUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await CloudinaryService.uploadFile(selectedFile, 'test');
      setUploadResult(result);
      console.log('Upload result:', result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Cloudinary Upload</h1>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Chọn hình ảnh:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {selectedFile && (
          <div className="text-sm text-gray-600">
            File: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {uploading ? 'Đang upload...' : 'Upload'}
        </button>

        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md">
            Lỗi: {error}
          </div>
        )}

        {uploadResult && (
          <div className="text-green-600 text-sm p-3 bg-green-50 rounded-md">
            <p className="font-semibold">Upload thành công!</p>
            <p>URL: {uploadResult.secure_url}</p>
            <p>Public ID: {uploadResult.public_id}</p>
            <p>Kích thước: {uploadResult.width}x{uploadResult.height}</p>

            {uploadResult.secure_url && (
              <div className="mt-3">
                <Image
                  src={uploadResult.secure_url}
                  alt="Uploaded image"
                  width={uploadResult.width}
                  height={uploadResult.height}
                  className="max-w-full h-auto border rounded"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}