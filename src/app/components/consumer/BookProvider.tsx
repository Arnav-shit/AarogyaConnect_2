import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Heart, ArrowLeft, User, Phone } from 'lucide-react';

export function BookProvider() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getCampById, getHospitalById, addBooking, getDomainById } = useApp();
  const [step, setStep] = useState(1);

  const isHospital = location.pathname.includes('/hospital/');
  const provider = isHospital ? getHospitalById(id || '') : getCampById(id || '');

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
  });

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-500">Provider not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get domain name
  const domainName = provider.domainIds.length > 0 
    ? getDomainById(provider.domainIds[0])?.name || 'Healthcare'
    : 'Healthcare';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
    } else {
      const bookingId = addBooking({
        providerId: provider.id,
        providerName: provider.name,
        providerType: provider.type,
        userName: formData.name,
        mobile: formData.mobile,
        age: Number(formData.age),
        gender: formData.gender,
        appointmentDate: provider.type === 'camp' ? provider.date : undefined,
        domain: domainName,
      });

      navigate(`/booking-confirmation/${bookingId}`);
    }
  };

  const progressValue = (step / 2) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              step === 1
                ? navigate(isHospital ? `/hospital/${id}` : `/camp/${id}`)
                : setStep(1)
            }
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xl">
              Book {provider.type === 'camp' ? 'Camp' : 'Appointment'}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Step {step} of 2</span>
              <span>{step === 1 ? 'Personal Details' : 'Review & Confirm'}</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>

          {/* Provider Info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl mb-2">{provider.name}</h2>
              <p className="text-gray-600">
                {provider.type === 'camp'
                  ? `${provider.village}, ${provider.district} • ${new Date(provider.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}`
                  : `${provider.address}, ${provider.district}`}
              </p>
            </CardContent>
          </Card>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 ? 'Enter Your Details' : 'Review Your Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base">
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          className="pl-10 h-14 text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-base">
                        Mobile Number *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="mobile"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          placeholder="10-digit mobile number"
                          pattern="[0-9]{10}"
                          required
                          className="pl-10 h-14 text-base"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        You will receive SMS confirmation on this number
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-base">
                          Age *
                        </Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleInputChange}
                          placeholder="Age"
                          min="1"
                          max="120"
                          required
                          className="h-14 text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-base">
                          Gender *
                        </Label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={e =>
                            setFormData(prev => ({
                              ...prev,
                              gender: e.target.value as 'Male' | 'Female' | 'Other',
                            }))
                          }
                          required
                          className="w-full h-14 px-3 rounded-md border border-gray-300 text-base"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full h-14 text-base">
                      Continue to Review
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Name</p>
                        <p className="text-lg">{formData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                        <p className="text-lg">{formData.mobile}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Age</p>
                          <p className="text-lg">{formData.age} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Gender</p>
                          <p className="text-lg">{formData.gender}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong>{' '}
                        {provider.type === 'camp'
                          ? 'Please arrive at the camp 15 minutes before the scheduled time. Bring a valid ID proof if available.'
                          : 'Please call ahead to confirm your appointment time. Bring any previous medical records if available.'}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1 h-14 text-base"
                        onClick={() => setStep(1)}
                      >
                        Edit Details
                      </Button>
                      <Button type="submit" size="lg" className="flex-1 h-14 text-base">
                        Confirm Booking
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
