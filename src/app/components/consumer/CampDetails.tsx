import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Heart,
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Stethoscope,
  CheckCircle2,
  IndianRupee,
} from 'lucide-react';

export function CampDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCampById } = useApp();

  const camp = getCampById(id || '');

  if (!camp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-500 mb-4">Camp not found</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availableSlots = camp.maxSlots - camp.bookedSlots;
  const isFull = camp.status === 'full' || availableSlots <= 0;

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
                  <Badge className="bg-purple-100 text-purple-700">Medical Camp</Badge>
                  {camp.isFree && (
                    <Badge className="bg-green-100 text-green-700">100% FREE</Badge>
                  )}
                  <Badge
                    className={
                      isFull ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }
                  >
                    {isFull ? 'Slots Full' : `${availableSlots} Slots Available`}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl">{camp.name}</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="text-lg">
                      {camp.village}, {camp.district}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="text-lg">
                      {new Date(camp.date).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Time</p>
                    <p className="text-lg">{camp.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Available Slots</p>
                    <p className="text-lg">
                      {camp.bookedSlots} / {camp.maxSlots} booked
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h2 className="text-lg mb-3">About This Camp</h2>
                <p className="text-base text-gray-600 leading-relaxed">{camp.description}</p>
              </div>

              {camp.isFree && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <IndianRupee className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">
                    <strong>Completely Free:</strong> All services including consultation, tests,
                    and medicines are provided at no cost.
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
                Available Doctors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {camp.doctors.map((doctor, index) => (
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
              <h2 className="text-2xl mb-6">Services Provided</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {camp.services.map((service, index) => (
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
                  <p className="text-sm text-gray-400 mt-1">
                    {camp.village}, {camp.district}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Book Button */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 md:relative md:border-0 md:p-0 md:m-0">
            <Button
              size="lg"
              className="w-full h-14 text-lg"
              disabled={isFull}
              onClick={() => navigate(`/camp/${camp.id}/book`)}
            >
              {isFull ? 'Slots Full - Booking Closed' : 'Book This Camp'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
