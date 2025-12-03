'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Globe, Loader2, Save, Search } from 'lucide-react';
import { TranslationTerm } from '@/lib/services/translation-service';
import { getTranslationsAction, updateTranslationAction } from '@/app/actions/translation-actions';

export function TranslationEditor() {
    const locale = useLocale();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [terms, setTerms] = useState<TranslationTerm[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        loadTerms();
    }, [locale]);

    const loadTerms = async () => {
        setLoading(true);
        try {
            const data = await getTranslationsAction(locale);
            const termList = Object.entries(data).map(([key, value]) => ({
                key,
                value: value as string
            }));
            setTerms(termList);
        } catch (error) {
            console.error('Failed to load translations:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTerms = terms.filter(term =>
        term.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (term: TranslationTerm) => {
        setEditingId(term.key);
        setEditValue(term.value);
    };

    const handleSave = async (key: string) => {
        setSaving(true);
        try {
            await updateTranslationAction(key, editValue, locale);

            // Update local state
            setTerms(terms.map(t =>
                t.key === key ? { ...t, value: editValue } : t
            ));
            setEditingId(null);
        } catch (error) {
            console.error('Failed to save translation:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Translation Editor</h2>
                    <p className="text-muted-foreground">
                        Translate the application interface directly.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm py-1 px-3">
                        <Globe className="w-3 h-3 mr-2" />
                        Current Language: {locale.toUpperCase()}
                    </Badge>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search terms..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px]">Source Term (English)</TableHead>
                                        <TableHead>Translation</TableHead>
                                        <TableHead className="w-[100px]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTerms.map((term) => (
                                        <TableRow key={term.key}>
                                            <TableCell className="font-medium">{term.key}</TableCell>
                                            <TableCell>
                                                {editingId === term.key ? (
                                                    <Input
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSave(term.key);
                                                            if (e.key === 'Escape') setEditingId(null);
                                                        }}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span
                                                        className="cursor-pointer hover:underline decoration-dotted"
                                                        onClick={() => handleEdit(term)}
                                                    >
                                                        {term.value}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingId === term.key ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSave(term.key)}
                                                        disabled={saving}
                                                    >
                                                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(term)}
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredTerms.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                                No terms found matching &quot;{searchQuery}&quot;
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )
                    }
                </CardContent >
            </Card >
        </div >
    );
}
