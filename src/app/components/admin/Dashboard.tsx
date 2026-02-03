import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Calendar, Users, Clock, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const { camps, bookings } = useApp();

  const today = new Date().toISOString().split('T')[0];
  
  const stats = {
    totalUpcomingCamps: camps.filter(c => c.status === 'upcoming').length,
    totalRegistrations: bookings.filter(b => b.status === 'confirmed').length,
    todaysCamps: camps.filter(c => c.date === today).length,
    pendingConfirmations: bookings.filter(b => b.status === 'pending').length,
  };

  const upcomingCamps = camps
    .filter(c => c.status === 'upcoming' && new Date(c.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const recentBookings = bookings
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Upcoming Camps</CardTitle>
            <Calendar className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{stats.totalUpcomingCamps}</div>
            <p className="text-xs text-gray-500 mt-1">Active medical camps</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Total Registrations</CardTitle>
            <Users className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{stats.totalRegistrations}</div>
            <p className="text-xs text-gray-500 mt-1">Confirmed bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Today's Camps</CardTitle>
            <Clock className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{stats.todaysCamps}</div>
            <p className="text-xs text-gray-500 mt-1">Camps scheduled today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Pending Confirmations</CardTitle>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{stats.pendingConfirmations}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Camps & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Camps */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Camps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingCamps.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No upcoming camps scheduled</p>
              ) : (
                upcomingCamps.map(camp => (
                  <div key={camp.id} className="border-l-4 border-green-500 pl-4 py-2">
                    <h3 className="font-medium mb-1">{camp.name}</h3>
                    <p className="text-sm text-gray-600">{camp.village}, {camp.district}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>📅 {new Date(camp.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}</span>
                      <span>👥 {camp.bookedSlots}/{camp.maxSlots} slots</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent bookings</p>
              ) : (
                recentBookings.map(booking => (
                  <div key={booking.id} className="border-b last:border-b-0 pb-3 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{booking.userName}</h3>
                        <p className="text-sm text-gray-600">{booking.providerName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {booking.age} years • {booking.gender} • {booking.mobile}
                        </p>
                      </div>
                      <span className={`
                        text-xs px-2 py-1 rounded-full
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                      `}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
