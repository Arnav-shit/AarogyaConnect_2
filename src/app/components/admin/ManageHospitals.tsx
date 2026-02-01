import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Building2, MapPin, Phone, Clock, Search, AlertCircle } from 'lucide-react';

export function ManageHospitals() {
  const { hospitals } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHospitals = hospitals.filter(
    hospital =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2">Manage Hospitals</h1>
          <p className="text-gray-600">View and manage all registered hospitals</p>
        </div>
        <Button className="gap-2">
          <Building2 className="w-5 h-5" />
          Add New Hospital
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search hospitals by name, address, or district..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Hospitals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHospitals.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No hospitals found.
          </div>
        ) : (
          filteredHospitals.map(hospital => (
            <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl mb-2">{hospital.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {hospital.hasEmergency && (
                        <Badge className="bg-red-100 text-red-700">24/7 Emergency</Badge>
                      )}
                      {hospital.isPermanent && (
                        <Badge className="bg-green-100 text-green-700">Permanent</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{hospital.address}, {hospital.district}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{hospital.contactNumber}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{hospital.timings}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <strong>Doctors:</strong> {hospital.doctors.map(d => d.name).join(', ')}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {hospital.services.slice(0, 3).map((service, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                      >
                        {service}
                      </span>
                    ))}
                    {hospital.services.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        +{hospital.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Full hospital management features (add, edit, delete) will
                be available in the next update. Currently showing read-only view of registered
                hospitals.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
