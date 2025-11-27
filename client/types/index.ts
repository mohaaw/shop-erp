'use client';

export type Theme = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

export interface ThemeConfig {
  colors: Record<string, Record<number, string>>;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff' | 'user';
  avatar?: string;
  permissions: string[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  image?: string;
  description?: string;
  status: 'draft' | 'active' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  totalPurchases: number;
  loyaltyPoints: number;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
