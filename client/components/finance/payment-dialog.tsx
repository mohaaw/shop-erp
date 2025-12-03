'use client';

import { useState } from 'react';
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
import { registerPaymentAction } from '@/app/actions/payment-actions';

const paymentSchema = z.object({
    date: z.string(),
    amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
    paymentMethod: z.enum(['Cash', 'Bank']),
    reference: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentDialogProps {
    invoiceId: string;
    invoiceType: 'invoice' | 'purchase_invoice';
    totalAmount: number;
    onSuccess?: () => void;
}

export function PaymentDialog({ invoiceId, invoiceType, totalAmount, onSuccess }: PaymentDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            amount: totalAmount,
            paymentMethod: 'Bank',
            reference: '',
        },
    });

    const onSubmit = async (data: PaymentFormValues) => {
        setLoading(true);
        try {
            await registerPaymentAction({
                ...data,
                type: invoiceType === 'invoice' ? 'receive' : 'send',
                invoiceId,
                invoiceType,
            });
            setOpen(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Register Payment</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Register Payment</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Method</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Bank">Bank</SelectItem>
                                            <SelectItem value="Cash">Cash</SelectItem>
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
                                    <FormLabel>Reference</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Check No, Transaction ID" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Submit Payment"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
