import { Category } from '@/types/product';

// Mock data
let categories: Category[] = [
    {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Clothing',
        slug: 'clothing',
        description: 'Apparel for men and women',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Furniture, decor, and gardening tools',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const categoryService = {
    getCategories: async (): Promise<Category[]> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return categories;
    },

    getCategoryById: async (id: string): Promise<Category | undefined> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return categories.find((c) => c.id === id);
    },

    createCategory: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newCategory: Category = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        categories.push(newCategory);
        return newCategory;
    },

    updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const index = categories.findIndex((c) => c.id === id);
        if (index === -1) throw new Error('Category not found');

        categories[index] = {
            ...categories[index],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        return categories[index];
    },

    deleteCategory: async (id: string): Promise<void> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        categories = categories.filter((c) => c.id !== id);
    },
};
