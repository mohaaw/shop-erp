'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { updateStockAction, getLocationsAction } from '@/app/actions/inventory-actions';
import { Package, Loader2 } from 'lucide-react';
import { Product } from '@/types/product';

interface StockAdjustmentDialogProps {
    product: Product;
    trigger?: React.ReactNode;
}

export function StockAdjustmentDialog({ product, trigger }: StockAdjustmentDialogProps) {
    const t = useTranslations('Products'); // Assuming we have translations, or fallback
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState<any[]>([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [quantity, setQuantity] = useState(product.stock?.toString() || '0');

    useEffect(() => {
        if (open) {
            loadLocations();
            setQuantity(product.stock?.toString() || '0');
        }
    }, [open, product.stock]);

    const loadLocations = async () => {
        const result = await getLocationsAction();
        if (result.success && result.data) {
            setLocations(result.data.filter((l: any) => l.type === 'internal'));
            // Default to WH01/STOCK if available
            const defaultLoc = result.data.find((l: any) => l.code.endsWith('/STOCK'));
            if (defaultLoc) setSelectedLocation(defaultLoc.id);
            else if (result.data.length > 0) setSelectedLocation(result.data[0].id);
        }
    };

    const handleSave = async () => {
        if (!selectedLocation) return;
        setLoading(true);
        try {
            const qty = parseFloat(quantity);
            if (isNaN(qty)) return;

            const result = await updateStockAction(product.id, selectedLocation, qty);
            if (result.success) {
                setOpen(false);
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" title="Adjust Stock">
                        <Package className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Stock: {product.name}</DialogTitle>
                    <DialogDescription>
                        Adjust the physical stock quantity for this product.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                            Location
                        </Label>
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                                {locations.map((loc) => (
                                    <SelectItem key={loc.id} value={loc.id}>
                                        {loc.name} ({loc.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                            Quantity
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading || !selectedLocation}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
