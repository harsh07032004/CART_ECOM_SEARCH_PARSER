import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const ProductsContext = createContext(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial Fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    setLoading(true);
    try {
      if (!query.trim()) {
        return fetchProducts();
      }
      const data = await api.search(query);
      setProducts(data);
    } catch (error) {
      console.error("Search failed", error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      const newProduct = await api.create(productData);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (error) {
      console.error("Failed to add product", error);
      toast.error("Failed to add product");
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    // Optimistic update for now - Backend update not fully implemented in plan
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...productData, updatedAt: new Date() } : product
    ));
  };

  const deleteProduct = async (id) => {
    // Optimistic delete
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const rateProduct = async (productId, rating) => {
    // Optimistic rating
    const newRating = {
      userId: `user${Date.now()}`,
      rating,
      timestamp: new Date()
    };

    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          userRatings: [...(product.userRatings || []), newRating]
        };
      }
      return product;
    }));
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      loading,
      addProduct, 
      updateProduct, 
      deleteProduct, 
      rateProduct,
      searchProducts,
      fetchProducts 
    }}>
      {children}
    </ProductsContext.Provider>
  );
};