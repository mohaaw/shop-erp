'use client';

import React from 'react';
import { Account } from '@/lib/services/accounting-service';
import { ChevronRight, ChevronDown, Folder, FileText, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createAccountAction } from '@/app/actions/accounting-actions';

interface AccountNodeProps {
    account: Account;
    level: number;
}

const AccountNode: React.FC<AccountNodeProps> = ({ account, level }) => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const hasChildren = account.children && account.children.length > 0;

    return (
        <div className="select-none">
            <div
                className={cn(
                    "flex items-center py-2 px-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-md cursor-pointer",
                    level > 0 && "ml-6"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="w-6 h-6 flex items-center justify-center mr-2">
                    {hasChildren ? (
                        isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                    ) : (
                        <div className="w-4 h-4" />
                    )}
                </div>
                <div className="mr-2 text-secondary-500">
                    {account.isGroup ? <Folder className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div className="flex-1 flex items-center justify-between">
                    <span className="font-medium">
                        <span className="text-secondary-400 mr-2">{account.code}</span>
                        {account.name}
                    </span>
                    <span className="text-sm font-mono">
                        {account.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                </div>
                {account.isGroup && (
                    <div className="ml-4" onClick={(e) => e.stopPropagation()}>
                        <AddAccountDialog parentId={account.id} />
                    </div>
                )}
            </div>
            {isExpanded && hasChildren && (
                <div className="border-l border-secondary-200 dark:border-secondary-800 ml-5">
                    {account.children!.map(child => (
                        <AccountNode key={child.id} account={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export function ChartOfAccounts({ accounts }: { accounts: Account[] }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Chart of Accounts</h3>
                <AddAccountDialog />
            </div>
            <div className="border rounded-lg p-4 bg-white dark:bg-secondary-900">
                {accounts.map(account => (
                    <AccountNode key={account.id} account={account} level={0} />
                ))}
            </div>
        </div>
    );
}

function AddAccountDialog({ parentId }: { parentId?: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Account</DialogTitle>
                </DialogHeader>
                <form action={createAccountAction} className="space-y-4">
                    <input type="hidden" name="parentId" value={parentId || ''} />
                    <div className="space-y-2">
                        <Label>Account Name</Label>
                        <Input name="name" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Account Code</Label>
                        <Input name="code" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select name="type" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Asset">Asset</SelectItem>
                                <SelectItem value="Liability">Liability</SelectItem>
                                <SelectItem value="Equity">Equity</SelectItem>
                                <SelectItem value="Income">Income</SelectItem>
                                <SelectItem value="Expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="isGroup" id="isGroup" />
                        <Label htmlFor="isGroup">Is Group (Folder)</Label>
                    </div>
                    <Button type="submit" className="w-full">Create Account</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
