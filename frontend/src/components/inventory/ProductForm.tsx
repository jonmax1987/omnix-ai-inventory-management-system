'use client'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { FiX, FiSave, FiLoader } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Product, CreateProductRequest, UpdateProductRequest } from '@/services/products'

const Overlay = styled.div`
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

const Modal = styled(Card)`
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xl};
  position: relative;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`

const CloseButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.xs};
  min-width: auto;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[700]};
`

const RequiredLabel = styled(Label)`
  &::after {
    content: '*';
    color: ${({ theme }) => theme.colors.error[500]};
    margin-left: 2px;
  }
`

const Input = styled.input<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ $hasError, theme }) => 
    $hasError ? theme.colors.error[300] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) => 
      $hasError ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ $hasError, theme }) => 
      $hasError ? theme.colors.error[100] : theme.colors.primary[100]};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`

const Select = styled.select<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ $hasError, theme }) => 
    $hasError ? theme.colors.error[300] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) => 
      $hasError ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ $hasError, theme }) => 
      $hasError ? theme.colors.error[100] : theme.colors.primary[100]};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`

const TextArea = styled.textarea<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ $hasError, theme }) => 
    $hasError ? theme.colors.error[300] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) => 
      $hasError ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ $hasError, theme }) => 
      $hasError ? theme.colors.error[100] : theme.colors.primary[100]};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error[600]};
  margin-top: 2px;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

interface FormErrors {
  [key: string]: string;
}

interface ProductFormProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateProductRequest | UpdateProductRequest) => Promise<void>;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    sku: '',
    barcode: '',
    category: '',
    quantity: 0,
    minThreshold: 0,
    price: 0,
    cost: 0,
    supplier: '',
    description: '',
    unit: '',
    expirationDate: '',
    location: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories (in production, this would come from API)
  const categories = ['Beverages', 'Baking', 'Snacks', 'Dairy', 'Meat & Poultry', 'Produce', 'Other'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        barcode: product.barcode || '',
        category: product.category,
        quantity: product.quantity,
        minThreshold: product.minThreshold,
        price: product.price,
        cost: product.cost || 0,
        supplier: product.supplier,
        description: product.description || '',
        unit: product.unit || '',
        expirationDate: product.expirationDate || '',
        location: product.location || '',
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        sku: '',
        barcode: '',
        category: '',
        quantity: 0,
        minThreshold: 0,
        price: 0,
        cost: 0,
        supplier: '',
        description: '',
        unit: '',
        expirationDate: '',
        location: '',
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    
    // Numeric validations
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    if (formData.minThreshold < 0) newErrors.minThreshold = 'Minimum threshold cannot be negative';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.cost && formData.cost < 0) newErrors.cost = 'Cost cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateProductRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // Remove empty optional fields
      const submitData = { ...formData };
      if (!submitData.barcode) delete submitData.barcode;
      if (!submitData.description) delete submitData.description;
      if (!submitData.unit) delete submitData.unit;
      if (!submitData.expirationDate) delete submitData.expirationDate;
      if (!submitData.location) delete submitData.location;
      if (!submitData.cost) delete submitData.cost;
      
      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal>
        <ModalHeader>
          <ModalTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </ModalTitle>
          <CloseButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting || loading}
            aria-label="Close form"
          >
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <RequiredLabel htmlFor="name">Product Name</RequiredLabel>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                $hasError={!!errors.name}
                disabled={isSubmitting || loading}
                placeholder="Enter product name"
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <RequiredLabel htmlFor="sku">SKU</RequiredLabel>
              <Input
                id="sku"
                type="text"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                $hasError={!!errors.sku}
                disabled={isSubmitting || loading || !!product} // Don't allow SKU changes for existing products
                placeholder="Enter SKU"
              />
              {errors.sku && <ErrorMessage>{errors.sku}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                type="text"
                value={formData.barcode}
                onChange={(e) => handleInputChange('barcode', e.target.value)}
                disabled={isSubmitting || loading}
                placeholder="Enter barcode (optional)"
              />
            </FormGroup>

            <FormGroup>
              <RequiredLabel htmlFor="category">Category</RequiredLabel>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                $hasError={!!errors.category}
                disabled={isSubmitting || loading}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
              {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <RequiredLabel htmlFor="quantity">Quantity</RequiredLabel>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
                $hasError={!!errors.quantity}
                disabled={isSubmitting || loading}
              />
              {errors.quantity && <ErrorMessage>{errors.quantity}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <RequiredLabel htmlFor="minThreshold">Minimum Threshold</RequiredLabel>
              <Input
                id="minThreshold"
                type="number"
                min="0"
                value={formData.minThreshold}
                onChange={(e) => handleInputChange('minThreshold', Number(e.target.value))}
                $hasError={!!errors.minThreshold}
                disabled={isSubmitting || loading}
              />
              {errors.minThreshold && <ErrorMessage>{errors.minThreshold}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <RequiredLabel htmlFor="price">Price ($)</RequiredLabel>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                $hasError={!!errors.price}
                disabled={isSubmitting || loading}
              />
              {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', Number(e.target.value))}
                $hasError={!!errors.cost}
                disabled={isSubmitting || loading}
                placeholder="Enter cost (optional)"
              />
              {errors.cost && <ErrorMessage>{errors.cost}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                type="text"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                disabled={isSubmitting || loading}
                placeholder="kg, pcs, box, etc."
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                disabled={isSubmitting || loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={isSubmitting || loading}
                placeholder="Warehouse A, Shelf 3"
              />
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <RequiredLabel htmlFor="supplier">Supplier</RequiredLabel>
            <Input
              id="supplier"
              type="text"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              $hasError={!!errors.supplier}
              disabled={isSubmitting || loading}
              placeholder="Enter supplier name"
            />
            {errors.supplier && <ErrorMessage>{errors.supplier}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isSubmitting || loading}
              placeholder="Enter product description (optional)"
            />
          </FormGroup>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              isLoading={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <FiLoader size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  Save Product
                </>
              )}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Overlay>
  );
};