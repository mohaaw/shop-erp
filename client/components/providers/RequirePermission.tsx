'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RequirePermissionProps {
  children: React.ReactNode;
  resource: string;
  action: string;
  redirectTo?: string;
}

export function RequirePermission({
  children,
  resource,
  action,
  redirectTo = '/login'
}: RequirePermissionProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkPermission = async () => {
      if (status === 'loading') return;

      if (!session?.user?.id) {
        router.push(redirectTo);
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
          if (!hasPermission) {
            router.push('/dashboard'); // Redirect to dashboard if no permission
          }
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking permission:', error);
        router.push('/dashboard');
      }
    };

    checkPermission();
  }, [session, status, resource, action, redirectTo, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}