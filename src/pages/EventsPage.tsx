import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import EventCard from '../components/features/EventCard';

const mockEvents = [
    {
        id: 1,
        title: 'Tech Conference 2024',
        description: 'Join us for the biggest technology conference of the year! This event brings together industry leaders, innovators, and tech enthusiasts for three days of inspiring talks, workshops, and networking opportunities.',
        date: '2024-08-01T18:00:00Z',
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
        address: '123 Convention Center Blvd',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
        createdBy: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 2,
        title: 'Music Festival 2024',
        description: 'Experience the best live music performances from top artists around the world. A three-day festival featuring rock, pop, electronic, and indie music.',
        date: '2024-08-05T20:00:00Z',
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
        address: '456 Central Park West',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10023',
        createdBy: 2,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
];

const EventsPage: React.FC = () => {
    const [loading] = useState(false);
    const [events] = useState(mockEvents);
    const navigate = useNavigate();

    // Simulate loading state
    // useEffect(() => {
    //   setLoading(true);
    //   setTimeout(() => setLoading(false), 1000);
    // }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-neutral-800">All Events</h1>
                    <p className="text-neutral-600 mt-2">Discover amazing events happening around you</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/create-event')}>Create Event</Button>
            </div>
            {/* Events Grid */}
            {loading ? (
                <div>Loading events...</div>
            ) : events.length === 0 ? (
                <div>No events found.</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventsPage;