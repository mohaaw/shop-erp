'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus } from 'lucide-react';
import { createStockTransferAction, getLocationsAction } from '@/app/actions/warehouse-actions';
import { getProductsAction } from '@/app/actions/product-actions';
import { Location } from '@/lib/services/warehouse-service';
import { Product } from '@/types/product';

const transferSchema = z.object({
    productId: z.string().min(1, "Product is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    sourceLocationId: z.string().min(1, "Source location is required"),
    destLocationId: z.string().min(1, "Destination location is required"),
    reference: z.string().optional(),
});

type TransferFormValues = z.infer<typeof transferSchema>;

export function StockTransferDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        if (open) {
            Promise.all([
                getProductsAction(),
                getLocationsAction()
            ]).then(([productsData, locationsData]) => {
                setProducts((productsData.products || []) as Product[]);
                // Flatten location tree
                const flattenLocations = (locs: Location[]): Location[] => {
                    return locs.reduce((acc: Location[], loc) => {
                        acc.push(loc);
                        if (loc.children) {
                            acc.push(...flattenLocations(loc.children));
                        }
                        return acc;
                    }, []);
                };
                setLocations(flattenLocations(locationsData));
            });
        }
    }, [open]);

    const form = useForm<TransferFormValues>({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            productId: '',
            quantity: 1,
            sourceLocationId: '',
            destLocationId: '',
            reference: '',
        },
    });

    const onSubmit = async (data: TransferFormValues) => {
        setLoading(true);
        try {
            await createStockTransferAction({
                ...data,
                state: 'done',
                date: new Date().toISOString()
            });
            setOpen(false);
            form.reset();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Transfer
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Stock Transfer</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="productId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sourceLocationId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>From Location</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Source" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {locations.map(l => (
                                                <SelectItem key={l.id} value={l.id}>{l.name} ({l.code})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="destLocationId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>To Location</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Destination" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {locations.map(l => (
                                                <SelectItem key={l.id} value={l.id}>{l.name} ({l.code})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="reference"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reference (Optional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. TR-001" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Processing..." : "Create Transfer"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
