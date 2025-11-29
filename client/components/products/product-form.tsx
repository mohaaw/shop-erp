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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { productSchema, ProductFormValues } from '@/lib/validations/product';
import { Loader2, Save, X, Package, Tag, Barcode, Scale, Ruler, Truck, DollarSign, Store } from 'lucide-react';
import { AttributeManager } from './attribute-manager';

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
            tracking: 'none',
            availableInPos: true,
            hasVariants: false,
            attributes: [],
        },
    });

    const onSubmit = async (data: ProductFormValues) => {
        setLoading(true);
        try {
            console.log('Submitting God-Tier product data:', data);
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
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="variants">Variants</TabsTrigger>
                                <TabsTrigger value="sales">Sales</TabsTrigger>
                                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                <TabsTrigger value="accounting">Accounting</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5" />
                                            Pricing
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
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
                                        <FormField
                                            control={form.control}
                                            name="uom"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Unit of Measure</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select UOM" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="unit">Unit(s)</SelectItem>
                                                            <SelectItem value="kg">kg</SelectItem>
                                                            <SelectItem value="m">m</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
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
                                                            <AttributeManager
                                                                attributes={field.value || []}
                                                                onChange={field.onChange}
                                                            />
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
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="customerTaxes"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Customer Taxes</FormLabel>
                                                        <Select onValueChange={(val) => field.onChange([...(field.value || []), val])}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Add Customer Tax" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="vat_15">VAT 15%</SelectItem>
                                                                <SelectItem value="vat_5">VAT 5%</SelectItem>
                                                                <SelectItem value="exempt">Exempt</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {field.value?.map((tax, index) => (
                                                                <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1">
                                                                    {tax}
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-4 w-4 ml-1 hover:bg-transparent"
                                                                        onClick={() => {
                                                                            const newTaxes = [...(field.value || [])];
                                                                            newTaxes.splice(index, 1);
                                                                            field.onChange(newTaxes);
                                                                        }}
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </Button>
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
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
        </Form>
    );
}
