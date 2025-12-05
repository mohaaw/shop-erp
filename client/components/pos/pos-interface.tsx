'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { createOrderAction } from '@/app/actions/order-actions';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface PosInterfaceProps {
    products: Product[];
}

interface CartItem {
    product: Product;
    quantity: number;
}

export function PosInterface({ products }: PosInterfaceProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);

        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                status: 'paid' as const, // POS orders are usually paid immediately
                paymentStatus: 'paid' as const
            };

            const result = await createOrderAction(orderData);

            if (result.success) {
                alert(`Order #${result.data?.id.slice(0, 8)} created successfully.`);
                setCart([]);
            } else {
                alert(result.error || "Failed to create order");
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] gap-4">
            {/* Product Grid */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <ScrollArea className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                        {filteredProducts.map(product => (
                            <Card
                                key={product.id}
                                className="cursor-pointer hover:border-primary transition-colors"
                                onClick={() => addToCart(product)}
                            >
                                <CardContent className="p-4 flex flex-col gap-2">
                                    <div className="aspect-square bg-secondary rounded-md overflow-hidden relative">
                                        {product.image ? (
                                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                IMG
                                            </div>
                                        )}
                                        {product.stock !== undefined && product.stock <= 0 && (
                                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                                <Badge variant="error">Out of Stock</Badge>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium truncate" title={product.name}>{product.name}</h3>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="font-bold">${product.price.toFixed(2)}</span>
                                            <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Cart */}
            <Card className="w-[350px] flex flex-col h-full">
                <div className="p-4 border-b">
                    <h2 className="font-semibold flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Current Order
                    </h2>
                </div>
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {cart.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                Cart is empty
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.product.id} className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">{item.product.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            ${item.product.price.toFixed(2)} x {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, -1)}>
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, 1)}>
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="text-right min-w-[60px]">
                                        <div className="font-medium text-sm">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive hover:text-destructive"
                                            onClick={() => removeFromCart(item.product.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-muted/50 space-y-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || loading}
                    >
                        {loading ? 'Processing...' : 'Checkout'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
