import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    MapPin,
    User,
    Clock,
    ArrowLeft,
    Mail,
    ExternalLink
} from 'lucide-react';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';
import { Registration } from '../types';

// Mock booking data - matches backend schema exactly
const mockBooking: Registration = {
    id: 1,
    userId: 101,
    eventId: 1,
    registeredAt: '2024-01-15T10:30:00Z',
    user: {
        id: 101,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'USER' as const,
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    event: {
        id: 1,
        title: 'Tech Conference 2024',
        description: 'Join us for the biggest technology conference of the year! This event brings together industry leaders, innovators, and tech enthusiasts for three days of inspiring talks, workshops, and networking opportunities. Learn about the latest trends in AI, blockchain, cloud computing, and more.',
        date: '2024-02-15T09:00:00Z',
        images: [
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
        ],
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
        address: '123 Convention Center Blvd',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
        createdBy: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
};

const BookingDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const [booking] = useState(mockBooking);
    const [loading] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const handleCancel = async () => {
        setCancelling(true);
        // Mock cancellation
        setTimeout(() => {
            setCancelling(false);
            alert('Booking cancelled successfully (mock action)');
        }, 1000);
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    if (loading) {
        return (
            <Container>
                <div className="py-8 text-center">
                    <div className="text-lg text-neutral-600">Loading booking details...</div>
                </div>
            </Container>
        );
    }

    if (!booking) {
        return (
            <Container>
                <div className="py-8 text-center">
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">Booking Not Found</h1>
                    <p className="text-neutral-600 mb-4">The booking you're looking for doesn't exist.</p>
                    <Button onClick={handleBack}>Back to Dashboard</Button>
                </div>
            </Container>
        );
    }

    const isUpcoming = new Date(booking.event.date) > new Date();
    const eventDate = new Date(booking.event.date);
    const registrationDate = new Date(booking.registeredAt);

    return (
        <Container>
            <div className="py-8">
                {/* Back Button */}
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>

                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-900 mb-2">Booking Details</h1>
                                <p className="text-neutral-600">Registration ID: #{booking.id}</p>
                            </div>
                            <div className="text-right">
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${isUpcoming ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-700'
                                    }`}>
                                    {isUpcoming ? 'Confirmed' : 'Completed'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Event Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Event Information</h2>

                            {/* Event Image */}
                            {booking.event.images.length > 0 && (
                                <div className="mb-4">
                                    <img
                                        src={booking.event.images[0]}
                                        alt={booking.event.title}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-neutral-900 text-lg">{booking.event.title}</h3>
                                    <p className="text-neutral-600 text-sm mt-1">{booking.event.description}</p>
                                </div>

                                <div className="flex items-center text-neutral-600">
                                    <Calendar className="w-4 h-4 mr-3" />
                                    <div>
                                        <div className="font-medium">
                                            {eventDate.toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-sm">
                                            {eventDate.toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start text-neutral-600">
                                    <MapPin className="w-4 h-4 mr-3 mt-0.5" />
                                    <div>
                                        <div className="font-medium">{booking.event.address}</div>
                                        <div className="text-sm">
                                            {booking.event.city}, {booking.event.state} {booking.event.postalCode}
                                        </div>
                                        <div className="text-sm">{booking.event.country}</div>
                                    </div>
                                </div>

                                <div className="flex items-center text-neutral-600">
                                    <User className="w-4 h-4 mr-3" />
                                    <div>
                                        <div className="font-medium">Organized by {booking.event.user.name}</div>
                                        <div className="text-sm">{booking.event.user.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="space-y-6">
                            {/* Registration Info */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Registration Information</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center text-neutral-600">
                                        <Clock className="w-4 h-4 mr-3" />
                                        <div>
                                            <div className="font-medium">Registered on</div>
                                            <div className="text-sm">
                                                {registrationDate.toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })} at {registrationDate.toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start text-neutral-600">
                                        <User className="w-4 h-4 mr-3 mt-0.5" />
                                        <div>
                                            <div className="font-medium">Registered User</div>
                                            <div className="text-sm">{booking.user.name}</div>
                                            <div className="text-sm">{booking.user.email}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Actions</h2>

                                <div className="space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => navigate(`/events/${booking.event.id}`)}
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        View Event Details
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => alert('Contact organizer (mock action)')}
                                    >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Contact Organizer
                                    </Button>

                                    {isUpcoming && (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-error-600 border-error-200 hover:bg-error-50"
                                            onClick={handleCancel}
                                            loading={cancelling}
                                            disabled={cancelling}
                                        >
                                            Cancel Registration
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default BookingDetailsPage;