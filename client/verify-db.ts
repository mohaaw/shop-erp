import { inventoryService } from './lib/services/inventory-service';

async function main() {
    try {
        console.log('Checking existing warehouses...');
        const existing = inventoryService.getWarehouses();
        if (existing.length > 0) {
            console.log('Warehouses exist:', existing);
            return;
        }

        console.log('Creating warehouse...');
        const wh = inventoryService.createWarehouse({
            name: 'Main Warehouse',
            code: 'WH01'
        });
        console.log('Created warehouse:', wh);

        const locations = inventoryService.getLocations(wh.id);
        console.log('Locations:', locations);

    } catch (e) {
        console.error('Error:', e);
    }
}

main();
