export type ProductType = 'storable' | 'consumable' | 'service';
export type ProductStatus = 'active' | 'draft' | 'archived';
export type TrackingMethod = 'serial' | 'lot' | 'none';
export type SupplyRoute = 'buy' | 'make' | 'mto' | 'dropship';

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UnitOfMeasure {
    id: string;
    name: string;
    category: string;
    ratio: number;
    type: 'reference' | 'smaller' | 'bigger';
}

export interface ProductTax {
    id: string;
    name: string;
    rate: number;
    type: 'percent' | 'fixed';
}

export interface ProductAccount {
    id: string;
    code: string;
    name: string;
}

export interface ProductAttributeValue {
    id: string;
    name: string;
    code?: string; // Hex code for colors
}

export interface ProductAttribute {
    id: string;
    name: string;
    values: ProductAttributeValue[];
}

export interface ProductVariant {
    id: string;
    sku: string;
    price: number;
    stock: number;
    attributes: Record<string, string>; // attributeId -> valueId
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    type: ProductType;
    status: ProductStatus;

    // Media
    image?: string;
    gallery?: string[];

    // Identification
    sku: string;
    barcode?: string;
    internalReference?: string;

    // Pricing & Accounting
    price: number;
    cost?: number;
    taxes?: {
        customer: string[]; // Tax IDs
        vendor: string[];   // Tax IDs
    };
    accounts?: {
        income?: string;  // Account ID
        expense?: string; // Account ID
    };

    // Inventory & Logistics
    stock?: number;
    category?: string;
    uom?: string; // Unit of Measure ID
    purchaseUom?: string; // Purchase Unit of Measure ID
    weight?: number;
    volume?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: 'cm' | 'in' | 'm';
    };
    tracking?: TrackingMethod;
    routes?: SupplyRoute[];
    leadTime?: number; // Days

    // New Fields
    brand?: string;
    model?: string;
    specifications?: string; // JSON string
    warranty?: string;
    minStock?: number;
    hsCode?: string;
    countryOfOrigin?: string;

    // Variants
    hasVariants?: boolean;
    attributes?: ProductAttribute[];
    variants?: ProductVariant[];

    // POS
    availableInPos?: boolean;
    posCategory?: string;
    toppings?: string;
    isCombo?: boolean;
    comboItems?: string;

    // Extra
    uomRatio?: number;
    images?: string[];

    createdAt: string;
    updatedAt: string;
}

export interface ProductFormData extends Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'variants'> {
    id?: string;
    variants?: Omit<ProductVariant, 'id'>[];
}
