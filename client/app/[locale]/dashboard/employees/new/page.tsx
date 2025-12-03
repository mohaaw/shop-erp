'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/ui/back-button';
import { createEmployeeAction } from '@/app/actions/employee-actions';
import { toast } from 'sonner';

export default function NewEmployeePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            employeeNumber: formData.get('employeeNumber') as string,
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            departmentId: formData.get('departmentId') as string || undefined,
            designation: formData.get('designation') as string,
            dateOfJoining: formData.get('dateOfJoining') as string,
            salary: parseFloat(formData.get('salary') as string) || 0,
            status: 'active',
        };

        try {
            await createEmployeeAction(data);
            toast.success('Employee created successfully!');
            router.push('/dashboard/employees');
        } catch (error) {
            toast.error('Failed to create employee');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <BackButton fallbackUrl="/dashboard/employees" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Employee</h1>
                <p className="text-muted-foreground">Add a new employee to your organization</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Employee Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Employee Number *</label>
                                <Input name="employeeNumber" required placeholder="EMP001" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Input value="Active" disabled />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name *</label>
                                <Input name="firstName" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name *</label>
                                <Input name="lastName" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input name="email" type="email" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <Input name="phone" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Designation</label>
                                <Input name="designation" placeholder="Software Engineer" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date of Joining</label>
                                <Input name="dateOfJoining" type="date" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Department</label>
                                <Input name="departmentId" placeholder="Leave empty for now" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Salary</label>
                                <Input name="salary" type="number" step="0.01" defaultValue="0" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Employee'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
