'use client';

import { useState, useEffect } from 'react';
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
import { PayrollFormValues, payrollSchema } from '@/lib/validations/hcm';
import { createPayrollAction } from '@/app/actions/hcm-actions';
import { Employee } from '@/lib/services/employee-service';

interface PayrollFormProps {
    employees: Employee[];
}

export function PayrollForm({ employees }: PayrollFormProps) {
    const t = useTranslations('HCM.payroll');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<PayrollFormValues>({
        resolver: zodResolver(payrollSchema),
        defaultValues: {
            employeeId: '',
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            basicSalary: 0,
            allowances: 0,
            deductions: 0,
            netSalary: 0,
            status: 'draft',
        },
    });

    // Auto-calculate net salary
    const basicSalary = form.watch('basicSalary');
    const allowances = form.watch('allowances');
    const deductions = form.watch('deductions');

    useEffect(() => {
        const net = (Number(basicSalary) || 0) + (Number(allowances) || 0) - (Number(deductions) || 0);
        form.setValue('netSalary', net);
    }, [basicSalary, allowances, deductions, form]);

    // Auto-fill basic salary when employee is selected
    const selectedEmployeeId = form.watch('employeeId');
    useEffect(() => {
        if (selectedEmployeeId) {
            const employee = employees.find(e => e.id === selectedEmployeeId);
            if (employee) {
                form.setValue('basicSalary', employee.salary || 0);
            }
        }
    }, [selectedEmployeeId, employees, form]);

    const onSubmit = async (data: PayrollFormValues) => {
        setLoading(true);
        try {
            await createPayrollAction(data);
            router.push('/dashboard/hcm/payroll');
            router.refresh();
        } catch (error) {
            console.error('Error creating payroll:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{t('newPayroll')}</h2>
                        <p className="text-muted-foreground">{t('newPayrollDesc')}</p>
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
                        <FormField
                            control={form.control}
                            name="employeeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('employee')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('selectEmployee')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {employees.map((employee) => (
                                                <SelectItem key={employee.id} value={employee.id}>
                                                    {employee.firstName} {employee.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="month"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('month')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" max="12" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('year')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="2000" max="2100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="basicSalary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('basicSalary')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="allowances"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('allowances')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="deductions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('deductions')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="netSalary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('netSalary')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" readOnly {...field} />
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
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="processed">Processed</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
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
