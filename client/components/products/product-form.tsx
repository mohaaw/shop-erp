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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { productSchema, ProductFormValues } from '@/lib/validations/product';
import { Loader2, Save, X } from 'lucide-react';

interface ProductFormProps {
    initialData?: ProductFormValues;
}

export function ProductForm({ initialData }: ProductFormProps) {
    const t = useTranslations('Products.form');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData || {
            name: '',
            description: '',
            price: 0,
            cost: 0,
            sku: '',
            barcode: '',
            stock: 0,
            category: '',
            status: 'active',
            image: '',
        },
    });

    const onSubmit = async (data: ProductFormValues) => {
        setLoading(true);
        try {
            // Mock API call
            console.log('Submitting product data:', data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push('/dashboard/products');
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
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="md:col-span-2">
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('description')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('descriptionPlaceholder')} {...field} />
                                        </FormControl>
                                        <FormDescription>{t('descriptionDesc')}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('price')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('cost')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormDescription>{t('costDesc')}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('stock')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('sku')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="SKU-123" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('category')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('selectCategory')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="electronics">Electronics</SelectItem>
                                                <SelectItem value="clothing">Clothing</SelectItem>
                                                <SelectItem value="furniture">Furniture</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('status')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('selectStatus')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">{t('active')}</SelectItem>
                                                <SelectItem value="draft">{t('draft')}</SelectItem>
                                                <SelectItem value="archived">{t('archived')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

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
