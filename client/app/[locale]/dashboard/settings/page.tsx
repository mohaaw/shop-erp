import { redirect } from '@/i18n/navigation';

export default function SettingsPage({ params: { locale } }: { params: { locale: string } }) {
  redirect({ href: '/dashboard/settings/general', locale });
  return null;
}
