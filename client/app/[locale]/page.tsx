'use client';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Zap,
  Shield,
  Globe,
  Smartphone,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Landing');

  const features = [
    {
      icon: LayoutDashboard,
      title: t('features.dashboard'),
      description: t('features.dashboardDesc'),
    },
    {
      icon: Package,
      title: t('features.products'),
      description: t('features.productsDesc'),
    },
    {
      icon: ShoppingCart,
      title: t('features.sales'),
      description: t('features.salesDesc'),
    },
    {
      icon: Users,
      title: t('features.crm'),
      description: t('features.crmDesc'),
    },
    {
      icon: Zap,
      title: t('features.pos'),
      description: t('features.posDesc'),
    },
    {
      icon: Shield,
      title: t('features.security'),
      description: t('features.securityDesc'),
    },
    {
      icon: Globe,
      title: t('features.multiLocation'),
      description: t('features.multiLocationDesc'),
    },
    {
      icon: Smartphone,
      title: t('features.responsive'),
      description: t('features.responsiveDesc'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-secondary-200 dark:border-secondary-800 bg-white/80 dark:bg-secondary-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">ES</span>
            </div>
            <span className="font-bold text-secondary-900 dark:text-white">ERP-SHOP</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">{t('nav.signIn')}</Button>
            </Link>
            <Link href="/dashboard">
              <Button>{t('nav.dashboard')}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 dark:text-white">
            {t('hero.titlePart1')}{' '}
            <span className="text-primary-600">{t('hero.titlePart2')}</span>
          </h1>
          <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">{t('hero.getStarted')}</Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline">
                {t('hero.learnMore')}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 dark:text-white mb-4">
            {t('features.title')}
          </h2>
          <p className="text-xl text-secondary-600 dark:text-secondary-400">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-primary-600 to-primary-800 border-0">
          <CardContent className="py-16">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {t('cta.title')}
              </h2>
              <p className="text-primary-100 text-lg max-w-2xl mx-auto">
                {t('cta.subtitle')}
              </p>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary">
                  {t('cta.startTrial')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-secondary-200 dark:border-secondary-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-secondary-600 dark:text-secondary-400">
            <p>{t('footer.copyright')}</p>
            <p className="text-sm mt-2">{t('footer.description')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
