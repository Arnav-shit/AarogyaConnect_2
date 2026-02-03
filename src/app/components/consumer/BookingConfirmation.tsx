import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Heart, CheckCircle2, Calendar, MapPin, Phone, User, Building2, Tent } from 'lucide-react';

export function BookingConfirmation() {
  const { bookingId } = useParams();
  const { bookings, getCampById, getHospitalById } = useApp();

  const booking = bookings.find(b => b.id === bookingId);
  const provider = booking
    ? booking.providerType === 'camp'
      ? getCampById(booking.providerId)
      : getHospitalById(booking.providerId)
    : null;

  if (!booking || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-500 mb-4">Booking not found</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCamp = booking.providerType === 'camp';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-xl">HealthCamp</span>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl mb-3">Booking Confirmed!</h1>
              <p className="text-lg text-gray-700 mb-6">
                Your {isCamp ? 'camp registration' : 'appointment'} has been successful. You will
                receive an SMS confirmation shortly.
              </p>
              <div className="inline-block bg-white px-6 py-3 rounded-lg border-2 border-green-300">
                <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                <p className="text-2xl text-green-700">{booking.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl mb-6">Booking Details</h2>

              <div className="space-y-6">
                {/* Provider Type */}
                <div className="flex items-start gap-4">
                  {isCamp ? (
                    <Tent className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  ) : (
                    <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Service Type</p>
                    <p className="text-lg">{isCamp ? 'Medical Camp' : 'Hospital / Clinic'}</p>
                    <p className="text-base text-gray-600 mt-1">{booking.domain}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">
                      {isCamp ? 'Camp Details' : 'Hospital Details'}
                    </p>
                    <p className="text-lg mb-1">{provider.name}</p>
                    {isCamp && 'date' in provider && (
                      <>
                        <p className="text-base text-gray-600">
                          {new Date(provider.date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-base text-gray-600">{provider.time}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    {isCamp && 'village' in provider ? (
                      <p className="text-lg">
                        {provider.village}, {provider.district}
                      </p>
                    ) : 'address' in provider ? (
                      <>
                        <p className="text-lg">{provider.address}</p>
                        <p className="text-base text-gray-600">{provider.district}</p>
                      </>
                    ) : null}
                  </div>
                </div>

                {!isCamp && 'contactNumber' in provider && (
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                      <p className="text-lg">
                        <a
                          href={`tel:${provider.contactNumber}`}
                          className="text-green-600 hover:underline"
                        >
                          {provider.contactNumber}
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <User className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Patient Details</p>
                    <p className="text-lg mb-1">{booking.userName}</p>
                    <p className="text-base text-gray-600">
                      {booking.age} years • {booking.gender}
                    </p>
                    <p className="text-base text-gray-600 mt-1">{booking.mobile}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Instructions */}
          <Card>
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl mb-4">Important Instructions</h2>
              <ul className="space-y-3 text-base text-gray-700">
                {isCamp ? (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Please arrive at the camp location 15 minutes before the scheduled time.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Bring a valid ID proof (Aadhaar card, voter ID, or any government ID).
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Keep your booking ID handy for easy check-in.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>You will receive an SMS reminder one day before the camp.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        All services including consultation and medicines are completely free.
                      </span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Please call the hospital to confirm your appointment time before visiting.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Bring a valid ID proof and any previous medical records if available.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Keep your booking ID handy when you visit.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Check the consultation fee and timings before your visit.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        In case of emergency, visit the emergency department directly or call 108.
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/" className="flex-1">
              <Button variant="outline" size="lg" className="w-full h-14 text-base">
                Back to Home
              </Button>
            </Link>
            {!isCamp && 'contactNumber' in provider && (
              <a href={`tel:${provider.contactNumber}`} className="flex-1">
                <Button size="lg" className="w-full h-14 text-base gap-2">
                  <Phone className="w-5 h-5" />
                  Call Hospital
                </Button>
              </a>
            )}
          </div>

          {/* SMS Confirmation Notice */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm text-blue-800">
              📱 You will receive an SMS confirmation on <strong>{booking.mobile}</strong> within
              the next few minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
