import React, { useState } from 'react';
import { useApp } from '../../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Building2, MapPin, Phone, Clock, Search, AlertCircle, Edit, Trash2 } from 'lucide-react';

type HospitalForm = {
  name: string;
  address: string;
  district: string;
  contactNumber: string;
  email?: string;
  timings: string;
  daysOpen: string;
  consultationFee: string;
  isPermanent: boolean;
  hasEmergency: boolean;
  services: string; // comma-separated
  doctors: string; // comma-separated names
  description: string;
  domainIds: string[];
};

export function ManageHospitals() {
  const { hospitals, addHospital, updateHospital, deleteHospital, domains } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm: HospitalForm = {
    name: '',
    address: '',
    district: '',
    contactNumber: '',
    email: '',
    timings: '',
    daysOpen: '',
    consultationFee: '',
    isPermanent: false,
    hasEmergency: false,
    services: '',
    doctors: '',
    description: '',
    domainIds: [],
  };

  const [form, setForm] = useState<HospitalForm>(emptyForm);

  const startAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const startEdit = (id: string) => {
    const h = hospitals.find(h => h.id === id);
    if (!h) return;
    setEditingId(id);
    setForm({
      name: h.name,
      address: h.address,
      district: h.district,
      contactNumber: h.contactNumber,
      email: h.email || '',
      timings: h.timings,
      daysOpen: h.daysOpen,
      consultationFee: h.consultationFee,
      isPermanent: h.isPermanent,
      hasEmergency: h.hasEmergency,
      services: h.services.join(', '),
      doctors: h.doctors.map(d => d.name).join(', '),
      description: h.description,
      domainIds: h.domainIds || [],
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this hospital?')) deleteHospital(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hospitalData = {
      name: form.name,
      domainIds: form.domainIds,
      location: form.address,
      address: form.address,
      district: form.district,
      contactNumber: form.contactNumber,
      email: form.email || undefined,
      doctors: form.doctors
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(name => ({ name, gender: 'Male' as const, specialization: '' })),
      services: form.services.split(',').map(s => s.trim()).filter(Boolean),
      timings: form.timings,
      daysOpen: form.daysOpen,
      description: form.description,
      isPermanent: form.isPermanent,
      hasEmergency: form.hasEmergency,
      consultationFee: form.consultationFee,
    };

    if (editingId) {
      updateHospital(editingId, hospitalData);
    } else {
      addHospital(hospitalData as any);
    }

    setShowForm(false);
  };

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
        <div className="flex gap-2">
          <Button className="gap-2" onClick={startAdd}>
            <Building2 className="w-5 h-5" />
            Add New Hospital
          </Button>
        </div>
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

      {/* Optional Add/Edit Form */}
      {showForm && (
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Hospital name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <Input placeholder="District" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} required />
                <Input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                <Input placeholder="Contact number" value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} required />
                <Input placeholder="Email (optional)" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <Input placeholder="Timings" value={form.timings} onChange={e => setForm({ ...form, timings: e.target.value })} />
                <Input placeholder="Days Open" value={form.daysOpen} onChange={e => setForm({ ...form, daysOpen: e.target.value })} />
                <Input placeholder="Consultation Fee" value={form.consultationFee} onChange={e => setForm({ ...form, consultationFee: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Services (comma separated)" value={form.services} onChange={e => setForm({ ...form, services: e.target.value })} />
                <Input placeholder="Doctors (comma separated)" value={form.doctors} onChange={e => setForm({ ...form, doctors: e.target.value })} />
              </div>

                  <div className="space-y-2">
                    <Label>Domain(s)</Label>
                    <div className="flex flex-wrap gap-2">
                      {domains.map(d => (
                        <label key={d.id} className={`px-3 py-1 rounded border ${form.domainIds.includes(d.id) ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>
                          <input
                            type="checkbox"
                            checked={form.domainIds.includes(d.id)}
                            onChange={() => setForm(prev => ({ ...prev, domainIds: prev.domainIds.includes(d.id) ? prev.domainIds.filter(x => x !== d.id) : [...prev.domainIds, d.id] }))}
                            className="mr-2"
                          />
                          {d.name}
                        </label>
                      ))}
                    </div>
                  </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.isPermanent} onChange={e => setForm({ ...form, isPermanent: e.target.checked })} /> Permanent</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.hasEmergency} onChange={e => setForm({ ...form, hasEmergency: e.target.checked })} /> 24/7 Emergency</label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update Hospital' : 'Create Hospital'}</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => startEdit(hospital.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(hospital.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
    </div>
  );
}
