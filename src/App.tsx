import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Container from './components/layout/Container';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { CreateEventPage } from './pages/CreateEventPage';
import { OrganizerRequestPage } from './pages/OrganizerRequestPage';
import OrganizerRequestsPage from './pages/OrganizerRequestsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminOrganizerRequestsPage from './pages/AdminOrganizerRequestsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import NearbyEventsPage from './pages/NearbyEventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { env } from './config/environment';
import { AuthProvider } from './components/auth/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import UnauthorizedPage from './pages/unauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-primary-100">
          <Header />
          <Container className="flex-1 py-8">
            <Routes>
              {/* 🌐 PUBLIC ROUTES - Match backend public endpoints */}
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route path="/nearby-events" element={<NearbyEventsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* 🔐 AUTHENTICATION REQUIRED ROUTES */}

              {/* Any authenticated user can access these */}
              <Route path="/dashboard" element={
                <ProtectedRoute >
                  <UserDashboard />
                </ProtectedRoute>
              } />

              {/* 🎯 ROLE-BASED PROTECTED ROUTES */}

              {/* USER role only - Create organizer requests */}
              <Route path="/organizer-request" element={
                <ProtectedRoute requiredRole="USER">
                  <OrganizerRequestPage />
                </ProtectedRoute>
              } />

              {/* Any authenticated user can view their bookings */}
              <Route path="/booking/:id" element={
                <ProtectedRoute >
                  <BookingDetailsPage />
                </ProtectedRoute>
              } />

              {/* 👤 ORGANIZER + ADMIN ROUTES - Event Management */}
              <Route path="/organizer/dashboard" element={
                <ProtectedRoute requiredRole={["ORGANIZER", "ADMIN"]}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              } />

              <Route path="/create-event" element={
                <ProtectedRoute requiredRole={["ORGANIZER", "ADMIN"]}>
                  <CreateEventPage />
                </ProtectedRoute>
              } />

              {/* 👑 ADMIN ONLY ROUTES */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboardPage />
                </ProtectedRoute>
              } />

              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminUsersPage />
                </ProtectedRoute>
              } />

              <Route path="/admin/events" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminEventsPage />
                </ProtectedRoute>
              } />

              {/* Admin manages organizer requests */}
              <Route path="/admin/organizer-requests" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminOrganizerRequestsPage />
                </ProtectedRoute>
              } />

              {/* 🚨 ERROR PAGES */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Container>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;