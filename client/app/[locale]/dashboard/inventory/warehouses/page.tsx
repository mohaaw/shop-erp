import { getWarehousesAction } from '@/app/actions/inventory-actions';
import { WarehousesClient } from './warehouses-client';

export default async function WarehousesPage() {
    const warehouses = await getWarehousesAction();

    return <WarehousesClient warehouses={warehouses} />;
}
