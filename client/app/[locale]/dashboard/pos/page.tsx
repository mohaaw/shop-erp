'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, Trash2, CreditCard, Banknote } from 'lucide-react';
import { getPosProductsAction } from '@/app/actions/product-actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  posCategory?: string;
  toppings?: string;
}

interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedToppings?: string[];
}

export default function PosPage() {
  const t = useTranslations('Products'); // Reuse products translations for now
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<{ items: CartItem[], total: number, date: Date } | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await getPosProductsAction();
    if (res.success && res.products) {
      setProducts(res.products as Product[]);
    }
    setLoading(false);
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.posCategory).filter(Boolean)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || p.posCategory === category;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, cartId: Math.random().toString(), quantity: 1 }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15; // Mock 15% tax
  const total = subtotal + tax;

  const handlePayment = (method: 'cash' | 'card') => {
    console.log(`Paid ${total} via ${method}`);
    setLastOrder({ items: [...cart], total, date: new Date() });
    setCart([]);
    setPaymentModalOpen(false);
    setShowReceipt(true);
    // Here we would call createPosOrderAction
  };

  const printReceipt = () => {
    const receiptWindow = window.open('', '_blank', 'width=400,height=600');
    if (receiptWindow && lastOrder) {
      receiptWindow.document.write(`
                <html>
                    <head>
                        <title>Receipt</title>
                        <style>
                            body { font-family: monospace; padding: 20px; }
                            .header { text-align: center; margin-bottom: 20px; }
                            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
                            .total { border-top: 1px dashed black; margin-top: 10px; padding-top: 10px; font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h2>ERP-SHOP</h2>
                            <p>${lastOrder.date.toLocaleString()}</p>
                        </div>
                        <div class="items">
                            ${lastOrder.items.map(item => `
                                <div class="item">
                                    <span>${item.quantity}x ${item.name}</span>
                                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="total">
                            <div class="item">
                                <span>TOTAL</span>
                                <span>$${lastOrder.total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div style="text-align: center; margin-top: 20px;">
                            <p>Thank you for your business!</p>
                        </div>
                        <script>window.print();</script>
                    </body>
                </html>
            `);
      receiptWindow.document.close();
    }
    setShowReceipt(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Left: Product Grid */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Search & Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={category === cat ? "primary" : "outline"}
                onClick={() => setCategory(cat as string)}
                className="capitalize"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-3 gap-4 pb-4">
            {filteredProducts.map(product => (
              <Card
                key={product.id}
                className="cursor-pointer hover:border-primary transition-colors overflow-hidden"
                onClick={() => addToCart(product)}
              >
                <div className="h-32 bg-muted flex items-center justify-center text-muted-foreground">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <ShoppingCart className="h-8 w-8 opacity-20" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-primary font-bold">${product.price.toFixed(2)}</p>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Cart */}
      <Card className="w-[400px] flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Current Order
          </h2>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.cartId} className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">${item.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.cartId, -1)}>-</Button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.cartId, 1)}>+</Button>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeFromCart(item.cartId)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Cart is empty
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-muted/20 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (15%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            className="w-full h-12 text-lg"
            disabled={cart.length === 0}
            onClick={() => setPaymentModalOpen(true)}
          >
            Pay ${total.toFixed(2)}
          </Button>
        </div>
      </Card>

      {/* Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Method</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => handlePayment('cash')}
            >
              <Banknote className="h-8 w-8" />
              Cash
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => handlePayment('card')}
            >
              <CreditCard className="h-8 w-8" />
              Card
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPaymentModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Successful!</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center space-y-4">
            <div className="text-4xl">🎉</div>
            <p className="text-lg font-medium">Order Completed</p>
            <p className="text-muted-foreground">Total: ${lastOrder?.total.toFixed(2)}</p>
          </div>
          <DialogFooter className="sm:justify-center gap-2">
            <Button variant="outline" onClick={() => setShowReceipt(false)}>Close</Button>
            <Button onClick={printReceipt}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
