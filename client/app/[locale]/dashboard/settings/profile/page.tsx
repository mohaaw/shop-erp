import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfileSettingsPage() {
    const t = useTranslations('Settings.profile');
    const tGeneral = useTranslations('Settings.general'); // Reuse save button

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">{t('title')}</h2>
                <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                    {t('subtitle')}
                </p>
            </div>

            <Separator />

            <div className="space-y-8 max-w-2xl">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <h3 className="font-medium text-secondary-900 dark:text-white">{t('avatar')}</h3>
                        <div className="flex gap-3">
                            <Button variant="outline" size="sm">Change</Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">Remove</Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">{t('fullName')}</Label>
                            <Input id="fullName" defaultValue="Admin User" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input id="email" type="email" defaultValue="admin@example.com" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">{t('bio')}</Label>
                        <Textarea
                            id="bio"
                            placeholder="Tell us a little about yourself"
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <Button>{tGeneral('save')}</Button>
                </div>
            </div>
        </div>
    );
}
