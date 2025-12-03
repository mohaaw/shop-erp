'use client';

import { Account } from '@/lib/services/accounting-service';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Filter, X } from 'lucide-react';

export function GeneralLedgerFilters({ accounts }: { accounts: Account[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [accountId, setAccountId] = useState(searchParams.get('accountId') || 'all');
    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (accountId && accountId !== 'all') params.set('accountId', accountId);
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);

        router.push(`?${params.toString()}`);
    };

    const handleReset = () => {
        setAccountId('all');
        setStartDate('');
        setEndDate('');
        router.push('?');
    };

    return (
        <div className="flex flex-wrap gap-4 items-end bg-card p-4 rounded-lg border">
            <div className="w-[300px] space-y-2">
                <label className="text-sm font-medium">Account</label>
                <Select value={accountId} onValueChange={setAccountId}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Accounts" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Accounts</SelectItem>
                        {accounts.map(acc => (
                            <SelectItem key={acc.id} value={acc.id}>
                                {acc.code} - {acc.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <Button onClick={handleFilter}>
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                </Button>
                <Button variant="ghost" onClick={handleReset}>
                    <X className="w-4 h-4 mr-2" />
                    Reset
                </Button>
            </div>
        </div>
    );
}
