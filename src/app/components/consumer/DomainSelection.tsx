import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import {
  Heart,
  Stethoscope,
  Eye,
  Smile,
  Baby,
  HeartPulse,
  Droplet,
  ArrowRight,
  Bone,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const iconMap: Record<string, React.ComponentType<any>> = {
  stethoscope: Stethoscope,
  eye: Eye,
  smile: Smile,
  baby: Baby,
  'heart-pulse': HeartPulse,
  bone: Bone,
  droplet: Droplet,
};

export function DomainSelection() {
  const { domains } = useApp();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xl">AarogyaConnect</span>
          </div>
          <Link to="/admin/login">
            <Button variant="outline">{t('common.adminLogin')}</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl mb-4 max-w-3xl mx-auto">
            {t('home.heroTitle')}
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('home.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Domain Selection */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl mb-3">
              {t('home.sectionTitle')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('home.sectionSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {domains.map((domain) => {
              const IconComponent = iconMap[domain.icon] || Stethoscope;

              return (
                <Link key={domain.id} to={`/domain/${domain.id}`}>
                  <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                          <IconComponent className="w-8 h-8 text-green-600" />
                        </div>

                        {/* ✅ FIXED: use i18n keys */}
                        <h3 className="text-2xl mb-3">
                          {t(domain.nameKey)}
                        </h3>

                        <p className="text-base text-gray-600 mb-4">
                          {t(domain.descriptionKey)}
                        </p>

                        <div className="mt-auto pt-4">
                          <div className="inline-flex items-center gap-2 text-green-600">
                            <span className="text-sm">
                              {t('common.learnMore')}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl text-center mb-8">
              {t('home.whyChooseUs')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg mb-2">
                  {t('home.benefit1Title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.benefit1Desc')}
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg mb-2">
                  {t('home.benefit2Title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.benefit2Desc')}
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <HeartPulse className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg mb-2">
                  {t('home.benefit3Title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.benefit3Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-green-400" />
            <span className="text-xl">AarogyaConnect</span>
          </div>
          <p className="text-gray-400 mb-4">
            {t('footer.tagline')}
          </p>
          <p className="text-sm text-gray-500">
            © 2026 HealthCamp. {t('footer.rights')}
          </p>
        </div>
      </footer>
    </div>
  );
}
