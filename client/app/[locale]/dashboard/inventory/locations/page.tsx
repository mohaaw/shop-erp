import { getLocationsAction, getWarehousesAction } from '@/app/actions/warehouse-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationDialog } from '@/components/inventory/location-dialog';
import { LocationTree } from '@/components/inventory/location-tree';

export default async function LocationsPage() {
    const locations = await getLocationsAction();
    const warehouses = await getWarehousesAction();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Storage Locations</h1>
                    <p className="text-muted-foreground">
                        Manage zones, bins, and storage locations within warehouses.
                    </p>
                </div>
                <LocationDialog warehouses={warehouses} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Location Hierarchy</CardTitle>
                </CardHeader>
                <CardContent>
                    {locations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No locations found. Create your first location to get started.
                        </div>
                    ) : (
                        <LocationTree locations={locations} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
