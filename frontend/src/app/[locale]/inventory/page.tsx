'use client'
import { useState } from 'react'
import styled from 'styled-components'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { Layout } from '@/components/layout/Layout'
import { ProductTable } from '@/components/inventory/ProductTable'
import { ProductForm } from '@/components/inventory/ProductForm'
import { Button } from '@/components/ui/Button'
import { Product, CreateProductRequest, UpdateProductRequest, productsService } from '@/services/products'

const InventoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: stretch;
  }
`

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: flex-end;
  }
`

const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
`

const ConfirmCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 400px;
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

const ConfirmTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`

const ConfirmMessage = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  line-height: 1.5;
`

const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Toast = styled.div<{ $show: boolean; $type: 'success' | 'error' }>`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ $type, theme }) => 
    $type === 'success' ? theme.colors.success[500] : theme.colors.error[500]};
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 60;
  transform: translateX(${({ $show }) => $show ? '0' : '400px'});
  transition: transform 0.3s ease-in-out;
  max-width: 300px;
`

export default function InventoryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [productToDelete, setProductToDelete] = useState<Product | undefined>();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Force re-render of table by incrementing key
  const [tableKey, setTableKey] = useState(0);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
  };

  const handleViewProduct = (product: Product) => {
    // For now, just show an alert. In production, this could open a detailed view modal
    alert(`Product Details:\n\nName: ${product.name}\nSKU: ${product.sku}\nCategory: ${product.category}\nQuantity: ${product.quantity}\nPrice: $${product.price}\nSupplier: ${product.supplier}`);
  };

  const handleSaveProduct = async (data: CreateProductRequest | UpdateProductRequest) => {
    try {
      setLoading(true);
      
      if (editingProduct) {
        // Update existing product
        await productsService.updateProduct(editingProduct.id, data as UpdateProductRequest);
        showToast('Product updated successfully');
      } else {
        // Create new product
        await productsService.createProduct(data as CreateProductRequest);
        showToast('Product created successfully');
      }
      
      // Refresh the table
      setTableKey(prev => prev + 1);
    } catch (error) {
      console.error('Error saving product:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to save product',
        'error'
      );
      throw error; // Re-throw so form can handle it
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setLoading(true);
      await productsService.deleteProduct(productToDelete.id);
      showToast('Product deleted successfully');
      setProductToDelete(undefined);
      
      // Refresh the table
      setTableKey(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to delete product',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <InventoryHeader>
        <PageTitle>Inventory Management</PageTitle>
        <ActionButtons>
          <Button
            onClick={handleAddProduct}
            size="md"
            aria-label="Add new product"
          >
            <FiPlus size={16} />
            Add Product
          </Button>
        </ActionButtons>
      </InventoryHeader>

      <ProductTable
        key={tableKey}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onView={handleViewProduct}
      />

      <ProductForm
        product={editingProduct}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(undefined);
        }}
        onSave={handleSaveProduct}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      {productToDelete && (
        <ConfirmDialog>
          <ConfirmCard>
            <ConfirmTitle>Delete Product</ConfirmTitle>
            <ConfirmMessage>
              Are you sure you want to delete "{productToDelete.name}"? This action cannot be undone.
            </ConfirmMessage>
            <ConfirmActions>
              <Button
                variant="outline"
                onClick={() => setProductToDelete(undefined)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                isLoading={loading}
                disabled={loading}
                style={{ backgroundColor: '#dc2626' }}
              >
                <FiTrash2 size={16} />
                Delete
              </Button>
            </ConfirmActions>
          </ConfirmCard>
        </ConfirmDialog>
      )}

      {/* Toast Notification */}
      <Toast $show={toast.show} $type={toast.type}>
        {toast.message}
      </Toast>
    </Layout>
  );
}