'use server';

import { CategoryService } from '@/lib/services/category-service';
import { Category } from '@/types/product';
import { revalidatePath } from 'next/cache';

export async function getCategoriesAction() {
    return CategoryService.getCategories();
}

export async function getCategoryAction(id: string) {
    return CategoryService.getCategory(id);
}

export async function createCategoryAction(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
    CategoryService.createCategory(data);
    revalidatePath('/dashboard/categories');
}

export async function updateCategoryAction(id: string, data: Partial<Category>) {
    CategoryService.updateCategory(id, data);
    revalidatePath('/dashboard/categories');
}

export async function deleteCategoryAction(id: string) {
    CategoryService.deleteCategory(id);
    revalidatePath('/dashboard/categories');
}
