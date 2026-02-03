import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Heart,
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Clock,
  Phone,
  Search,
  Tent,
  Building2,
  IndianRupee,
} from 'lucide-react';

export function ProvidersList() {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const { getDomainById, getProvidersByDomain } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'camps' | 'hospitals'>('all');

  const domain = getDomainById(domainId || '');
  const allProviders = getProvidersByDomain(domainId || '');

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

  const filteredProviders = allProviders.filter(provider => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'camps' && provider.type === 'camp') ||
      (filter === 'hospitals' && provider.type === 'hospital');

    return matchesSearch && matchesFilter;
  });

  const camps = allProviders.filter(p => p.type === 'camp');
  const hospitals = allProviders.filter(p => p.type === 'hospital');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/domain/${domainId}`)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xl">HealthCamp</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-3">{domain.name}</h1>
          <p className="text-lg text-gray-600">
            Find camps and hospitals offering {domain.name.toLowerCase()} services
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, location, or district..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-base"
            />
          </div>

          <Tabs value={filter} onValueChange={v => setFilter(v as any)} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">
                All ({allProviders.length})
              </TabsTrigger>
              <TabsTrigger value="camps">
                <Tent className="w-4 h-4 mr-2" />
                Camps ({camps.length})
              </TabsTrigger>
              <TabsTrigger value="hospitals">
                <Building2 className="w-4 h-4 mr-2" />
                Hospitals ({hospitals.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Providers Grid */}
        {filteredProviders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-lg text-gray-500">
                No providers found. Try adjusting your search or filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProviders.map(provider => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Provider Type Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <Badge
                      variant="outline"
                      className={
                        provider.type === 'camp'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }
                    >
                      {provider.type === 'camp' ? (
                        <>
                          <Tent className="w-3 h-3 mr-1" />
                          Medical Camp
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3 h-3 mr-1" />
                          Hospital
                        </>
                      )}
                    </Badge>
                    {provider.type === 'camp' && provider.isFree && (
                      <Badge className="bg-green-100 text-green-700">FREE</Badge>
                    )}
                  </div>

                  <h3 className="text-xl mb-3">{provider.name}</h3>

                  {/* Details based on type */}
                  <div className="space-y-3 text-base mb-4">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>
                        {provider.type === 'camp' ? provider.village : provider.address},{' '}
                        {provider.district}
                      </span>
                    </div>

                    {provider.type === 'camp' ? (
                      <>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-5 h-5 flex-shrink-0" />
                          <span>
                            {new Date(provider.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-5 h-5 flex-shrink-0" />
                          <span>{provider.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-5 h-5 flex-shrink-0" />
                          <span>
                            {provider.maxSlots - provider.bookedSlots} slots available
                          </span>
                        </div>
                        {provider.status === 'full' && (
                          <Badge className="bg-orange-100 text-orange-700">FULL</Badge>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-5 h-5 flex-shrink-0" />
                          <span>{provider.timings}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-5 h-5 flex-shrink-0" />
                          <span>{provider.daysOpen}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-5 h-5 flex-shrink-0" />
                          <span>{provider.contactNumber}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-600">
                          <IndianRupee className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>{provider.consultationFee}</span>
                        </div>
                        {provider.hasEmergency && (
                          <Badge className="bg-red-100 text-red-700">24/7 Emergency</Badge>
                        )}
                      </>
                    )}
                  </div>

                  {/* Services Preview */}
                  <div className="mb-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {(provider.services || []).slice(0, 3).map((service, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                        >
                          {service}
                        </span>
                      ))}
                      {(provider.services || []).length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          +{(provider.services || []).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Doctors Preview */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Doctors:</p>
                    <p className="text-sm text-gray-700">
                      {(provider.doctors || []).slice(0, 2).map(d => d.name).join(', ')}
                      {(provider.doctors || []).length > 2 && ` +${(provider.doctors || []).length - 2} more`}
                    </p>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={
                      provider.type === 'camp'
                        ? `/camp/${provider.id}`
                        : `/hospital/${provider.id}`
                    }
                  >
                    <Button
                      className="w-full h-12 text-base"
                      disabled={provider.type === 'camp' && provider.status === 'full'}
                    >
                      {provider.type === 'camp' && provider.status === 'full'
                        ? 'Slots Full'
                        : 'View Details & Book'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
