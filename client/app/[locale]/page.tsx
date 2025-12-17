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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(0deg,transparent,black)] -z-10" />
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-800 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
            <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2 animate-pulse"></span>
            v2.0 Enterprise Edition is Live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Simplify Retail. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
              Amplify Growth.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            The all-in-one ERP solution designed for modern retailers. manage inventory, sales, customers, and analytics from a single, intuitive interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                {t('hero.getStarted')}
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg backdrop-blur-sm">
                {t('hero.learnMore')}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl my-12">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Enterprise-Grade Features for High-Volume Retail
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Everything you need to run your business efficiently, securely, and at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50">
                <CardContent className="pt-8 pb-8 flex flex-col items-center text-center h-full">
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
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
