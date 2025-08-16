'use client'
import { useState } from 'react'
import styled from 'styled-components'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { OriginalLayout } from '@/components/layout/OriginalLayout'
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

export default function InventoryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  return (
    <OriginalLayout>
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
        onDelete={() => {}}
        onView={() => {}}
      />

      <ProductForm
        product={editingProduct}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(undefined);
        }}
        onSave={async () => {}}
        loading={loading}
      />
    </OriginalLayout>
  );
}