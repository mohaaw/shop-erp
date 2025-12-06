'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Settings,
    User,
    Search,
    Package,
    ShoppingCart,
    Users,
    Box,
    Briefcase,
    Users2,
    DollarSign,
    BarChart3,
    PlusCircle,
    LayoutDashboard,
} from 'lucide-react';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function CommandMenu() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const t = useTranslations('Common');

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex text-sm text-muted-foreground">
                    {t('search')}...
                </span>
                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Pages">
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/dashboard'))}
                        >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/dashboard/products'))}
                        >
                            <Package className="mr-2 h-4 w-4" />
                            <span>Products</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/dashboard/sales'))}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            <span>Sales</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/dashboard/customers'))}
                        >
                            <Users className="mr-2 h-4 w-4" />
                            <span>Customers</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/dashboard/inventory'))}
                        >
                            <Box className="mr-2 h-4 w-4" />
                            <span>Inventory</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/dashboard/pos'))}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            <span>POS</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/dashboard/suppliers'))}
                        >
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Suppliers</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/dashboard/employees'))}
                        >
                            <Users2 className="mr-2 h-4 w-4" />
                            <span>Employees</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/dashboard/finance'))}
                        >
                            <DollarSign className="mr-2 h-4 w-4" />
                            <span>Finance</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/dashboard/reports'))}
                        >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            <span>Reports</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/dashboard/settings/general'))}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>General Settings</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/dashboard/settings/profile'))}
                        >
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
