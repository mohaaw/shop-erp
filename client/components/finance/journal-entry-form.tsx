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
import { createJournalEntryAction } from '@/app/actions/accounting-actions';
import { useRouter } from 'next/navigation';
import { Account } from '@/lib/services/accounting-service';

const journalEntrySchema = z.object({
    date: z.string(),
    reference: z.string().optional(),
    description: z.string().optional(),
    items: z.array(z.object({
        accountId: z.string().min(1, "Account is required"),
        debit: z.coerce.number().min(0),
        credit: z.coerce.number().min(0),
    })).min(2, "At least two lines are required"),
});

type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;

interface JournalEntryFormProps {
    accounts: Account[];
}

export function JournalEntryForm({ accounts }: JournalEntryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<JournalEntryFormValues>({
        resolver: zodResolver(journalEntrySchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            reference: '',
            description: '',
            items: [
                { accountId: '', debit: 0, credit: 0 },
                { accountId: '', debit: 0, credit: 0 },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const watchItems = form.watch("items");
    const totalDebit = watchItems.reduce((sum, item) => sum + (Number(item.debit) || 0), 0);
    const totalCredit = watchItems.reduce((sum, item) => sum + (Number(item.credit) || 0), 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    const onSubmit = async (data: JournalEntryFormValues) => {
        if (!isBalanced) {
            form.setError("root", { message: "Entry is not balanced" });
            return;
        }

        setLoading(true);
        try {
            await createJournalEntryAction({
                date: data.date,
                reference: data.reference || '',
                description: data.description || '',
                items: data.items,
            });
            router.push('/dashboard/finance/journal-entries');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Filter only leaf accounts (not groups)
    const leafAccounts = accounts.filter(acc => !acc.isGroup);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardContent className="p-6 grid grid-cols-3 gap-4">
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
                            name="reference"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reference</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. INV-001" {...field} />
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Opening Balance" {...field} />
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
                            <h3 className="font-semibold">Journal Items</h3>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ accountId: '', debit: 0, credit: 0 })}>
                                <Plus className="w-4 h-4 mr-2" /> Add Line
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <div className="grid grid-cols-12 gap-2 font-medium text-sm text-muted-foreground px-2">
                                <div className="col-span-6">Account</div>
                                <div className="col-span-2 text-right">Debit</div>
                                <div className="col-span-2 text-right">Credit</div>
                                <div className="col-span-2"></div>
                            </div>

                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                                    <div className="col-span-6">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.accountId`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Account" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {leafAccounts.map(acc => (
                                                                <SelectItem key={acc.id} value={acc.id}>
                                                                    {acc.code} - {acc.name}
                                                                </SelectItem>
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
                                            name={`items.${index}.debit`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" className="text-right" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.credit`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" className="text-right" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-8 pt-4 border-t mt-4 font-bold">
                            <div className={!isBalanced ? "text-destructive" : ""}>
                                Total Debit: {totalDebit.toFixed(2)}
                            </div>
                            <div className={!isBalanced ? "text-destructive" : ""}>
                                Total Credit: {totalCredit.toFixed(2)}
                            </div>
                        </div>
                        {!isBalanced && (
                            <div className="text-destructive text-sm text-right">
                                Entry must be balanced (Debit = Credit)
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading || !isBalanced}>
                        {loading ? "Posting..." : "Post Journal Entry"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
