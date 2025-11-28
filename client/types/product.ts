export type ProductStatus = 'active' | 'draft' | 'archived';

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    cost?: number;
    sku: string;
    barcode?: string;
    stock: number;
    category: string; // Category ID
    status: ProductStatus;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductFormData extends Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
    id?: string;
}
