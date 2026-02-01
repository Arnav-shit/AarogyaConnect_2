import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Heart,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Stethoscope,
  CheckCircle2,
  IndianRupee,
  AlertCircle,
} from 'lucide-react';

export function HospitalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getHospitalById } = useApp();

  const hospital = getHospitalById(id || '');

  if (!hospital) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-500 mb-4">Hospital not found</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Info */}
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-100 text-blue-700">Hospital / Clinic</Badge>
                  {hospital.isPermanent && (
                    <Badge className="bg-green-100 text-green-700">Permanent Facility</Badge>
                  )}
                  {hospital.hasEmergency && (
                    <Badge className="bg-red-100 text-red-700">24/7 Emergency</Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl">{hospital.name}</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="text-lg">{hospital.address}</p>
                    <p className="text-base text-gray-600">{hospital.district}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                    <p className="text-lg">
                      <a
                        href={`tel:${hospital.contactNumber}`}
                        className="text-green-600 hover:underline"
                      >
                        {hospital.contactNumber}
                      </a>
                    </p>
                    {hospital.email && (
                      <p className="text-sm text-gray-600 mt-1">
                        <a href={`mailto:${hospital.email}`} className="hover:underline">
                          {hospital.email}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Timings</p>
                    <p className="text-lg">{hospital.timings}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Days Open</p>
                    <p className="text-lg">{hospital.daysOpen}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <IndianRupee className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Consultation Fee</p>
                    <p className="text-lg">{hospital.consultationFee}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h2 className="text-lg mb-3">About This Hospital</h2>
                <p className="text-base text-gray-600 leading-relaxed">{hospital.description}</p>
              </div>

              {hospital.hasEmergency && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">
                    <strong>Emergency Services Available:</strong> This facility provides 24/7
                    emergency medical care. You can visit directly in case of emergencies.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Doctors */}
          <Card>
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl mb-6 flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-green-600" />
                Our Doctors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospital.doctors.map((doctor, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg mb-1">{doctor.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{doctor.specialization}</p>
                    {doctor.qualification && (
                      <p className="text-xs text-gray-500 mb-2">{doctor.qualification}</p>
                    )}
                    <Badge variant="outline">{doctor.gender}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl mb-6">Services & Facilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hospital.services.map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-base">{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Map Placeholder */}
          <Card>
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl mb-4">Location</h2>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Map will be displayed here</p>
                  <p className="text-sm text-gray-400 mt-1">{hospital.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href={`tel:${hospital.contactNumber}`}>
              <Button size="lg" variant="outline" className="w-full h-14 text-lg gap-2">
                <Phone className="w-5 h-5" />
                Call Hospital
              </Button>
            </a>
            <Button
              size="lg"
              className="w-full h-14 text-lg"
              onClick={() => navigate(`/hospital/${hospital.id}/book`)}
            >
              Book Appointment
            </Button>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> We recommend calling ahead to confirm doctor availability and
              to schedule your appointment. Bring any previous medical records if available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
