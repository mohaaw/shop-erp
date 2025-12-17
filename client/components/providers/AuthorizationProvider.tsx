'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface AuthorizationProviderProps {
  children: React.ReactNode;
  resource: string;
  action: string;
  fallback?: React.ReactNode;
}

export function AuthorizationProvider({
  children,
  resource,
  action,
  fallback
}: AuthorizationProviderProps) {
  const { data: session, status } = useSession();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations('Auth');

  useEffect(() => {
    const checkPermission = async () => {
      if (status === 'loading') {
        return;
      }

      if (!session?.user?.id) {
        setHasPermission(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/check-permission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resource,
            action
          }),
        });

        if (response.ok) {
          const { hasPermission } = await response.json();
          setHasPermission(hasPermission);
        } else {
          setHasPermission(false);
        }
      } catch (error) {
        console.error('Error checking permission:', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [session, status, resource, action]);

  if (status === 'loading' || loading) {
    // Show loading state or nothing while checking
    return <div className="flex items-center justify-center h-32">
      <p>Loading...</p>
    </div>;
  }

  if (hasPermission === false) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <Alert variant="error" className="max-w-md w-full">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-sm mb-4">
              {t('unauthorizedAccess')}
            </p>
            <Button onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}