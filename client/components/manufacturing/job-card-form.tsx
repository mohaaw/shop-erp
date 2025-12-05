'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Loader2, Save, X } from 'lucide-react';
import { JobCardFormValues, jobCardSchema } from '@/lib/validations/manufacturing';
import { createJobCardAction } from '@/app/actions/manufacturing-actions';
import { ProductionOrder, Workstation } from '@/lib/services/manufacturing-service';

interface JobCardFormProps {
    productionOrders: ProductionOrder[];
    workstations: Workstation[];
}

export function JobCardForm({ productionOrders, workstations }: JobCardFormProps) {
    const t = useTranslations('Manufacturing.jobCards');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<JobCardFormValues>({
        resolver: zodResolver(jobCardSchema),
        defaultValues: {
            productionOrderId: '',
            workstationId: '',
            operation: '',
            status: 'pending',
            startTime: '',
            endTime: '',
        },
    });

    const onSubmit = async (data: JobCardFormValues) => {
        setLoading(true);
        try {
            await createJobCardAction(data);
            router.push('/dashboard/manufacturing/job-cards');
            router.refresh();
        } catch (error) {
            console.error('Error creating job card:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{t('newJobCard')}</h2>
                        <p className="text-muted-foreground">{t('newJobCardDesc')}</p>
                    </div>
                    <div className="flex items-center gap-4">
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
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('details')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="productionOrderId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('productionOrder')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('selectProductionOrder')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {productionOrders.map((order) => (
                                                    <SelectItem key={order.id} value={order.id}>
                                                        {order.number} ({order.productName})
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
                                name="workstationId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('workstation')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('selectWorkstation')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {workstations.map((ws) => (
                                                    <SelectItem key={ws.id} value={ws.id}>
                                                        {ws.name} ({ws.code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="operation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('operation')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('operationPlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('startTime')}</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('endTime')}</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="on_hold">On Hold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
