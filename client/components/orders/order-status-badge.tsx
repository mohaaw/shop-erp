import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
    status: string;
    type?: 'order' | 'payment';
}

export function OrderStatusBadge({ status, type = 'order' }: OrderStatusBadgeProps) {
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'error' | 'info' = 'default';

    const s = status.toLowerCase();

    if (type === 'order') {
        if (s === 'pending') variant = 'warning';
        else if (s === 'paid') variant = 'success';
        else if (s === 'shipped') variant = 'info';
        else if (s === 'cancelled') variant = 'error';
        else if (s === 'completed') variant = 'success';
    } else {
        // Payment
        if (s === 'unpaid') variant = 'error';
        else if (s === 'paid') variant = 'success';
        else if (s === 'refunded') variant = 'warning';
    }

    return (
        <Badge variant={variant} className="capitalize">
            {status}
        </Badge>
    );
}
