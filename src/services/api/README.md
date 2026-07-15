# API Client Documentation

## Overview

Bu klasör, backend entegrasyonu için hazırlanmış API client yapısını içerir. Şu anda uygulama mock data kullanıyor, ancak gerçek backend'e geçiş için bu yapıyı kullanabilirsiniz.

## Kullanım

### API Client Instance

```typescript
import { apiClient, endpoints } from './services/api/client';

// GET request
const response = await apiClient.get<Course[]>(endpoints.courses.list);

// POST request
const response = await apiClient.post('/api/courses', courseData);

// Authorization token ekleme
apiClient.setAuthToken('your-token-here');
```

### Endpoints

Endpoint'ler `endpoints` objesi içinde tanımlanmıştır:

```typescript
// Kurs listesi
const courses = await apiClient.get<Course[]>(endpoints.courses.list);

// Kurs detayı
const course = await apiClient.get<Course>(endpoints.courses.detail(1));

// Kurs arama
const results = await apiClient.get<Course[]>(endpoints.courses.search, {
  q: 'search term'
});
```

## Mock Data'dan Gerçek API'ye Geçiş

1. `courseService.ts` dosyasındaki mock fonksiyonları gerçek API çağrılarıyla değiştirin:

```typescript
// Önceki (mock)
export const getCourses = async (): Promise<Course[]> => {
  return mockCourses;
};

// Sonraki (gerçek API)
export const getCourses = async (): Promise<Course[]> => {
  const response = await apiClient.get<Course[]>(endpoints.courses.list);
  return response.data;
};
```

2. Environment variable'ları ayarlayın:

```bash
# .env dosyası
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

3. Error handling'i güncelleyin:

```typescript
try {
  const response = await apiClient.get<Course>(endpoints.courses.detail(id));
  return response.data;
} catch (error) {
  if (error instanceof ApiError) {
    // API hatası
    throw new Error(`API Error: ${error.message}`);
  }
  // Network hatası
  throw new Error('Network error occurred');
}
```

## Interceptors (Gelecek Geliştirme)

Axios kullanıyorsanız, request/response interceptors ekleyebilirsiniz:

```typescript
// Request interceptor - token ekleme
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token yenileme veya logout
    }
    return Promise.reject(error);
  }
);
```
