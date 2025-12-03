'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

import { ProductFormValues, productSchema } from '@/lib/validations/product';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Loader2, Save, X, Package, Tag, DollarSign, Store } from 'lucide-react';
import { AttributeManager } from './attribute-manager';
import { VariantMatrix } from './variant-matrix';
import { createProductAction } from '@/app/actions/product-actions';
import { uploadImageAction } from '@/app/actions/upload-actions';

interface ProductFormProps {
    initialData?: ProductFormValues;
}

export function ProductForm({ initialData }: ProductFormProps) {
    const t = useTranslations('Products');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData || {
            name: '',
            description: '',
            type: 'storable',
            status: 'active',
            sku: '',
            barcode: '',
            internalReference: '',
            price: 0,
            cost: 0,
            stock: 0,
            category: '',
            uom: 'unit',
            purchaseUom: 'unit',
            uomRatio: 1,
            weight: 0,
            volume: 0,
            dimensions: {
                width: 0,
                height: 0,
                depth: 0,
            },
            hsCode: '',
            countryOfOrigin: '',
            tracking: 'none',
            availableInPos: true,
            hasVariants: false,
            attributes: [],
            minStock: 0,
            images: [],
            incomeAccount: '',
            expenseAccount: '',
            customerTaxes: [],
            vendorTaxes: [],
            toppings: '',
            isCombo: false,
            comboItems: '',
        },
    });

    const onSubmit = async (data: ProductFormValues) => {
        setLoading(true);
        try {


            const result = await createProductAction(data);
            if (result.success) {
                router.push('/dashboard/products');
                router.refresh();
            } else {
                console.error(result.error);
                // Show error toast
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{initialData ? t('editPage.title') : t('new.title')}</h2>
                        <p className="text-muted-foreground">{initialData ? t('editPage.subtitle') : t('new.subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            <X className="mr-2 h-4 w-4" />
                            {t('form.cancel')}
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            {t('form.save')}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('form.name')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('form.namePlaceholder')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Images</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const formData = new FormData();
                                                                formData.append('file', file);
                                                                const result = await uploadImageAction(formData);
                                                                if (result.success && result.url) {
                                                                    const currentImages = Array.isArray(field.value) ? field.value : (field.value ? [field.value] : []);
                                                                    const newImages = [...currentImages, result.url];
                                                                    field.onChange(newImages);
                                                                } else {
                                                                    console.error(result.error);
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <Textarea
                                                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                                        className="resize-none"
                                                        value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                                                        onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Upload an image or enter URLs (comma separated).
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="storable">Storable Product</SelectItem>
                                                        <SelectItem value="consumable">Consumable</SelectItem>
                                                        <SelectItem value="service">Service</SelectItem>
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
                                                <FormLabel>{t('form.status')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('form.selectStatus')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="active">{t('form.active')}</SelectItem>
                                                        <SelectItem value="draft">{t('form.draft')}</SelectItem>
                                                        <SelectItem value="archived">{t('form.archived')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full grid-cols-6">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="variants">Variants</TabsTrigger>
                                <TabsTrigger value="sales">Sales</TabsTrigger>
                                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                <TabsTrigger value="accounting">Accounting</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Tag className="h-5 w-5" />
                                            Product Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="brand"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Brand</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. Dell, HP, Apple" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="model"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Model</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. XPS 15, MacBook Pro" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="warranty"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Warranty Info</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. 2 Years Manufacturer" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="specifications"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Specifications (JSON or Text)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder='{"CPU": "i9", "RAM": "32GB"} or just text description'
                                                            className="min-h-[150px] font-mono"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Enter technical specifications. You can use JSON format for structured data.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="general" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5" />
                                            Pricing & UOM
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t('form.price')}</FormLabel>
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
                                                        <FormLabel>{t('form.cost')}</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" step="0.01" {...field} />
                                                        </FormControl>
                                                        <FormDescription>{t('form.costDesc')}</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('form.category')}</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={t('form.selectCategory')} />
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

                                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                            <FormField
                                                control={form.control}
                                                name="uom"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Unit of Measure</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select unit" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="unit">Unit</SelectItem>
                                                                <SelectItem value="dozen">Dozen</SelectItem>
                                                                <SelectItem value="box">Box</SelectItem>
                                                                <SelectItem value="kg">Kg</SelectItem>
                                                                <SelectItem value="g">Gram</SelectItem>
                                                                <SelectItem value="l">Liter</SelectItem>
                                                                <SelectItem value="m">Meter</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription>Unit for selling</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="purchaseUom"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Purchase UOM</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select unit" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="unit">Unit</SelectItem>
                                                                <SelectItem value="dozen">Dozen</SelectItem>
                                                                <SelectItem value="box">Box</SelectItem>
                                                                <SelectItem value="kg">Kg</SelectItem>
                                                                <SelectItem value="g">Gram</SelectItem>
                                                                <SelectItem value="l">Liter</SelectItem>
                                                                <SelectItem value="m">Meter</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription>Unit for buying</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="uomRatio"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Ratio</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" step="0.01" {...field} />
                                                        </FormControl>
                                                        <FormDescription>1 Purchase Unit = X Base Units</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="variants" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Tag className="h-5 w-5" />
                                            Product Attributes
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="hasVariants"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">Enable Variants</FormLabel>
                                                        <FormDescription>
                                                            Does this product have multiple options like size or color?
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        {form.watch('hasVariants') && (
                                            <FormField
                                                control={form.control}
                                                name="attributes"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="space-y-6">
                                                                <AttributeManager
                                                                    attributes={field.value || []}
                                                                    onChange={field.onChange}
                                                                />
                                                                {field.value && field.value.length > 0 && (
                                                                    <VariantMatrix attributes={field.value} />
                                                                )}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="sales" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Store className="h-5 w-5" />
                                            Point of Sale
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="availableInPos"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">Available in POS</FormLabel>
                                                        <FormDescription>
                                                            Show this product in the Point of Sale interface
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="posCategory"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>POS Category</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select POS Category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="drinks">Drinks</SelectItem>
                                                            <SelectItem value="food">Food</SelectItem>
                                                            <SelectItem value="merch">Merch</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="toppings"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Toppings / Modifiers</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Extra Cheese, No Ice, Spicy (comma separated)"
                                                            className="resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        List available modifiers for this product.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="border-t pt-4 mt-4 space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="isCombo"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">Combo Meal</FormLabel>
                                                            <FormDescription>
                                                                Is this a bundle of other products?
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {form.watch('isCombo') && (
                                                <FormField
                                                    control={form.control}
                                                    name="comboItems"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Combo Items</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Burger, Fries, Coke (comma separated)"
                                                                    className="resize-none"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                List the items included in this combo.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="inventory" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            Logistics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="minStock"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Low Stock Alert (Reorder Point)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Alert when stock falls below this quantity.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="weight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Weight (kg)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="volume"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Volume (m³)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.001" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="col-span-2 grid grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="dimensions.width"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Width (cm)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" step="0.1" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="dimensions.height"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Height (cm)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" step="0.1" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="dimensions.depth"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Depth (cm)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" step="0.1" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="hsCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>HS Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. 8518.30" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Harmonized System Code for customs</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="countryOfOrigin"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Country of Origin</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. US, CN, DE" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="tracking"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Traceability</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select tracking method" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="none">No Tracking</SelectItem>
                                                            <SelectItem value="lot">By Lots</SelectItem>
                                                            <SelectItem value="serial">By Unique Serial Number</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="accounting" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5" />
                                            Accounting
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="incomeAccount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Income Account</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Income Account" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="400000">400000 Product Sales</SelectItem>
                                                            <SelectItem value="400100">400100 Service Revenue</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="expenseAccount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Expense Account</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Expense Account" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="600000">600000 Cost of Goods Sold</SelectItem>
                                                            <SelectItem value="600100">600100 Service Costs</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Identification</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="sku"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('form.sku')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="SKU-123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="barcode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Barcode</FormLabel>
                                            <FormControl>
                                                <Input placeholder="EAN-13 / UPC" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="internalReference"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Internal Reference</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Factory Code" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form >
    );
}
