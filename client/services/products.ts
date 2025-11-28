import { Product } from '@/types/product';

// Mock data store (in-memory for demo purposes)
let products: Product[] = [];

export const productService = {
    async getProducts(): Promise<Product[]> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return products;
    },

    async getProduct(id: string): Promise<Product | undefined> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return products.find((p) => p.id === id);
    },

    async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newProduct: Product = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        products.push(newProduct);
        return newProduct;
    },

    async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const index = products.findIndex((p) => p.id === id);
        if (index === -1) throw new Error('Product not found');

        products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() };
        return products[index];
    },

    async deleteProduct(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        products = products.filter((p) => p.id !== id);
    }
};
