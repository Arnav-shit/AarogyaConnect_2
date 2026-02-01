import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { MapPin, Calendar, Users, Edit, Trash2, Search, PlusCircle } from 'lucide-react';

export function ManageCamps() {
  const { camps, deleteCamp } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredCamps = camps.filter(
    camp =>
      camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteCamp(deleteId);
      setDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-700';
      case 'full':
        return 'bg-orange-100 text-orange-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2">Manage Camps</h1>
          <p className="text-gray-600">View, edit, and manage all medical camps</p>
        </div>
        <Link to="/admin/camps/new">
          <Button className="gap-2">
            <PlusCircle className="w-5 h-5" />
            Create New Camp
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search camps by name, village, or district..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Camps List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCamps.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No camps found. Create your first camp to get started.
          </div>
        ) : (
          filteredCamps.map(camp => (
            <Card key={camp.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl mb-2">{camp.name}</h3>
                    <Badge className={getStatusColor(camp.status)}>
                      {camp.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/camps/edit/${camp.id}`}>
                      <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteId(camp.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{camp.village}, {camp.district}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {new Date(camp.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      {' • '}
                      {camp.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {camp.bookedSlots} / {camp.maxSlots} slots booked
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {camp.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <strong>Doctors:</strong>{' '}
                    {camp.doctors.map(d => d.name).join(', ')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Camp?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the camp and all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
