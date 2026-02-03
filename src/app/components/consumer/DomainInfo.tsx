import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Heart, ArrowLeft, AlertCircle, CheckCircle2, Stethoscope, Eye, Smile, Baby, HeartPulse, Droplet, Bone } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  stethoscope: Stethoscope,
  eye: Eye,
  smile: Smile,
  baby: Baby,
  'heart-pulse': HeartPulse,
  bone: Bone,
  droplet: Droplet,
};

export function DomainInfo() {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const { getDomainById, getProvidersByDomain } = useApp();

  const domain = getDomainById(domainId || '');
  const providers = getProvidersByDomain(domainId || '');

  if (!domain) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-500 mb-4">Domain not found</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const IconComponent = iconMap[domain.icon] || Stethoscope;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xl">AarogyaConnect</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Domain Header */}
          <Card>
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <IconComponent className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-4xl md:text-5xl mb-4">{domain.name}</h1>
                <p className="text-xl text-gray-600">{domain.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl mb-4">About {domain.name}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{domain.detailedInfo}</p>
            </CardContent>
          </Card>

          {/* Common Conditions */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl mb-6">Common Conditions We Treat</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {domain.commonConditions.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-base">{condition}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* When to Visit */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl mb-6">When Should You Visit?</h2>
              <div className="space-y-3">
                {domain.whenToVisit.map((reason, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-base text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA to Find Providers */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl mb-4">Ready to Get Treatment?</h2>
              <p className="text-lg text-gray-700 mb-6">
                We have <strong>{providers.length}</strong> camps and hospitals available for{' '}
                {domain.name}
              </p>
              <Link to={`/domain/${domain.id}/providers`}>
                <Button size="lg" className="h-14 px-8 text-lg">
                  Find Camps & Hospitals
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Emergency Note */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800">
                  <strong>Emergency?</strong> For immediate medical emergencies, please call 108
                  (ambulance) or visit the nearest hospital emergency department directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
