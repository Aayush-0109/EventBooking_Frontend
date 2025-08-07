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

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-primary-100">
        <Header />
        <Container className="flex-1 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/organizer-request" element={<OrganizerRequestPage />} />
            <Route path="/nearby-events" element={<NearbyEventsPage />} />

            {/* User Routes */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/booking/:id" element={<BookingDetailsPage />} />

            {/* Organizer Routes */}
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/organizer/requests" element={<OrganizerRequestsPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/events" element={<AdminEventsPage />} />
            <Route path="/admin/organizer-requests" element={<AdminOrganizerRequestsPage />} />
          </Routes>
        </Container>
        <Footer />
      </div>
    </Router>
  );
}

export default App;