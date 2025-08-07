import React, { useState } from 'react';
import {
    Search,
    Filter,
    Eye,
    Trash2,
    Edit,
    Calendar,
    MapPin,
    Users,
    MoreVertical
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import Container from '../components/layout/Container';
import { Event } from '../types';

// Mock events data with pagination - matches backend schema exactly
const generateMockEvents = (): Event[] => {
    const events: Event[] = [];
    const titles = [
        'Tech Conference 2024', 'Music Festival', 'Art Exhibition', 'Food Festival',
        'Sports Tournament', 'Book Fair', 'Science Expo', 'Fashion Show'
    ];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];

    for (let i = 1; i <= 89; i++) {
        const randomTitle = titles[i % titles.length];
        const randomCity = cities[i % cities.length];

        events.push({
            id: i,
            title: `${randomTitle} ${i}`,
            description: `Join us for an amazing ${randomTitle.toLowerCase()} experience with great speakers, networking, and entertainment. This event will bring together industry leaders and enthusiasts for an unforgettable experience.`,
            date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
            images: [`https://images.unsplash.com/photo-${1540575467063 + (i * 1000)}?w=500`],
            registrations: [],
            user: {
                id: Math.floor(i / 10) + 1,
                name: `Organizer ${Math.floor(i / 10) + 1}`,
                email: `organizer${Math.floor(i / 10) + 1}@example.com`,
                role: 'ORGANIZER' as const,
                profileImage: null,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z'
            },
            longitude: -74.0060 + (Math.random() * 2 - 1),
            latitude: 40.7128 + (Math.random() * 2 - 1),
            address: `${100 + i} Event Street`,
            city: randomCity,
            state: 'NY',
            country: 'USA',
            postalCode: `${10000 + i}`,
            createdBy: Math.floor(i / 10) + 1,
            createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
            updatedAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString()
        });
    }
    return events;
};

const mockEvents = generateMockEvents();

const AdminEventsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Filter events
    const filteredEvents = mockEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.user.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

    const handleAction = (action: string, event: Event) => {
        alert(`${action} event: ${event.title} (mock action)`);
    };

    return (
        <Container>
            <div className="py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Event Management</h1>
                    <p className="text-neutral-600">Manage platform events and organizers</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-neutral-900">{mockEvents.length}</p>
                            <p className="text-sm text-neutral-600">Total Events</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-success-600">
                                {mockEvents.filter(e => new Date(e.date) > new Date()).length}
                            </p>
                            <p className="text-sm text-neutral-600">Upcoming Events</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary-600">
                                {new Set(mockEvents.map(e => e.user.id)).size}
                            </p>
                            <p className="text-sm text-neutral-600">Active Organizers</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-warning-600">
                                {mockEvents.filter(e => new Date(e.date) < new Date()).length}
                            </p>
                            <p className="text-sm text-neutral-600">Past Events</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                            placeholder="Search events by title, city, or organizer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Events Table */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Organizer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {paginatedEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-neutral-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 rounded-lg bg-neutral-200 overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={event.images[0]}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-neutral-900">{event.title}</div>
                                                    <div className="text-sm text-neutral-500">
                                                        {event.description.length > 50
                                                            ? `${event.description.substring(0, 50)}...`
                                                            : event.description
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-neutral-900">{event.user.name}</div>
                                            <div className="text-sm text-neutral-500">{event.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <div>
                                                    <div>{new Date(event.date).toLocaleDateString()}</div>
                                                    <div className="text-xs">
                                                        {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                <div>
                                                    <div>{event.city}, {event.state}</div>
                                                    <div className="text-xs">{event.address}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAction('View', event)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAction('Edit', event)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAction('Delete', event)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAction('More', event)}
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-neutral-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-neutral-500">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEvents.length)} of {filteredEvents.length} events
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default AdminEventsPage;