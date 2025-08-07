import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Calendar,
  MapPin,
  Settings,
  LogOut,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Container from '../components/layout/Container';
import EventCard from '../components/features/EventCard';
import { Event } from '../types';

// Mock data for demonstration
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  profileImage: null,
  role: 'USER' as const,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z'
};

const mockBookings = [
  {
    id: '1',
    event: {
      id: 1,
      title: 'Tech Conference 2024',
      description: 'Annual technology conference featuring industry leaders',
      date: '2024-02-15T09:00:00Z',
      images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500'],
      registrations: [],
      user: {
        id: 1,
        name: 'Tech Events Inc',
        email: 'contact@techevents.com',
        role: 'ORGANIZER' as const,
        profileImage: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      longitude: -74.0060,
      latitude: 40.7128,
      address: 'Convention Center, Downtown',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      createdBy: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    status: 'confirmed',
    registeredAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    event: {
      id: 2,
      title: 'Music Festival',
      description: 'Three-day music festival with top artists',
      date: '2024-03-20T18:00:00Z',
      images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500'],
      registrations: [],
      user: {
        id: 2,
        name: 'Music Productions',
        email: 'info@musicprod.com',
        role: 'ORGANIZER' as const,
        profileImage: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      longitude: -73.9352,
      latitude: 40.7589,
      address: 'Central Park',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10023',
      createdBy: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    status: 'pending',
    registeredAt: '2024-01-25T11:15:00Z'
  }
];

export const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'settings'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-warning-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-error-500" />;
      default:
        return <Clock className="w-5 h-5 text-neutral-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success-100 text-success-700';
      case 'pending':
        return 'bg-warning-100 text-warning-700';
      case 'cancelled':
        return 'bg-error-100 text-error-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard</h1>
          <p className="text-neutral-600">Manage your profile and bookings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-neutral-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'bookings', label: 'My Bookings', icon: Calendar },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Profile Information</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    value={mockUser.name}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-neutral-50' : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={mockUser.email}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-neutral-50' : ''}
                  />
                </div>



                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Member Since
                  </label>
                  <Input
                    value={new Date(mockUser.createdAt).toLocaleDateString()}
                    disabled
                    className="bg-neutral-50"
                  />
                </div>
              </div>

              {isEditingProfile && (
                <div className="flex space-x-3 mt-6 pt-6 border-t">
                  <Button>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-neutral-900">My Bookings</h2>
                <div className="text-sm text-neutral-500">
                  {mockBookings.length} booking{mockBookings.length !== 1 ? 's' : ''}
                </div>
              </div>

              {mockBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No bookings yet</h3>
                  <p className="text-neutral-600 mb-4">
                    Start exploring events and make your first booking!
                  </p>
                  <Button>Browse Events</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mockBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
                    >
                      <div className="relative h-48">
                        <img
                          src={booking.event.images?.[0] || '/placeholder-event.jpg'}
                          alt={booking.event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                          {booking.event.title}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-neutral-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(booking.event.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-neutral-600">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.event.city}, {booking.event.state}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(booking.status)}
                            <span className="text-sm text-neutral-600">
                              Booked on {new Date(booking.registeredAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/events/${booking.event.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Account Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-900">Email Notifications</p>
                        <p className="text-sm text-neutral-600">Receive updates about your bookings</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-900">SMS Notifications</p>
                        <p className="text-sm text-neutral-600">Get text messages for important updates</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-primary-600" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">Privacy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-900">Profile Visibility</p>
                        <p className="text-sm text-neutral-600">Allow organizers to see your profile</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Button variant="danger" size="lg" onClick={() => alert('Logout logic goes here')}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}; 