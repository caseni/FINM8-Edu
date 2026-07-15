/**
 * API Client Configuration
 * 
 * Bu dosya, backend entegrasyonu için hazırlanmış API client yapısını içerir.
 * Şu anda mock data kullanılıyor, gerçek backend'e geçiş için bu yapıyı kullanabilirsiniz.
 */

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export const defaultConfig: ApiConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

/**
 * API Error
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API Client sınıfı
 * Gerçek backend entegrasyonu için Axios veya fetch wrapper olarak kullanılabilir
 */
export class ApiClient {
  private config: ApiConfig;

  constructor(config?: Partial<ApiConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.config.headers,
      });

      if (!response.ok) {
        throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
    }
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.config.headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
    }
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.config.headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.config.headers,
      });

      if (!response.ok) {
        throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
    }
  }

  /**
   * URL builder
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, this.config.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return url.toString();
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string): void {
    this.config.headers['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authorization token
   */
  removeAuthToken(): void {
    delete this.config.headers['Authorization'];
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient();

/**
 * API Endpoints
 * Backend entegrasyonu için endpoint'leri buraya ekleyin
 */
export const endpoints = {
  courses: {
    list: '/api/courses',
    detail: (id: number) => `/api/courses/${id}`,
    search: '/api/courses/search',
    byCategory: (category: string) => `/api/courses/category/${category}`,
    byLevel: (level: string) => `/api/courses/level/${level}`,
  },
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
  },
  user: {
    profile: '/api/user/profile',
    courses: '/api/user/courses',
    progress: (courseId: number) => `/api/user/courses/${courseId}/progress`,
  },
};
