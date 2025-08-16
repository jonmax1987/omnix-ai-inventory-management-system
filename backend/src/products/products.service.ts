import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ProductDto, CreateProductDto, UpdateProductDto } from '@/common/dto/product.dto';
import { ProductQueryDto, PaginatedResponseDto } from '@/common/dto/common.dto';

@Injectable()
export class ProductsService {
  // In-memory storage for demo purposes
  // In production, this would be replaced with DynamoDB service
  private products: ProductDto[] = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Premium Coffee Beans',
      sku: 'PCB-001',
      barcode: '1234567890123',
      category: 'Beverages',
      quantity: 150,
      minThreshold: 20,
      price: 24.99,
      cost: 18.50,
      supplier: 'Global Coffee Co.',
      description: 'High-quality arabica coffee beans sourced from Colombia',
      unit: 'kg',
      expirationDate: '2024-12-31',
      location: 'Warehouse A, Shelf 3',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      lastUpdated: '2024-01-20T14:45:00Z',
    },
    {
      id: '223e4567-e89b-12d3-a456-426614174001',
      name: 'Organic Green Tea',
      sku: 'OGT-002',
      barcode: '2345678901234',
      category: 'Beverages',
      quantity: 8,
      minThreshold: 15,
      price: 12.99,
      cost: 9.50,
      supplier: 'Organic Tea Ltd.',
      description: 'Premium organic green tea leaves',
      unit: 'box',
      expirationDate: '2025-06-30',
      location: 'Warehouse A, Shelf 2',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-18T11:20:00Z',
      lastUpdated: '2024-01-18T11:20:00Z',
    },
    {
      id: '323e4567-e89b-12d3-a456-426614174002',
      name: 'Whole Wheat Flour',
      sku: 'WWF-003',
      category: 'Baking',
      quantity: 45,
      minThreshold: 10,
      price: 8.99,
      cost: 6.50,
      supplier: 'Mills & Grains Co.',
      description: '100% whole wheat flour for baking',
      unit: 'kg',
      expirationDate: '2024-11-15',
      location: 'Warehouse B, Shelf 1',
      createdAt: '2024-01-12T14:00:00Z',
      updatedAt: '2024-01-19T16:30:00Z',
      lastUpdated: '2024-01-19T16:30:00Z',
    },
  ];

  async findAll(query: ProductQueryDto): Promise<PaginatedResponseDto<ProductDto>> {
    let filteredProducts = [...this.products];

    // Apply search filter
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.sku.toLowerCase().includes(searchTerm) ||
          product.barcode?.toLowerCase().includes(searchTerm),
      );
    }

    // Apply category filter
    if (query.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === query.category.toLowerCase(),
      );
    }

    // Apply supplier filter
    if (query.supplier) {
      filteredProducts = filteredProducts.filter(
        (product) => product.supplier.toLowerCase().includes(query.supplier.toLowerCase()),
      );
    }

    // Apply low stock filter
    if (query.lowStock) {
      filteredProducts = filteredProducts.filter(
        (product) => product.quantity <= product.minThreshold,
      );
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      const aValue = a[query.sortBy] || '';
      const bValue = b[query.sortBy] || '';
      
      if (query.sortOrder === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });

    // Apply pagination
    const total = filteredProducts.length;
    const pages = Math.ceil(total / query.limit);
    const startIndex = (query.page - 1) * query.limit;
    const endIndex = startIndex + query.limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Calculate metadata
    const totalValue = this.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const totalItems = this.products.reduce((sum, product) => sum + product.quantity, 0);

    return {
      data: paginatedProducts,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages,
        hasNext: query.page < pages,
        hasPrev: query.page > 1,
      },
      meta: {
        totalValue,
        totalItems,
      },
    };
  }

  async findOne(id: string): Promise<ProductDto | null> {
    return this.products.find((product) => product.id === id) || null;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    // Check if SKU already exists
    const existingProduct = this.products.find(
      (product) => product.sku.toLowerCase() === createProductDto.sku.toLowerCase(),
    );
    
    if (existingProduct) {
      throw new Error(`Product with SKU '${createProductDto.sku}' already exists`);
    }

    const now = new Date().toISOString();
    const newProduct: ProductDto = {
      id: uuidv4(),
      ...createProductDto,
      createdAt: now,
      updatedAt: now,
      lastUpdated: now,
    };

    this.products.push(newProduct);
    return newProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDto | null> {
    const productIndex = this.products.findIndex((product) => product.id === id);
    
    if (productIndex === -1) {
      return null;
    }

    const now = new Date().toISOString();
    const updatedProduct = {
      ...this.products[productIndex],
      ...updateProductDto,
      updatedAt: now,
      lastUpdated: now,
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  async remove(id: string): Promise<boolean> {
    const productIndex = this.products.findIndex((product) => product.id === id);
    
    if (productIndex === -1) {
      return false;
    }

    this.products.splice(productIndex, 1);
    return true;
  }

  // Helper methods for other services
  async findLowStockProducts(): Promise<ProductDto[]> {
    return this.products.filter((product) => product.quantity <= product.minThreshold);
  }

  async findByCategory(category: string): Promise<ProductDto[]> {
    return this.products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    );
  }

  async getTotalInventoryValue(): Promise<number> {
    return this.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  }

  async getTotalItemCount(): Promise<number> {
    return this.products.reduce((sum, product) => sum + product.quantity, 0);
  }

  async getCategoryBreakdown(): Promise<Array<{ category: string; itemCount: number; value: number }>> {
    const categoryMap = new Map<string, { itemCount: number; value: number }>();
    
    for (const product of this.products) {
      const existing = categoryMap.get(product.category) || { itemCount: 0, value: 0 };
      categoryMap.set(product.category, {
        itemCount: existing.itemCount + product.quantity,
        value: existing.value + (product.price * product.quantity),
      });
    }

    return Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      ...stats,
    }));
  }
}