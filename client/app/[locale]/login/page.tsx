'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(t('invalidCredentials'));
      } else {
        router.refresh();
        router.push(`/${locale}/dashboard`);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-secondary-900 dark:to-secondary-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary-900 dark:text-white mb-2">
            ERP-SHOP
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Enterprise Resource Planning for Retail
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('welcomeBack')}</CardTitle>
            <CardDescription>{t('signInSubtitle')}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="error">{error}</Alert>}

              <Input
                label={t('email')}
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label={t('password')}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" fullWidth loading={loading}>
                {t('signIn')}
              </Button>

              <div className="text-center text-sm text-secondary-600 dark:text-secondary-400">
                {t('demoCredentials')}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-sm text-secondary-600 dark:text-secondary-400">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </div>
  );
}
