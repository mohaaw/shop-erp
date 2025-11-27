'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mock login - replace with actual API call
      if (email === 'admin@example.com' && password === 'password123') {
        localStorage.setItem('auth_token', 'mock-token-123');
        window.location.href = '/dashboard';
      } else {
        setError('Invalid email or password');
      }
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
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="error">{error}</Alert>}

              <Input
                label="Email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" fullWidth loading={loading}>
                Sign In
              </Button>

              <div className="text-center text-sm text-secondary-600 dark:text-secondary-400">
                Demo credentials: admin@example.com / password123
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-sm text-secondary-600 dark:text-secondary-400">
          <p>© 2025 ERP-SHOP. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
