export type ProductStatus = 'active' | 'draft' | 'archived';

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string; // For hierarchical categories
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductAttribute {
    name: string; // e.g., "Color", "Size"
    value: string; // e.g., "Red", "XL"
}

export interface ProductVariant {
    id: string;
    productId: string;
    sku: string;
    price: number;
    stock: number;
    attributes: ProductAttribute[];
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    cost?: number;
    sku: string;
    barcode?: string;
    weight?: number; // In kg
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: 'cm' | 'in';
    };
    stock: number;
    category: string; // Category ID
    status: ProductStatus;
    image?: string;
    variants?: ProductVariant[];
    createdAt: string;
    updatedAt: string;
}

export interface ProductFormData extends Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'variants'> {
    id?: string;
    variants?: Omit<ProductVariant, 'id' | 'productId'>[];
}
