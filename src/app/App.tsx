import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProvider } from '../contexts/AppContext';
import { Toaster } from './components/ui/sonner';

// Consumer Components
import { DomainSelection } from './components/consumer/DomainSelection';
import { DomainInfo } from './components/consumer/DomainInfo';
import { ProvidersList } from './components/consumer/ProvidersList';
import { CampDetails } from './components/consumer/CampDetails';
import { HospitalDetails } from './components/consumer/HospitalDetails';
import { BookProvider } from './components/consumer/BookProvider';
import { BookingConfirmation } from './components/consumer/BookingConfirmation';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './components/admin/Dashboard';
import { ManageCamps } from './components/admin/ManageCamps';
import { ManageHospitals } from './components/admin/ManageHospitals';
import { CreateEditCamp } from './components/admin/CreateEditCamp';
import { Registrations } from './components/admin/Registrations';
import { AdminPlaceholder } from './components/admin/AdminPlaceholder';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Bell, MessageSquare, Settings, Layers } from 'lucide-react';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Consumer Routes */}
            <Route path="/" element={<DomainSelection />} />
            <Route path="/domain/:domainId" element={<DomainInfo />} />
            <Route path="/domain/:domainId/providers" element={<ProvidersList />} />
            <Route path="/camp/:id" element={<CampDetails />} />
            <Route path="/hospital/:id" element={<HospitalDetails />} />
            <Route path="/camp/:id/book" element={<BookProvider />} />
            <Route path="/hospital/:id/book" element={<BookProvider />} />
            <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/domains"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminPlaceholder
                      icon={Layers}
                      title="Manage Domains"
                      description="Manage healthcare domains and categories"
                    />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/camps"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ManageCamps />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/camps/new"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <CreateEditCamp />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/camps/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <CreateEditCamp />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/hospitals"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ManageHospitals />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registrations"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Registrations />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminPlaceholder
                      icon={Bell}
                      title="Notifications"
                      description="Manage and send notifications to users"
                    />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminPlaceholder
                      icon={MessageSquare}
                      title="Feedback & Queries"
                      description="View and respond to user feedback and queries"
                    />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminPlaceholder
                      icon={Settings}
                      title="Settings"
                      description="Configure application settings and preferences"
                    />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Redirect /admin to dashboard */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            {/* 404 - Redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AppProvider>
    </AuthProvider>
  );
}
