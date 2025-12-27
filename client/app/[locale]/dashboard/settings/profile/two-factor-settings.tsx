'use client';

import { useState, useTransition } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import {
    generateTwoFactorSecretAction,
    verifyTwoFactorTokenAction,
    disableTwoFactorAction,
    generateBackupCodesAction
} from '@/app/actions/auth-actions';
import { Loader2 } from 'lucide-react';
import { User } from '@/lib/services/user-service';

interface TwoFactorSettingsProps {
    user: User;
}

export function TwoFactorSettings({ user }: TwoFactorSettingsProps) {
    const [isEnabled, setIsEnabled] = useState(!!user.twoFactorEnabled);
    const [setupStep, setSetupStep] = useState<'idle' | 'qr' | 'backup'>('idle');
    const [secret, setSecret] = useState<{ secret: string; otpauthUrl: string } | null>(null);
    const [token, setToken] = useState('');
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const handleEnable = () => {
        startTransition(async () => {
            try {
                const data = await generateTwoFactorSecretAction();
                if (data.otpauthUrl) {
                    setSecret(data as { secret: string; otpauthUrl: string });
                } else {
                    toast.error('Failed to generate QR code');
                    return;
                }
                setSetupStep('qr');
            } catch {
                toast.error('Failed to start 2FA setup');
            }
        });
    };

    const handleVerify = () => {
        if (!secret) return;
        startTransition(async () => {
            try {
                const result = await verifyTwoFactorTokenAction(token, secret.secret);
                if (result.success) {
                    setIsEnabled(true);
                    toast.success('2FA enabled successfully');

                    // Generate backup codes immediately
                    const codes = await generateBackupCodesAction();
                    setBackupCodes(codes);
                    setSetupStep('backup');
                } else {
                    toast.error('Invalid code. Please try again.');
                }
            } catch {
                toast.error('Failed to verify code');
            }
        });
    };

    const handleDisable = () => {
        if (!confirm('Are you sure you want to disable 2FA? Your account will be less secure.')) return;

        startTransition(async () => {
            try {
                const result = await disableTwoFactorAction();
                if (result.success) {
                    setIsEnabled(false);
                    setSetupStep('idle');
                    setSecret(null);
                    setToken('');
                    toast.success('2FA disabled');
                }
            } catch {
                toast.error('Failed to disable 2FA');
            }
        });
    };

    const done = () => {
        setSetupStep('idle');
    };

    if (isEnabled && setupStep !== 'backup') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Your account is protected with 2FA.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Enabled
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="danger" onClick={handleDisable} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Disable 2FA
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent>
                {setupStep === 'idle' && (
                    <Button onClick={handleEnable} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enable 2FA
                    </Button>
                )}

                {setupStep === 'qr' && secret && (
                    <div className="space-y-4">
                        <div className="flex justify-center p-4 bg-white rounded-lg w-fit mx-auto">
                            <QRCodeSVG value={secret.otpauthUrl} size={192} />
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                            Scan this QR code with your authenticator app (e.g., Google Authenticator).
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="token">Verification Code</Label>
                            <Input
                                id="token"
                                placeholder="123456"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                maxLength={6}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleVerify} disabled={isPending || token.length !== 6}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify & Enable
                            </Button>
                            <Button variant="ghost" onClick={() => setSetupStep('idle')}>Cancel</Button>
                        </div>
                    </div>
                )}

                {setupStep === 'backup' && (
                    <div className="space-y-4">
                        <div className="p-4 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                            <h4 className="font-semibold mb-2">Backup Codes</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                                Save these codes in a safe place. You can use them to recover your account if you lose your device.
                            </p>
                            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                                {backupCodes.map((code, i) => (
                                    <div key={i} className="bg-background p-1 px-2 rounded border text-center select-all">
                                        {code}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button onClick={done}>I have saved my codes</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
