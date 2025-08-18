"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let ProductsService = class ProductsService {
    constructor() {
        this.products = [
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
    }
    async findAll(query) {
        let filteredProducts = [...this.products];
        if (query.search) {
            const searchTerm = query.search.toLowerCase();
            filteredProducts = filteredProducts.filter((product) => product.name.toLowerCase().includes(searchTerm) ||
                product.sku.toLowerCase().includes(searchTerm) ||
                product.barcode?.toLowerCase().includes(searchTerm));
        }
        if (query.category) {
            filteredProducts = filteredProducts.filter((product) => product.category.toLowerCase() === query.category.toLowerCase());
        }
        if (query.supplier) {
            filteredProducts = filteredProducts.filter((product) => product.supplier.toLowerCase().includes(query.supplier.toLowerCase()));
        }
        if (query.lowStock) {
            filteredProducts = filteredProducts.filter((product) => product.quantity <= product.minThreshold);
        }
        filteredProducts.sort((a, b) => {
            const aValue = a[query.sortBy] || '';
            const bValue = b[query.sortBy] || '';
            if (query.sortOrder === 'desc') {
                return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
            }
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        });
        const total = filteredProducts.length;
        const pages = Math.ceil(total / query.limit);
        const startIndex = (query.page - 1) * query.limit;
        const endIndex = startIndex + query.limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
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
    async findOne(id) {
        return this.products.find((product) => product.id === id) || null;
    }
    async create(createProductDto) {
        const existingProduct = this.products.find((product) => product.sku.toLowerCase() === createProductDto.sku.toLowerCase());
        if (existingProduct) {
            throw new Error(`Product with SKU '${createProductDto.sku}' already exists`);
        }
        const now = new Date().toISOString();
        const newProduct = {
            id: (0, uuid_1.v4)(),
            ...createProductDto,
            createdAt: now,
            updatedAt: now,
            lastUpdated: now,
        };
        this.products.push(newProduct);
        return newProduct;
    }
    async update(id, updateProductDto) {
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
    async remove(id) {
        const productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex === -1) {
            return false;
        }
        this.products.splice(productIndex, 1);
        return true;
    }
    async findLowStockProducts() {
        return this.products.filter((product) => product.quantity <= product.minThreshold);
    }
    async findByCategory(category) {
        return this.products.filter((product) => product.category.toLowerCase() === category.toLowerCase());
    }
    async getTotalInventoryValue() {
        return this.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    }
    async getTotalItemCount() {
        return this.products.reduce((sum, product) => sum + product.quantity, 0);
    }
    async getCategoryBreakdown() {
        const categoryMap = new Map();
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map