"use client";

import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { useSession } from 'next-auth/react';
import { PageWrapper } from '@/components/PageWrapper';
import ProductTable from '@/components/ProductTable';
import AddProductModal from '@/components/AddProductModal';
import React, { useState } from 'react';
import { Product } from '@/types/Product';

export default function Products() {
  const { status } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  React.useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productToDelete: Product) => {
    // Validate product ID
    if (!productToDelete.id) {
      console.error('Cannot delete product: No ID provided');
      alert('Cannot delete product: Invalid product');
      return;
    }

    // Confirm deletion
    const confirmDelete = window.confirm(`Are you sure you want to delete the product: ${productToDelete.name}?`);
    if (!confirmDelete) {
      return;
    }

    try {
      console.log('Attempting to delete product:', productToDelete);
      
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);

      const responseData = await response.json();
      console.log('Full response data:', responseData);

      if (!response.ok) {
        console.error('Delete response error:', responseData);
        
        // Attempt to extract the most meaningful error message
        let errorMessage = 'Failed to delete product';
        
        // Try different ways to extract an error message
        if (typeof responseData.details === 'string') {
          errorMessage = responseData.details;
        } else if (responseData.details && responseData.details.error) {
          errorMessage = responseData.details.error;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        }

        // Log additional context
        console.log('Error details:', JSON.stringify(responseData, null, 2));

        throw new Error(errorMessage);
      }

      // Update the products list by filtering out the deleted product
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      console.log('Updated products list:', updatedProducts);
      setProducts(updatedProducts);

      // Optional: Show success message
      alert(`Product "${productToDelete.name}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting product:', error);
      
      // Detailed error handling
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to delete product: ${errorMessage}`);

      // Optionally, force a refresh of products to reconcile any discrepancies
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (refreshError) {
        console.error('Error refreshing products:', refreshError);
      }
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      console.log('Attempting to update product:', updatedProduct);

      const res = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });

      console.log('Update response status:', res.status);

      const responseData = await res.json();
      console.log('Update response data:', responseData);

      if (res.ok) {
        // Update the local state
        setProducts(prev => 
          prev.map(product => 
            product.id === updatedProduct.id ? responseData : product
          )
        );
        setProductToEdit(null);
        setModalOpen(false);

        // Optional: Show success message
        alert('Product updated successfully');
      } else {
        // More detailed error handling
        console.error('Failed to update product:', responseData);
        
        // Try to extract a meaningful error message
        let errorMessage = 'Failed to update product';
        if (typeof responseData.details === 'string') {
          errorMessage = responseData.details;
        } else if (responseData.details && responseData.details.error) {
          errorMessage = responseData.details.error;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        }

        alert(`Update failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      
      // Detailed error handling
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to update product: ${errorMessage}`);

      // Optionally, force a refresh of products to reconcile any discrepancies
      try {
        const refreshRes = await fetch('/api/products');
        const data = await refreshRes.json();
        setProducts(data.products || []);
      } catch (refreshError) {
        console.error('Error refreshing products:', refreshError);
      }
    }
  };

  const handleAddProduct = async (product: Product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const { product: newProduct } = await res.json();
        setProducts((prev) => [newProduct, ...prev]);
      }
    } catch (e) {
      // Optionally show error
    }
    setModalOpen(false);
  };

  if (status === 'loading' || loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <span className="text-gray-600">Loading products...</span>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col gap-4 px-4 md:px-8 max-w-[1128px] mx-auto">
        <PageWrapper>
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Products</h1>
                  <p className="mt-2 text-gray-600">Manage your products here.</p>
                </div>
                <button
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                  onClick={() => setModalOpen(true)}
                >
                  + Add Product
                </button>
              </div>
            </div>
          </div>
          <ProductTable 
          products={products} 
          onEditProduct={(product) => {
            setProductToEdit(product);
            setModalOpen(true);
          }} 
          onDeleteProduct={handleDeleteProduct}
        />
          <AddProductModal 
          isOpen={modalOpen} 
          onClose={() => {
            setModalOpen(false);
            setProductToEdit(null);
          }} 
          onSave={productToEdit ? handleUpdateProduct : handleAddProduct} 
          productToEdit={productToEdit} 
        />
        </PageWrapper>
      </div>
    </AuthenticatedLayout>
  );
}
