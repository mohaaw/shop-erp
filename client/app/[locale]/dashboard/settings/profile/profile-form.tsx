'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateProfileAction } from '@/app/actions/user-actions';
import { toast } from 'sonner';
import { User } from '@/lib/services/user-service';
import { useRouter } from 'next/navigation';

interface ProfileFormProps {
    user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
    const t = useTranslations('Settings.profile');
    const tGeneral = useTranslations('Settings.general');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');

    async function onSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            const data = {
                name: formData.get('fullName') as string,
                email: formData.get('email') as string,
                bio: formData.get('bio') as string,
                avatar: avatarUrl, // Use the state for avatar
            };

            const result = await updateProfileAction(user.id, data);

            if (result.success) {
                toast.success(t('updateSuccess'));
                router.refresh();
            } else {
                toast.error(t('updateError'));
            }
        } catch {
            toast.error(t('updateError'));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form action={onSubmit} className="space-y-8 max-w-2xl">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarUrl || "https://github.com/shadcn.png"} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                    <h3 className="font-medium text-secondary-900 dark:text-white">{t('avatar')}</h3>
                    <div className="flex gap-3 items-center">
                        <Input
                            placeholder="Avatar URL"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className="w-[300px]"
                        />
                        {/* <Button variant="outline" size="sm" type="button">Change</Button> */}
                        {/* <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" type="button">Remove</Button> */}
                    </div>
                    <p className="text-xs text-muted-foreground">Enter an image URL for your avatar.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">{t('fullName')}</Label>
                        <Input id="fullName" name="fullName" defaultValue={user.name} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input id="email" name="email" type="email" defaultValue={user.email} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">{t('bio')}</Label>
                    <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us a little about yourself"
                        className="min-h-[100px]"
                        defaultValue={user.bio || ''}
                    />
                </div>
            </div>

            <div className="pt-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? tGeneral('saving') : tGeneral('save')}
                </Button>
            </div>
        </form>
    );
}
