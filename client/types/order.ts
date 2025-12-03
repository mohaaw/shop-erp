export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    productName?: string;
}

export interface Order {
    id: string;
    customerId?: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    items?: OrderItem[];
}

export interface OrderWithDetails extends Order {
    customerName?: string;
    customerEmail?: string;
    items: (OrderItem & { productSku?: string })[];
}
