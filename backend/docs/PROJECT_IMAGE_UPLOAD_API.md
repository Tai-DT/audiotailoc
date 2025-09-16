# Project Image Upload API Documentation

## Overview
All project images are stored on Cloudinary for optimal performance and CDN delivery. The API provides multiple endpoints for uploading and managing project images.

## Base URL
```
http://localhost:3010/api/v1/projects
```

## Authentication
All upload endpoints require admin authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Upload Thumbnail Image
Upload a thumbnail image for a project.

**Endpoint:** `POST /projects/:id/upload-thumbnail`  
**Content-Type:** `multipart/form-data`  
**Max File Size:** 5MB  
**Allowed Formats:** jpg, jpeg, png, gif, webp  

**Request:**
```bash
curl -X POST http://localhost:3010/api/v1/projects/{projectId}/upload-thumbnail \
  -H "Authorization: Bearer {token}" \
  -F "file=@/path/to/thumbnail.jpg"
```

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/dib7tbv7w/image/upload/v.../project-thumbnail-....jpg",
  "publicId": "projects/thumbnails/project-thumbnail-...",
  "project": { /* updated project object */ }
}
```

**Image Transformations:**
- Automatically resized to 800x600px
- Crop mode: fill with auto gravity
- Quality: auto:good

### 2. Upload Cover Image
Upload a cover/banner image for a project.

**Endpoint:** `POST /projects/:id/upload-cover`  
**Content-Type:** `multipart/form-data`  
**Max File Size:** 10MB  
**Allowed Formats:** jpg, jpeg, png, gif, webp  

**Request:**
```bash
curl -X POST http://localhost:3010/api/v1/projects/{projectId}/upload-cover \
  -H "Authorization: Bearer {token}" \
  -F "file=@/path/to/cover.jpg"
```

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/dib7tbv7w/image/upload/v.../project-cover-....jpg",
  "publicId": "projects/covers/project-cover-...",
  "project": { /* updated project object */ }
}
```

**Image Transformations:**
- Automatically resized to 1920x800px
- Crop mode: fill with auto gravity
- Quality: auto:good

### 3. Upload Gallery Images
Upload multiple gallery images for a project (adds to existing gallery).

**Endpoint:** `POST /projects/:id/upload-gallery`  
**Content-Type:** `multipart/form-data`  
**Max Files:** 10  
**Max File Size:** 5MB per file  
**Allowed Formats:** jpg, jpeg, png, gif, webp  

**Request:**
```bash
curl -X POST http://localhost:3010/api/v1/projects/{projectId}/upload-gallery \
  -H "Authorization: Bearer {token}" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg" \
  -F "files=@/path/to/image3.jpg"
```

**Response:**
```json
{
  "success": true,
  "urls": [
    "https://res.cloudinary.com/dib7tbv7w/image/upload/v.../project-gallery-...1.jpg",
    "https://res.cloudinary.com/dib7tbv7w/image/upload/v.../project-gallery-...2.jpg",
    "https://res.cloudinary.com/dib7tbv7w/image/upload/v.../project-gallery-...3.jpg"
  ],
  "publicIds": [...],
  "totalImages": 5,
  "project": { /* updated project object */ }
}
```

**Image Transformations:**
- Automatically resized to 1200x900px
- Crop mode: fill with auto gravity
- Quality: auto:good

### 4. Replace Gallery Images
Replace all gallery images with new ones.

**Endpoint:** `PUT /projects/:id/replace-gallery`  
**Content-Type:** `multipart/form-data`  
**Max Files:** 10  
**Max File Size:** 5MB per file  
**Allowed Formats:** jpg, jpeg, png, gif, webp  

**Request:**
```bash
curl -X PUT http://localhost:3010/api/v1/projects/{projectId}/replace-gallery \
  -H "Authorization: Bearer {token}" \
  -F "files=@/path/to/new-image1.jpg" \
  -F "files=@/path/to/new-image2.jpg"
```

**Response:**
```json
{
  "success": true,
  "urls": [...],
  "publicIds": [...],
  "totalImages": 2,
  "project": { /* updated project object */ }
}
```

### 5. Upload Images from URLs
Upload images from external URLs to Cloudinary (useful for migration).

**Endpoint:** `POST /projects/:id/upload-from-url`  
**Content-Type:** `application/json`  

**Request:**
```bash
curl -X POST http://localhost:3010/api/v1/projects/{projectId}/upload-from-url \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "thumbnailUrl": "https://example.com/thumbnail.jpg",
    "coverUrl": "https://example.com/cover.jpg",
    "galleryUrls": [
      "https://example.com/gallery1.jpg",
      "https://example.com/gallery2.jpg"
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "results": {
    "thumbnail": "https://res.cloudinary.com/...",
    "cover": "https://res.cloudinary.com/...",
    "gallery": [
      "https://res.cloudinary.com/...",
      "https://res.cloudinary.com/..."
    ]
  },
  "project": { /* updated project object */ }
}
```

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Only image files are allowed!",
  "error": "Bad Request"
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Project not found",
  "error": "Not Found"
}
```

**413 Payload Too Large:**
```json
{
  "statusCode": 413,
  "message": "File too large",
  "error": "Payload Too Large"
}
```

## JavaScript/TypeScript Example

```typescript
// Upload thumbnail using FormData
async function uploadProjectThumbnail(projectId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`/api/v1/projects/${projectId}/upload-thumbnail`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return await response.json();
}

// Upload multiple gallery images
async function uploadGalleryImages(projectId: string, files: File[]) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  
  const response = await fetch(`/api/v1/projects/${projectId}/upload-gallery`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return await response.json();
}

// Upload from URLs
async function uploadFromUrls(projectId: string, urls: {
  thumbnailUrl?: string;
  coverUrl?: string;
  galleryUrls?: string[];
}) {
  const response = await fetch(`/api/v1/projects/${projectId}/upload-from-url`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(urls)
  });
  
  return await response.json();
}
```

## React Example with Progress

```tsx
import { useState } from 'react';
import axios from 'axios';

function ProjectImageUpload({ projectId, token }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  const handleThumbnailUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    
    try {
      const response = await axios.post(
        `/api/v1/projects/${projectId}/upload-thumbnail`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        }
      );
      
      console.log('Upload successful:', response.data);
      // Update UI with new image URL
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        onChange={handleThumbnailUpload}
        accept="image/*"
        disabled={uploading}
      />
      {uploading && (
        <div>
          <progress value={uploadProgress} max="100" />
          <span>{uploadProgress}%</span>
        </div>
      )}
    </div>
  );
}
```

## Notes

1. **Cloudinary Storage:** All images are automatically uploaded to Cloudinary with optimized settings
2. **CDN Delivery:** Images are served through Cloudinary's global CDN for fast loading
3. **Automatic Optimization:** Images are automatically optimized for web delivery
4. **Backup:** Original images are preserved on Cloudinary
5. **Temporary Files:** Uploaded files are temporarily stored in `/uploads/temp` and automatically cleaned up after processing

## Migration Script

To migrate existing project images from external URLs to Cloudinary:

```bash
cd backend
npx tsx src/migrate-project-images.ts
```

This script will:
- Find all projects with external image URLs
- Upload each image to Cloudinary
- Update the database with new Cloudinary URLs
- Preserve any existing Cloudinary URLs
- Report success/failure statistics
