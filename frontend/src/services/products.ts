import { apiRequest } from './api';

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  quantity: number;
  minThreshold: number;
  price: number;
  cost?: number;
  supplier: string;
  description?: string;
  unit?: string;
  expirationDate?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  lastUpdated: string;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  quantity: number;
  minThreshold: number;
  price: number;
  cost?: number;
  supplier: string;
  description?: string;
  unit?: string;
  expirationDate?: string;
  location?: string;
}

export interface UpdateProductRequest {
  name?: string;
  barcode?: string;
  category?: string;
  quantity?: number;
  minThreshold?: number;
  price?: number;
  cost?: number;
  supplier?: string;
  description?: string;
  unit?: string;
  expirationDate?: string;
  location?: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  supplier?: string;
  sortBy?: 'name' | 'sku' | 'quantity' | 'price' | 'lastUpdated';
  sortOrder?: 'asc' | 'desc';
  lowStock?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductsResponse {
  data: Product[];
  pagination: Pagination;
  meta?: {
    totalValue: number;
    totalItems: number;
  };
}

export interface ProductResponse {
  data: Product;
  message?: string;
}

export const productsService = {
  async getProducts(params?: ProductQueryParams): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.supplier) searchParams.append('supplier', params.supplier);
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params?.lowStock !== undefined) searchParams.append('lowStock', params.lowStock.toString());
    
    const queryString = searchParams.toString();
    return await apiRequest<ProductsResponse>(`/products${queryString ? `?${queryString}` : ''}`);
  },

  async getProduct(productId: string): Promise<Product> {
    const response = await apiRequest<ProductResponse>(`/products/${productId}`);
    return response.data;
  },

  async createProduct(product: CreateProductRequest): Promise<Product> {
    const response = await apiRequest<ProductResponse>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return response.data;
  },

  async updateProduct(productId: string, updates: UpdateProductRequest): Promise<Product> {
    const response = await apiRequest<ProductResponse>(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  },

  async deleteProduct(productId: string): Promise<void> {
    await apiRequest(`/products/${productId}`, {
      method: 'DELETE',
    });
  },
};