import React, { useState } from 'react';
import {
    Calendar,
    Users,
    TrendingUp,
    Plus,
    Edit,
    Trash2,
    Eye,
    BarChart3,
    Settings,
    Filter,
    Search
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Container from '../components/layout/Container';
import EventCard from '../components/features/EventCard';
import { Event } from '../types';

// Mock data for demonstration - matches backend schema exactly
const mockEvents = [
    {
        id: 1,
        title: 'Tech Conference 2024',
        description: 'Annual technology conference featuring industry leaders and cutting-edge technology discussions',
        date: '2024-02-15T09:00:00Z',
        images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500'],
        registrations: [
            {
                id: 1,
                userId: 101,
                eventId: 1,
                registeredAt: '2024-01-15T10:00:00Z',
                user: {
                    id: 101,
                    name: 'John Doe',
                    email: 'john@example.com',
                    role: 'USER' as const,
                    profileImage: null,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z'
                }
            },
            {
                id: 2,
                userId: 102,
                eventId: 1,
                registeredAt: '2024-01-16T14:30:00Z',
                user: {
                    id: 102,
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    role: 'USER' as const,
                    profileImage: null,
                    createdAt: '2024-01-02T00:00:00Z',
                    updatedAt: '2024-01-02T00:00:00Z'
                }
            }
        ],
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
        address: '123 Convention Center Blvd',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
        createdBy: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 2,
        title: 'Music Festival',
        description: 'Three-day music festival with top artists from around the world',
        date: '2024-03-20T18:00:00Z',
        images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500'],
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
        longitude: -73.9665,
        latitude: 40.7812,
        address: '1 Central Park West',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10023',
        createdBy: 1,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
    }
] as Event[];

const mockStats = {
    totalEvents: 12,
    activeEvents: 8,
    totalRegistrations: 156,
    thisMonth: 23
};

export const OrganizerDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'analytics' | 'settings'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const filteredEvents = mockEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.address.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <Container>
            <div className="py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Organizer Dashboard</h1>
                    <p className="text-neutral-600">Manage your events and track performance</p>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-neutral-200 mb-8">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart3 },
                            { id: 'events', label: 'My Events', icon: Calendar },
                            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
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
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-600">Total Events</p>
                                            <p className="text-2xl font-bold text-neutral-900">{mockStats.totalEvents}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-primary-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-600">Active Events</p>
                                            <p className="text-2xl font-bold text-neutral-900">{mockStats.activeEvents}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-success-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-600">Total Registrations</p>
                                            <p className="text-2xl font-bold text-neutral-900">{mockStats.totalRegistrations}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6 text-accent-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-600">This Month</p>
                                            <p className="text-2xl font-bold text-neutral-900">{mockStats.thisMonth}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-warning-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Events */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-neutral-900">Recent Events</h2>
                                    <Button variant="outline" size="sm">
                                        View All
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {mockEvents.slice(0, 4).map((event) => (
                                        <div
                                            key={event.id}
                                            className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="font-semibold text-neutral-900">{event.title}</h3>
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
                                                    Active
                                                </span>
                                            </div>

                                            <div className="space-y-2 text-sm text-neutral-600 mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {new Date(event.date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Users className="w-4 h-4" />
                                                    <span>{event.registrations?.length || 0} registrations</span>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Events Tab */}
                    {activeTab === 'events' && (
                        <div className="space-y-6">
                            {/* Header with Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                <div>
                                    <h2 className="text-xl font-semibold text-neutral-900">My Events</h2>
                                    <p className="text-neutral-600">Manage and track your events</p>
                                </div>
                                <Button size="lg">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New Event
                                </Button>
                            </div>

                            {/* Search */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <Input
                                        placeholder="Search events by title, city, or address..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Events Grid */}
                            {filteredEvents.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-neutral-900 mb-2">No events found</h3>
                                    <p className="text-neutral-600 mb-4">
                                        {searchTerm
                                            ? 'Try adjusting your search'
                                            : 'Create your first event to get started!'
                                        }
                                    </p>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Event
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
                                        >
                                            <div className="relative h-48">
                                                <img
                                                    src={event.images?.[0] || '/placeholder-event.jpg'}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-4 right-4">
                                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-700">
                                                        Active
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                                    {event.title}
                                                </h3>

                                                <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                                                    {event.description}
                                                </p>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                                                        <Users className="w-4 h-4" />
                                                        <span>{event.registrations?.length || 0} registrations</span>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View Details
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Analytics</h2>
                            <div className="text-center py-12">
                                <BarChart3 className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-neutral-900 mb-2">Analytics Coming Soon</h3>
                                <p className="text-neutral-600">
                                    Detailed analytics and insights will be available here.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Organizer Settings</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-neutral-900 mb-4">Event Management</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-neutral-900">Auto-approve Registrations</p>
                                                <p className="text-sm text-neutral-600">Automatically approve new registrations</p>
                                            </div>
                                            <input type="checkbox" className="w-4 h-4 text-primary-600" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-neutral-900">Email Notifications</p>
                                                <p className="text-sm text-neutral-600">Get notified about new registrations</p>
                                            </div>
                                            <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-neutral-900 mb-4">Organization Profile</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input label="Organization Name" placeholder="Enter organization name" />
                                        <Input label="Contact Email" type="email" placeholder="contact@organization.com" />
                                        <Input label="Phone Number" placeholder="+1 (555) 123-4567" />
                                        <Input label="Website" placeholder="https://organization.com" />
                                    </div>
                                    <div className="mt-4">
                                        <Button>Save Changes</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}; 