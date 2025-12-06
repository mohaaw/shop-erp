'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { createBOMAction } from '@/app/actions/manufacturing-actions';
import { toast } from 'sonner';

const bomSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    finishedProductId: z.string().min(1, 'Finished Product is required'),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    items: z.array(
        z.object({
            productId: z.string().min(1, 'Raw Material is required'),
            quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
        })
    ).min(1, 'At least one raw material is required'),
});

type BOMFormValues = z.infer<typeof bomSchema>;

import { Product } from '@/types/product';

interface BOMFormProps {
    products: Product[];
}

export function BOMForm({ products }: BOMFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<BOMFormValues>({
        resolver: zodResolver(bomSchema),
        defaultValues: {
            name: '',
            finishedProductId: '',
            quantity: 1,
            items: [{ productId: '', quantity: 1 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    });

    async function onSubmit(data: BOMFormValues) {
        try {
            setLoading(true);
            await createBOMAction({
                productId: data.finishedProductId,
                quantity: data.quantity,
                name: data.name,
                items: data.items,
            });
            toast.success('BOM created successfully');
            router.push('/dashboard/manufacturing/bom');
        } catch (error) {
            toast.error('Failed to create BOM');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Bill of Materials Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>BOM Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Standard Chair BOM" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="finishedProductId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Finished Product</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select product" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product.id} value={product.id}>
                                                        {product.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity Produced</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Raw Materials</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ productId: '', quantity: 1 })}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Material
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-end gap-4">
                                <FormField
                                    control={form.control}
                                    name={`items.${index}.productId`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Material</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select material" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {products.map((product) => (
                                                        <SelectItem key={product.id} value={product.id}>
                                                            {product.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`items.${index}.quantity`}
                                    render={({ field }) => (
                                        <FormItem className="w-32">
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="button"
                                    variant="danger"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create BOM'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
