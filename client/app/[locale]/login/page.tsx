'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
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
        callbackUrl: '/dashboard',
        email,
        password,
        code: twoFactorCode || undefined,
      });

      if (result?.error) {
        if (result.error === '2FA_REQUIRED') {
          setRequiresTwoFactor(true);
          setError('Please enter your 2FA code');
        } else if (result.error === 'INVALID_2FA_CODE') {
          setError('Invalid 2FA code. Please try again.');
        } else {
          setError(result.error);
        }
      } else {
        router.refresh();
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert(t('loginFailed'));
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
            {t('enterpriseResourcePlanning')}
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
                disabled={requiresTwoFactor}
              />

              {requiresTwoFactor && (
                <Input
                  label="2FA Code"
                  type="text"
                  placeholder="123456"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  maxLength={8}
                  required
                  autoFocus
                />
              )}

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
