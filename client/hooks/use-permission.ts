'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function usePermission(resource: string, action: string) {
  const { data: session, status } = useSession();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      if (status === 'loading' || !session?.user?.id) {
        setHasPermission(false);
        setLoading(true);
        return;
      }

      try {
        const response = await fetch('/api/check-permission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include authorization header if needed
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

    // Only check if session is loaded and user exists
    if (status !== 'loading' && session?.user?.id) {
      checkPermission();
    }
  }, [session, status, resource, action]);

  return { hasPermission, loading };
}