import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';
import { Event } from '../services/index';
import { formatDate } from '../lib/utils';

export const EventDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isBooking, setIsBooking] = useState(false);

    // In real app, fetch event by ID from API
    const event = mockEvent;

    const handleBookEvent = async () => {
        setIsBooking(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Event booked successfully! You will receive a confirmation email shortly.');
        } catch (error) {
            console.error('Booking failed:', error);
        } finally {
            setIsBooking(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: event.description,
                url: window.location.href,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (!event) {
        return (
            <Container>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">Event Not Found</h2>
                    <p className="text-neutral-600 mb-6">The event you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate('/events')}>Back to Events</Button>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/events')}
                    className="flex items-center text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Events
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Event Images */}
                        <div className="space-y-4">
                            <div className="relative h-96 rounded-xl overflow-hidden">
                                <img
                                    src={event.images?.[currentImageIndex] || '/placeholder-event.jpg'}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Image Thumbnails */}
                            {event.images && event.images.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto">
                                    {event.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${index === currentImageIndex
                                                ? 'border-primary-500'
                                                : 'border-neutral-200'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${event.title} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Event Details */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                                    {event.title}
                                </h1>
                                <p className="text-neutral-600 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>

                            {/* Event Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-5 h-5 text-primary-600" />
                                        <div>
                                            <p className="font-medium text-neutral-900">Date & Time</p>
                                            <p className="text-neutral-600">{formatDate(event.date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <MapPin className="w-5 h-5 text-primary-600" />
                                        <div>
                                            <p className="font-medium text-neutral-900">Location</p>
                                            <p className="text-neutral-600">
                                                {event.address}<br />
                                                {event.city}, {event.state} {event.postalCode}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Users className="w-5 h-5 text-primary-600" />
                                        <div>
                                            <p className="font-medium text-neutral-900">Attendees</p>
                                            <p className="text-neutral-600">
                                                {event.registrations?.length || 0} registered
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-primary-600" />
                                        <div>
                                            <p className="font-medium text-neutral-900">Organizer</p>
                                            <p className="text-neutral-600">{event.user.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 sticky top-8">
                            {/* Booking Button */}
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full mb-4"
                                onClick={handleBookEvent}
                                loading={isBooking}
                                disabled={isBooking}
                            >
                                {isBooking ? 'Booking...' : 'Book This Event'}
                            </Button>

                            {/* Action Buttons */}
                            <div className="flex space-x-2 mb-6">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleShare}
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <Bookmark className="w-4 h-4 mr-2" />
                                    Save
                                </Button>
                            </div>

                            {/* Event Stats */}
                            <div className="pt-6 border-t border-neutral-200">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-600">Registered</span>
                                        <span className="font-medium">{event.registrations?.length || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-600">Created</span>
                                        <span className="font-medium">{formatDate(event.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-600">Last Updated</span>
                                        <span className="font-medium">{formatDate(event.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}; 