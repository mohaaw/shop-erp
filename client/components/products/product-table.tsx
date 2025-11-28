'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { Product } from '@/types/product';
import { Link } from '@/i18n/navigation';

interface ProductTableProps {
    data: Product[];
}

export function ProductTable({ data }: ProductTableProps) {
    const t = useTranslations('Products');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">{t('image')}</TableHead>
                            <TableHead>{t('name')}</TableHead>
                            <TableHead>{t('sku')}</TableHead>
                            <TableHead>{t('category')}</TableHead>
                            <TableHead>{t('price')}</TableHead>
                            <TableHead>{t('stock')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead className="text-right">{t('actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    {t('noResults')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="w-12 h-12 bg-secondary-100 rounded-md flex items-center justify-center text-secondary-400">
                                            {/* Placeholder for image */}
                                            IMG
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.sku}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>${product.price.toFixed(2)}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>
                                        <Badge variant={product.status === 'active' ? 'success' : 'secondary'}>
                                            {t(`status.${product.status}`)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/products/${product.id}`}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        {t('edit')}
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    {t('delete')}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
