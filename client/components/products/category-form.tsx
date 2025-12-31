'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { categorySchema, CategoryFormValues } from '@/lib/validations/product';
import { Loader2, Save, X } from 'lucide-react';
import { createCategoryAction, updateCategoryAction } from '@/app/actions/category-actions';

interface CategoryFormProps {
    initialData?: CategoryFormValues & { id?: string };
}

export function CategoryForm({ initialData }: CategoryFormProps) {
    const t = useTranslations('Categories');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData || {
            name: '',
            slug: '',
            description: '',
            parentId: '',
            image: '',
        },
    });

    const onSubmit = async (data: CategoryFormValues) => {
        setLoading(true);
        try {
            if (initialData?.id) {
                await updateCategoryAction(initialData.id, data);
            } else {
                await createCategoryAction(data);
            }
            router.push('/dashboard/categories');
            router.refresh();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('name')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('namePlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('slug')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('slugPlaceholder')} {...field} />
                                    </FormControl>
                                    <FormDescription>{t('slugDesc')}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('description')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('descriptionPlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                    >
                        <X className="mr-2 h-4 w-4" />
                        {t('cancel')}
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {t('save')}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
