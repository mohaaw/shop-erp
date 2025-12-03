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
