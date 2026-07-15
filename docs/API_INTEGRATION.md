# API Entegrasyon Rehberi

Bu doküman, Education Platform uygulamasını gerçek backend API'sine entegre etmek için gerekli adımları açıklar.

## Genel Bakış

Uygulama şu anda mock data ile çalışmaktadır. Backend entegrasyonu için hazırlanmış API client yapısı `src/services/api/client.ts` dosyasında bulunmaktadır.

## API Endpoints

### Kurs Endpoints

#### GET /api/courses
Tüm kursları getirir.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": { "tr": "...", "en": "..." },
      "description": { "tr": "...", "en": "..." },
      ...
    }
  ],
  "status": 200
}
```

#### GET /api/courses/:id
Belirli bir kursu getirir.

**Response:**
```json
{
  "data": {
    "id": 1,
    "title": { "tr": "...", "en": "..." },
    ...
  },
  "status": 200
}
```

#### GET /api/courses/search?q=query
Kurs arama.

**Query Parameters:**
- `q`: Arama terimi

**Response:**
```json
{
  "data": [...],
  "status": 200
}
```

### Authentication Endpoints (Gelecek)

#### POST /api/auth/login
Kullanıcı girişi.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "data": {
    "token": "jwt-token",
    "user": { ... }
  },
  "status": 200
}
```

## Mock Data'dan Gerçek API'ye Geçiş

### 1. Environment Variables Ayarlama

`.env` dosyası oluşturun:

```bash
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

### 2. CourseService Güncelleme

`src/services/courseService.ts` dosyasını güncelleyin:

```typescript
import { apiClient, endpoints } from './api/client';

// Önceki (mock)
export const getCourses = async (): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCourses.filter((course) => !course.disabled));
    }, API_DELAY);
  });
};

// Sonraki (gerçek API)
export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await apiClient.get<Course[]>(endpoints.courses.list);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (id: number): Promise<Course | null> => {
  try {
    const response = await apiClient.get<Course>(endpoints.courses.detail(id));
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const searchCourses = async (query: string): Promise<Course[]> => {
  try {
    const response = await apiClient.get<Course[]>(endpoints.courses.search, {
      q: query,
    });
    return response.data;
  } catch (error) {
    console.error('Error searching courses:', error);
    throw error;
  }
};
```

### 3. Error Handling

API hatalarını handle etmek için:

```typescript
import { ApiError } from './api/client';

try {
  const courses = await getCourses();
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 404:
        // Not found
        break;
      case 401:
        // Unauthorized - logout user
        break;
      case 500:
        // Server error
        break;
      default:
        // Generic error
    }
  } else {
    // Network error
  }
}
```

### 4. Authentication Token Yönetimi

Login sonrası token'ı saklayın ve API client'a ekleyin:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './api/client';

// Login sonrası
const token = response.data.token;
await AsyncStorage.setItem('auth_token', token);
apiClient.setAuthToken(token);

// Logout
await AsyncStorage.removeItem('auth_token');
apiClient.removeAuthToken();
```

### 5. Request Interceptors (Axios kullanıyorsanız)

Axios kullanıyorsanız, interceptors ekleyebilirsiniz:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - refresh or logout
      await AsyncStorage.removeItem('auth_token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);
```

## Test Senaryoları

### 1. Network Error
- Uçak modunu açın ve API çağrısı yapın
- Error mesajının gösterildiğini kontrol edin

### 2. Invalid Course ID
- Geçersiz bir course ID ile detay sayfasına gidin
- "Course not found" mesajının gösterildiğini kontrol edin

### 3. Empty Search Results
- Var olmayan bir kurs adıyla arama yapın
- Empty state'in gösterildiğini kontrol edin

### 4. Offline Mode
- Uygulamayı offline modda açın
- Cached data'nın gösterildiğini kontrol edin (eğer implement edildiyse)

## Öneriler

1. **Caching**: Sık kullanılan verileri AsyncStorage'da cache'leyin
2. **Retry Logic**: Network hatalarında otomatik retry mekanizması ekleyin
3. **Loading States**: Tüm API çağrılarında loading state gösterin
4. **Error Messages**: Kullanıcı dostu hata mesajları gösterin
5. **Pagination**: Büyük listeler için pagination ekleyin
6. **Optimistic Updates**: UI'ı hemen güncelleyin, sonra API'yi çağırın

## Sorun Giderme

### CORS Hatası
Backend'de CORS ayarlarını kontrol edin. Expo development için localhost izinleri gerekebilir.

### Timeout Hatası
API response süresi uzunsa, timeout değerini artırın:

```typescript
const apiClient = new ApiClient({
  timeout: 30000, // 30 saniye
});
```

### Token Expiry
Token'ın expire olması durumunda refresh token mekanizması ekleyin.
