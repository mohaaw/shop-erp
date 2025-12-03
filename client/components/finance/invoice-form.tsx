'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { createInvoiceAction } from '@/app/actions/invoice-actions';
import { useRouter } from 'next/navigation';
import { Customer } from '@/types/customer';
import { Product } from '@/types/product';

const invoiceSchema = z.object({
    number: z.string().min(1, "Invoice Number is required"),
    customerId: z.string().min(1, "Customer is required"),
    date: z.string(),
    dueDate: z.string(),
    items: z.array(z.object({
        productId: z.string().min(1, "Product is required"),
        description: z.string().optional(),
        quantity: z.coerce.number().min(1),
        unitPrice: z.coerce.number().min(0),
        taxRate: z.coerce.number().min(0).default(0),
    })).min(1, "At least one item is required"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
    customers: Customer[];
    products: Product[];
}

export function InvoiceForm({ customers, products }: InvoiceFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 days
            items: [
                { productId: '', description: '', quantity: 1, unitPrice: 0, taxRate: 0 },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const watchItems = form.watch("items");
    const totalAmount = watchItems.reduce((sum, item) => {
        const amount = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
        const tax = amount * ((Number(item.taxRate) || 0) / 100);
        return sum + amount + tax;
    }, 0);

    const handleProductChange = (index: number, productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            form.setValue(`items.${index}.unitPrice`, product.price);
            form.setValue(`items.${index}.description`, product.name);
            // Default tax?
        }
    };

    const onSubmit = async (data: InvoiceFormValues) => {
        setLoading(true);
        try {
            await createInvoiceAction({
                number: data.number,
                customerId: data.customerId,
                date: data.date,
                dueDate: data.dueDate,
            }, data.items.map(item => ({
                ...item,
                description: item.description || ''
            })));
            router.push('/dashboard/finance/invoices');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardContent className="p-6 grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="customerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Customer" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {customers.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Due Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Invoice Items</h3>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: '', description: '', quantity: 1, unitPrice: 0, taxRate: 0 })}>
                                <Plus className="w-4 h-4 mr-2" /> Add Item
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-2 items-end border-b pb-4 mb-4">
                                    <div className="col-span-4">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.productId`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Product</FormLabel>
                                                    <Select onValueChange={(val: string) => {
                                                        field.onChange(val);
                                                        handleProductChange(index, val);
                                                    }} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Product" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {products.map(p => (
                                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Description</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Description" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.quantity`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Qty</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min="1" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.unitPrice`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Price</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min="0" step="0.01" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.taxRate`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Tax %</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min="0" step="0.1" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-1 flex justify-end pb-2">
                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-4">
                            <div className="text-xl font-bold">
                                Total: {totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Draft Invoice"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
