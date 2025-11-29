'use server';

import { ProductService } from '@/lib/services/product-service';
import { ProductFormValues } from '@/lib/validations/product';
import { revalidatePath } from 'next/cache';

export async function createProductAction(data: ProductFormValues) {
    try {
        const product = ProductService.createProduct(data);
        revalidatePath('/dashboard/products');
        revalidatePath('/dashboard/pos');
        return { success: true, product };
    } catch (error) {
        console.error('Failed to create product:', error);
        return { success: false, error: 'Failed to create product' };
    }
}

export async function getProductsAction() {
    try {
        const products = ProductService.getProducts();
        return { success: true, products };
    } catch (error) {
        console.error('Failed to get products:', error);
        return { success: false, error: 'Failed to get products' };
    }
}

export async function getPosProductsAction() {
    try {
        const products = ProductService.getPosProducts();
        return { success: true, products };
    } catch (error) {
        console.error('Failed to get POS products:', error);
        return { success: false, error: 'Failed to get POS products' };
    }
}
