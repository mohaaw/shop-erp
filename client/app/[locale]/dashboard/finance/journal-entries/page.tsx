import { getJournalEntriesAction } from '@/app/actions/accounting-actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function JournalEntriesPage() {
    const entries = await getJournalEntriesAction();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Journal Entries</h1>
                    <p className="text-muted-foreground">
                        View and manage financial transactions.
                    </p>
                </div>
                <Link href="/dashboard/finance/journal-entries/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Entry
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Entries</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No journal entries found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                entries.map((entry) => {
                                    const total = entry.items.reduce((sum, item) => sum + item.debit, 0);
                                    return (
                                        <TableRow key={entry.id}>
                                            <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                            <TableCell className="font-medium">{entry.reference || '-'}</TableCell>
                                            <TableCell>{entry.description || '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={entry.status === 'posted' ? 'default' : 'secondary'}>
                                                    {entry.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
