import { ProductDto, CreateProductDto, UpdateProductDto } from '@/common/dto/product.dto';
import { ProductQueryDto, PaginatedResponseDto } from '@/common/dto/common.dto';
export declare class ProductsService {
    private products;
    findAll(query: ProductQueryDto): Promise<PaginatedResponseDto<ProductDto>>;
    findOne(id: string): Promise<ProductDto | null>;
    create(createProductDto: CreateProductDto): Promise<ProductDto>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDto | null>;
    remove(id: string): Promise<boolean>;
    findLowStockProducts(): Promise<ProductDto[]>;
    findByCategory(category: string): Promise<ProductDto[]>;
    getTotalInventoryValue(): Promise<number>;
    getTotalItemCount(): Promise<number>;
    getCategoryBreakdown(): Promise<Array<{
        category: string;
        itemCount: number;
        value: number;
    }>>;
}
