import { apiRequest } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      isActive: boolean;
      createdAt: string;
      lastLoginAt?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

class AuthService {
  private readonly TOKEN_KEY = 'omnix_access_token';
  private readonly REFRESH_TOKEN_KEY = 'omnix_refresh_token';
  private readonly USER_KEY = 'omnix_user';

  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store tokens and user info
    this.setAccessToken(response.data.accessToken);
    this.setRefreshToken(response.data.refreshToken);
    this.setUser(response.data.user);

    return response;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      });
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearTokens();
    }
  }

  // Refresh access token
  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiRequest<RefreshTokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    this.setAccessToken(response.accessToken);
    this.setRefreshToken(response.refreshToken);

    return response;
  }

  // Get current user
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Get access token
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get refresh token
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Set access token
  private setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // Set refresh token
  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  // Set user info
  private setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  // Clear all tokens and user info
  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  // Create authenticated API request headers
  getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Make authenticated API request
  async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const authHeaders = this.getAuthHeaders();
    
    try {
      return await apiRequest<T>(endpoint, {
        ...options,
        headers: {
          ...authHeaders,
          ...options.headers,
        },
      });
    } catch (error: any) {
      // If we get a 401, try to refresh the token
      if (error.status === 401 && this.getRefreshToken()) {
        try {
          await this.refreshToken();
          
          // Retry the original request with new token
          return await apiRequest<T>(endpoint, {
            ...options,
            headers: {
              ...this.getAuthHeaders(),
              ...options.headers,
            },
          });
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          this.clearTokens();
          throw refreshError;
        }
      }
      
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();