import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp, Camp, Doctor } from '@/contexts/AppContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export function CreateEditCamp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { camps, addCamp, updateCamp, getCampById, domains } = useApp();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    village: '',
    district: '',
    date: '',
    time: '',
    maxSlots: 50,
    description: '',
    domainIds: [] as string[],
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [newDoctor, setNewDoctor] = useState({ name: '', gender: 'Male' as 'Male' | 'Female', specialization: '' });
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');

  useEffect(() => {
    if (isEditMode && id) {
      const camp = getCampById(id);
      if (camp) {
        setFormData({
          name: camp.name,
          village: camp.village,
          district: camp.district,
          date: camp.date,
          time: camp.time,
          maxSlots: camp.maxSlots,
          description: camp.description,
          domainIds: camp.domainIds || [],
        });
        setDoctors(camp.doctors);
        setServices(camp.services);
      }
    }
  }, [id, isEditMode, getCampById]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addDoctor = () => {
    if (newDoctor.name && newDoctor.specialization) {
      setDoctors([...doctors, newDoctor]);
      setNewDoctor({ name: '', gender: 'Male', specialization: '' });
    }
  };

  const removeDoctor = (index: number) => {
    setDoctors(doctors.filter((_, i) => i !== index));
  };

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setServices(services.filter(s => s !== service));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (doctors.length === 0) {
      toast.error('Please add at least one doctor');
      return;
    }

    const specializations = [...new Set(doctors.map(d => d.specialization))];
    const location = `${formData.village}, ${formData.district}`;

    const campData = {
      name: formData.name,
      location,
      village: formData.village,
      district: formData.district,
      date: formData.date,
      time: formData.time,
      doctors,
      specializations,
      maxSlots: Number(formData.maxSlots),
      bookedSlots: isEditMode ? getCampById(id!)?.bookedSlots || 0 : 0,
      description: formData.description,
      status: (isEditMode ? getCampById(id!)?.status : 'upcoming') as 'upcoming' | 'full' | 'completed',
      services,
      domainIds: formData.domainIds,
    };

    if (isEditMode && id) {
      updateCamp(id, campData);
      toast.success('Camp updated successfully');
    } else {
      addCamp(campData as Omit<Camp, 'id'>);
      toast.success('Camp created successfully');
    }

    navigate('/admin/camps');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/camps')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl mb-1">{isEditMode ? 'Edit Camp' : 'Create New Camp'}</h1>
          <p className="text-gray-600">
            {isEditMode ? 'Update camp information' : 'Fill in the details to create a new medical camp'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Camp Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., General Health Checkup Camp"
                required
                className="h-12"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="village">Village *</Label>
                <Input
                  id="village"
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  placeholder="e.g., Rampur"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder="e.g., Varanasi"
                  required
                  className="h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  placeholder="e.g., 09:00 AM - 02:00 PM"
                  required
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSlots">Maximum Slots *</Label>
              <Input
                id="maxSlots"
                name="maxSlots"
                type="number"
                value={formData.maxSlots}
                onChange={handleInputChange}
                min="1"
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the camp, services provided, and any other relevant information..."
                required
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Doctors */}
        <Card>
          <CardHeader>
            <CardTitle>Doctors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 space-y-2">
                <Label>Doctor Name</Label>
                <Input
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  placeholder="Dr. Name"
                  className="h-12"
                />
              </div>

              <div className="md:col-span-3 space-y-2">
                <Label>Gender</Label>
                <select
                  value={newDoctor.gender}
                  onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value as 'Male' | 'Female' })}
                  className="w-full h-12 px-3 rounded-md border border-gray-300"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="md:col-span-4 space-y-2">
                <Label>Specialization</Label>
                <Input
                  value={newDoctor.specialization}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                  placeholder="e.g., General Medicine"
                  className="h-12"
                />
              </div>

              <div className="md:col-span-1 flex items-end">
                <Button type="button" onClick={addDoctor} size="icon" className="h-12 w-12">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {doctors.length > 0 && (
              <div className="space-y-2">
                {doctors.map((doctor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-gray-600">
                        {doctor.specialization} • {doctor.gender}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDoctor(index)}
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle>Services Provided</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="e.g., Blood Pressure Check"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                className="h-12"
              />
              <Button type="button" onClick={addService} className="gap-2">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>

            {services.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {services.map((service, index) => (
                  <Badge key={index} variant="secondary" className="gap-2 py-2 px-3 text-sm">
                    {service}
                    <button type="button" onClick={() => removeService(service)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" size="lg" className="min-w-32">
            {isEditMode ? 'Update Camp' : 'Create Camp'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate('/admin/camps')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}