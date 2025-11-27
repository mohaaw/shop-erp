import { create } from 'zustand';
import type { Product } from '@/types';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [
    {
      id: '1',
      name: 'Wireless Headphones',
      sku: 'SKU-001',
      category: 'Electronics',
      price: 99.99,
      cost: 50,
      stock: 45,
      status: 'active',
      description: 'High-quality wireless headphones',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'USB-C Cable',
      sku: 'SKU-002',
      category: 'Accessories',
      price: 19.99,
      cost: 8,
      stock: 120,
      status: 'active',
      description: 'Fast charging USB-C cable',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}));
