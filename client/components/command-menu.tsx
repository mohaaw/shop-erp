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
    Sun,
    Moon,
    Languages,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

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
    const { setTheme } = useTheme();
    const pathname = usePathname();

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

    const switchLocale = (newLocale: string) => {
        const segments = pathname.split('/');
        segments[1] = newLocale;
        router.push(segments.join('/'));
    };

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

                    <CommandGroup heading="Quick Actions">
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/pos'))}>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            <span>New Sale (POS)</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/products/new'))}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            <span>Add Product</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/crm/customers/new'))}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Add Customer</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/scm/purchase-orders/new'))}>
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>New Purchase Order</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Navigation">
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/products'))}>
                            <Package className="mr-2 h-4 w-4" />
                            <span>Products</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/sales'))}>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            <span>Sales</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/crm/customers'))}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Customers</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/inventory'))}>
                            <Box className="mr-2 h-4 w-4" />
                            <span>Inventory</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/scm/suppliers'))}>
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Suppliers</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/hcm/employees'))}>
                            <Users2 className="mr-2 h-4 w-4" />
                            <span>Employees</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/finance/payments'))}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            <span>Payments</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/reports'))}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            <span>Reports</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Settings & Appearance">
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/settings/profile'))}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/settings/general'))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>General Settings</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Light Mode</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Dark Mode</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => switchLocale('en'))}>
                            <Languages className="mr-2 h-4 w-4" />
                            <span>English</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => switchLocale('ar'))}>
                            <Languages className="mr-2 h-4 w-4" />
                            <span>Arabic</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
