'use client';

import { Location } from '@/lib/services/warehouse-service';
import { ChevronRight, ChevronDown, MapPin } from 'lucide-react';
import { useState } from 'react';

interface LocationTreeProps {
    locations: Location[];
}

interface LocationNodeProps {
    location: Location;
    level: number;
}

function LocationNode({ location, level }: LocationNodeProps) {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = location.children && location.children.length > 0;

    return (
        <div>
            <div
                className="flex items-center gap-2 py-2 px-3 hover:bg-muted/50 rounded cursor-pointer"
                style={{ paddingLeft: `${level * 24 + 12}px` }}
                onClick={() => setExpanded(!expanded)}
            >
                {hasChildren ? (
                    expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                ) : (
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="font-medium">{location.name}</span>
                <span className="text-sm text-muted-foreground">({location.code})</span>
                <span className="text-xs px-2 py-1 bg-secondary rounded">{location.type}</span>
            </div>
            {hasChildren && expanded && (
                <div>
                    {location.children!.map(child => (
                        <LocationNode key={child.id} location={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function LocationTree({ locations }: LocationTreeProps) {
    return (
        <div className="space-y-1">
            {locations.map(location => (
                <LocationNode key={location.id} location={location} level={0} />
            ))}
        </div>
    );
}
