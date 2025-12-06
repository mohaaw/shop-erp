'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Paintbrush } from 'lucide-react';

interface ColorPickerProps {
    label: string;
    color: string;
    onChange: (color: string) => void;
}

export function ColorPicker({ label, color, onChange }: ColorPickerProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !color && 'text-muted-foreground'
                        )}
                    >
                        <div className="w-4 h-4 rounded-full mr-2 border" style={{ backgroundColor: color }} />
                        {color}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-2">
                            {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'].map((c) => (
                                <button
                                    key={c}
                                    className="w-6 h-6 rounded-full border hover:scale-110 transition-transform"
                                    style={{ backgroundColor: c }}
                                    onClick={() => onChange(c)}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <Paintbrush className="w-4 h-4 text-muted-foreground" />
                            <Input
                                type="color"
                                value={color}
                                onChange={(e) => onChange(e.target.value)}
                                className="h-8 w-full cursor-pointer"
                            />
                        </div>
                        <Input
                            value={color}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="#000000"
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
