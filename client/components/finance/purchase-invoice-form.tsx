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
import { createPurchaseInvoiceAction } from '@/app/actions/purchase-invoice-actions';
import { useRouter } from 'next/navigation';
import { Supplier } from '@/lib/services/supplier-service';
import { Account } from '@/lib/services/accounting-service';

const invoiceSchema = z.object({
    number: z.string().min(1, "Bill Number is required"),
    supplierId: z.string().min(1, "Supplier is required"),
    date: z.string(),
    dueDate: z.string(),
    items: z.array(z.object({
        description: z.string().min(1, "Description is required"),
        accountId: z.string().min(1, "Account is required"),
        quantity: z.coerce.number().min(1),
        unitPrice: z.coerce.number().min(0),
    })).min(1, "At least one item is required"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface PurchaseInvoiceFormProps {
    suppliers: Supplier[];
    accounts: Account[];
}

export function PurchaseInvoiceForm({ suppliers, accounts }: PurchaseInvoiceFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Filter for Expense accounts
    const expenseAccounts = accounts.filter(a => a.type === 'Expense' || a.type === 'Asset');

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            number: `BILL-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            items: [
                { description: '', accountId: '', quantity: 1, unitPrice: 0 },
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
        return sum + amount;
    }, 0);

    const onSubmit = async (data: InvoiceFormValues) => {
        setLoading(true);
        try {
            await createPurchaseInvoiceAction({
                number: data.number,
                supplierId: data.supplierId,
                date: data.date,
                dueDate: data.dueDate,
            }, data.items);
            router.push('/dashboard/finance/purchase-invoices');
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
                            name="supplierId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Supplier</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Supplier" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {suppliers.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
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
                                    <FormLabel>Bill Number</FormLabel>
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
                            <h3 className="font-semibold">Bill Items</h3>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ description: '', accountId: '', quantity: 1, unitPrice: 0 })}>
                                <Plus className="w-4 h-4 mr-2" /> Add Item
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-2 items-end border-b pb-4 mb-4">
                                    <div className="col-span-4">
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
                                    <div className="col-span-3">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.accountId`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Account</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Account" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {expenseAccounts.map(a => (
                                                                <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-2">
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
                        {loading ? "Creating..." : "Create Draft Bill"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
