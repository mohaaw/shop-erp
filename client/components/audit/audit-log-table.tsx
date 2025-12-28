'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { DiffModal } from './diff-modal';

interface AuditLog {
    id: string;
    userId: string;
    userName?: string;
    action: string;
    entity: string;
    entityId: string;
    changes?: string;
    timestamp: string;
}

interface AuditLogTableProps {
    logs: AuditLog[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    const handleViewDiff = (log: AuditLog) => {
        setSelectedLog(log);
    };

    const getChanges = (log: AuditLog) => {
        if (!log.changes) return { old: '', new: '' };
        try {
            const changes = JSON.parse(log.changes);

            // If the changes are structured as { key: { old, new } }
            // Transform them into a readable string format for the diff viewer
            const oldObj: Record<string, unknown> = {};
            const newObj: Record<string, unknown> = {};

            Object.entries(changes).forEach(([key, value]) => {
                if (value && typeof value === 'object' && 'old' in value && 'new' in value) {
                    oldObj[key] = (value as { old: unknown }).old;
                    newObj[key] = (value as { new: unknown }).new;
                } else {
                    // Unstructured or simple diff
                    newObj[key] = value;
                }
            });

            return {
                old: JSON.stringify(oldObj, null, 2),
                new: JSON.stringify(newObj, null, 2)
            };
        } catch {
            return { old: '', new: log.changes };
        }
    };

    const { old: oldVal, new: newVal } = selectedLog ? getChanges(selectedLog) : { old: '', new: '' };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>Entity ID</TableHead>
                            <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="whitespace-nowrap">
                                    {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                                </TableCell>
                                <TableCell>{log.userName || log.userId}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        log.action === 'CREATE' ? 'success' :
                                            log.action === 'UPDATE' ? 'warning' :
                                                log.action === 'DELETE' ? 'error' : 'secondary'
                                    }>
                                        {log.action}
                                    </Badge>
                                </TableCell>
                                <TableCell>{log.entity}</TableCell>
                                <TableCell className="font-mono text-xs">{log.entityId.substring(0, 8)}...</TableCell>
                                <TableCell className="text-right">
                                    {log.changes && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewDiff(log)}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            Diff
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {logs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-secondary-500">
                                    No audit logs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DiffModal
                isOpen={!!selectedLog}
                onClose={() => setSelectedLog(null)}
                oldValue={oldVal}
                newValue={newVal}
                title={`${selectedLog?.action} ${selectedLog?.entity}`}
            />
        </>
    );
}
