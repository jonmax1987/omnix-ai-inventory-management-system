'use client'
import styled from 'styled-components'
import { useState, useEffect, useCallback } from 'react'
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiEye, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Product, ProductQueryParams, productsService } from '@/services/products'

const TableContainer = styled(Card)`
  padding: 0;
  overflow: hidden;
`

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: stretch;
  }
`

const TableTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`

const TableControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    width: 100%;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`

const SearchInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 14px;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[100]};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    min-width: auto;
  }
`

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[100]};
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray[50]};
`

const TableRow = styled.tr<{ $clickable?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  &:hover {
    background-color: ${({ $clickable, theme }) => 
      $clickable ? theme.colors.gray[50] : 'transparent'};
  }
`

const TableHeader_Cell = styled.th<{ $sortable?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: ${({ $sortable }) => $sortable ? 'pointer' : 'default'};
  user-select: none;
  
  &:hover {
    color: ${({ $sortable, theme }) => 
      $sortable ? theme.colors.gray[900] : 'inherit'};
  }
  
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray[900]};
`

const ProductName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[900]};
`

const ProductSKU = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: 2px;
`

const StockLevel = styled.div<{ $level: 'low' | 'normal' | 'high' }>`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  
  background-color: ${({ $level, theme }) => {
    switch ($level) {
      case 'low': return theme.colors.error[50];
      case 'high': return theme.colors.success[50];
      default: return theme.colors.gray[100];
    }
  }};
  
  color: ${({ $level, theme }) => {
    switch ($level) {
      case 'low': return theme.colors.error[700];
      case 'high': return theme.colors.success[700];
      default: return theme.colors.gray[700];
    }
  }};
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`

const ActionButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.xs};
  min-width: auto;
`

const LoadingState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[500]};
`

const ErrorState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.error[500]};
`

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[500]};
`

const Pagination = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`

const PaginationInfo = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray[600]};
`

const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`

interface ProductTableProps {
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onView?: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ onEdit, onDelete, onView }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });
  
  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<ProductQueryParams['sortBy']>('name');
  const [sortOrder, setSortOrder] = useState<ProductQueryParams['sortOrder']>('asc');
  
  // Available categories (in production, this would come from API)
  const categories = ['', 'Beverages', 'Baking', 'Snacks', 'Dairy'];

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: ProductQueryParams = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
      };
      
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (categoryFilter) params.category = categoryFilter;
      
      const response = await productsService.getProducts(params);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, categoryFilter, sortBy, sortOrder]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSort = (column: ProductQueryParams['sortBy']) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getStockLevel = (quantity: number, threshold: number): 'low' | 'normal' | 'high' => {
    if (quantity <= threshold) return 'low';
    if (quantity > threshold * 2) return 'high';
    return 'normal';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getSortIcon = (column: ProductQueryParams['sortBy']) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />;
  };

  if (error) {
    return (
      <TableContainer>
        <ErrorState>
          <p>Error loading products: {error}</p>
          <Button onClick={loadProducts} variant="outline" size="sm">
            Retry
          </Button>
        </ErrorState>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>Products ({pagination.total})</TableTitle>
        <TableControls>
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <FilterSelect
            value={categoryFilter}
            onChange={(e) => handleCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.slice(1).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </FilterSelect>
        </TableControls>
      </TableHeader>

      {loading ? (
        <LoadingState>Loading products...</LoadingState>
      ) : products.length === 0 ? (
        <EmptyState>
          {searchTerm || categoryFilter ? 
            'No products found matching your criteria' : 
            'No products available'
          }
        </EmptyState>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader_Cell $sortable onClick={() => handleSort('name')}>
                    Product {getSortIcon('name')}
                  </TableHeader_Cell>
                  <TableHeader_Cell>Category</TableHeader_Cell>
                  <TableHeader_Cell $sortable onClick={() => handleSort('quantity')}>
                    Stock {getSortIcon('quantity')}
                  </TableHeader_Cell>
                  <TableHeader_Cell $sortable onClick={() => handleSort('price')}>
                    Price {getSortIcon('price')}
                  </TableHeader_Cell>
                  <TableHeader_Cell>Supplier</TableHeader_Cell>
                  <TableHeader_Cell $sortable onClick={() => handleSort('lastUpdated')}>
                    Last Updated {getSortIcon('lastUpdated')}
                  </TableHeader_Cell>
                  <TableHeader_Cell>Actions</TableHeader_Cell>
                </TableRow>
              </TableHead>
              <tbody>
                {products.map((product) => (
                  <TableRow key={product.id} $clickable>
                    <TableCell>
                      <ProductName>{product.name}</ProductName>
                      <ProductSKU>SKU: {product.sku}</ProductSKU>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <StockLevel $level={getStockLevel(product.quantity, product.minThreshold)}>
                        {product.quantity}
                      </StockLevel>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                        Min: {product.minThreshold}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.supplier}</TableCell>
                    <TableCell>
                      {new Date(product.lastUpdated).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        {onView && (
                          <ActionButton
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(product)}
                            aria-label={`View ${product.name}`}
                          >
                            <FiEye size={16} />
                          </ActionButton>
                        )}
                        {onEdit && (
                          <ActionButton
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(product)}
                            aria-label={`Edit ${product.name}`}
                          >
                            <FiEdit2 size={16} />
                          </ActionButton>
                        )}
                        {onDelete && (
                          <ActionButton
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(product)}
                            aria-label={`Delete ${product.name}`}
                          >
                            <FiTrash2 size={16} />
                          </ActionButton>
                        )}
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>

          <Pagination>
            <PaginationInfo>
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} products
            </PaginationInfo>
            <PaginationControls>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrev}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNext}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </PaginationControls>
          </Pagination>
        </>
      )}
    </TableContainer>
  );
};