'use client';

// import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { ColorPicker } from '@/components/color-picker';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AppearancePage() {
    // const t = useTranslations('Settings');
    const { primaryColor, secondaryColor, updateSettings } = useSettingsStore();
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateSettings({ primaryColor, secondaryColor });
            toast.success('Theme updated successfully');
        } catch {
            toast.error('Failed to update theme');
        } finally {
            setLoading(false);
        }
    };

    const presets = [
        { name: 'Ocean', primary: '#3B82F6', secondary: '#64748B' },
        { name: 'Forest', primary: '#10B981', secondary: '#71717A' },
        { name: 'Sunset', primary: '#F59E0B', secondary: '#78716C' },
        { name: 'Royal', primary: '#8B5CF6', secondary: '#52525B' },
        { name: 'Rose', primary: '#EC4899', secondary: '#71717A' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                    Customize the look and feel of your application.
                </p>
            </div>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Theme Colors</CardTitle>
                        <CardDescription>
                            Choose your primary and secondary brand colors.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ColorPicker
                                label="Primary Color"
                                color={primaryColor}
                                onChange={(c) => useSettingsStore.setState({ primaryColor: c })}
                            />
                            <ColorPicker
                                label="Secondary Color"
                                color={secondaryColor}
                                onChange={(c) => useSettingsStore.setState({ secondaryColor: c })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Presets</CardTitle>
                        <CardDescription>
                            Quickly switch between predefined color themes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {presets.map((preset) => (
                                <Button
                                    key={preset.name}
                                    variant="outline"
                                    className="h-24 flex flex-col gap-2"
                                    onClick={() => {
                                        useSettingsStore.setState({
                                            primaryColor: preset.primary,
                                            secondaryColor: preset.secondary,
                                        });
                                    }}
                                >
                                    <div className="flex gap-1">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: preset.primary }}
                                        />
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: preset.secondary }}
                                        />
                                    </div>
                                    {preset.name}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
