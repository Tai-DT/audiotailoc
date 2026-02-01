---
name: Integrate Backend
description: Guidelines for integrating the backend API into functionality, specifically for the dashboard 
---

# Integrate Backend API Skill

This skill outlines the standard procedure for integrating the NestJS backend API with the Next.js Dashboard.

## 1. API Client Architecture

The dashboard uses a centralized `ApiClient` class located in `dashboard/lib/api-client.ts`.
- **Singleton**: An instance is exported as `apiClient`.
- **Base URL**: Automatically handled based on environment (`process.env.NEXT_PUBLIC_API_URL` or auto-detected).
- **Authentication**: Managed internally via `localStorage` ('accessToken') and `Authorization` headers.
- **Error Handling**: Standardized error throwing with `ApiError` interface.

## 2. Adding New Endpoints

If you need to access a backend resource that isn't yet in `ApiClient`:

1.  **Check Backend Controller**:
    - Locate the controller in `backend/src/modules/<module>/<module>.controller.ts`.
    - Identify the HTTP method, route path, and DTOs.
2.  **Update `ApiClient`**:
    - Add a new method to the `ApiClient` class in `dashboard/lib/api-client.ts`.
    - Use the `params` argument for query strings.
    - Use `this.request<T>(...)` for the call.

### Example: Adding Projects

```typescript
// In dashboard/lib/api-client.ts

// Projects endpoints
async getProjects(params?: { page?: number; limit?: number; status?: string; featured?: boolean }) {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.status) query.append('status', params.status);
  if (params?.featured !== undefined) query.append('featured', params.featured.toString());

  return this.request(`/projects?${query.toString()}`);
}

async getProject(id: string) {
  return this.request(`/projects/${id}`);
}

async createProject(data: FormData) { // Projects often use FormData for images
   return this.request('/projects', {
      method: 'POST',
      body: data,
       // headers: ... (ApiClient handles content-type for FormData automatically if logic exists, otherwise explicit handling might be needed)
       // NOTE: The current ApiClient implementation deletes 'Content-Type' header if body is FormData to let browser set boundary.
    });
}
```

## 3. Consuming API in Components

Since `react-query` is not currently used, use `useEffect` and local state.

### Standard Pattern

```tsx
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export default function MyComponent() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMyData();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    // Render data
  );
}
```

## 4. Handling Images

- **Backend**: Returns relative paths or full URLs depending on storage.
- **Frontend**: Often needs to map paths. Check `dashboard/lib/utils.ts` or similar for image helpers if raw paths are returned.
- **Uploads**: Use `apiClient.uploadFile` or specific endpoint methods accepting `File` or `FormData`.

## 5. Environment Variables

Ensure `dashboard/.env.local` contains:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
```
(Or the production URL).
