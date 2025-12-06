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

    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            // Create a preview URL
            const url = URL.createObjectURL(file);
            setAvatarUrl(url);
        }
    };

    async function onSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            // Append the file and the current avatar URL (which might be a text URL)
            // If a file was selected, we append it.
            if (avatarFile) {
                formData.append('avatarFile', avatarFile);
            }
            // We also send the 'avatar' text field which contains the URL (or the preview URL, but backend handles precedence)
            // Actually, if we have a file, the backend ignores the 'avatar' string for the final path, 
            // but if we DON'T have a file, we want the 'avatar' string to be saved.
            // The formData already contains 'avatar' from the input field if we name it 'avatar'.
            // Let's ensure the input has name='avatar'.

            // However, the avatar input is controlled by state `avatarUrl`. 
            // We should ensure it's in the formData.
            formData.set('avatar', avatarUrl);

            const result = await updateProfileAction(user.id, formData);

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
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2 items-center">
                            <Input
                                placeholder="Avatar URL"
                                value={avatarUrl}
                                name="avatar"
                                onChange={(e) => {
                                    setAvatarUrl(e.target.value);
                                    setAvatarFile(null); // Clear file if URL is manually changed
                                }}
                                className="w-[300px]"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">OR</span>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-[300px]"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Enter an image URL or upload a file.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">{t('fullName')}</Label>
                        <Input id="fullName" name="name" defaultValue={user.name} required />
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
