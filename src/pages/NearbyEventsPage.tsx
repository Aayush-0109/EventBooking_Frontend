import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import EventCard from '../components/features/EventCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import Container from '../components/layout/Container';
import { Event } from '../types';





const NearbyEventsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const [radiusFilter, setRadiusFilter] = useState<'5' | '10' | '25' | '50'>('10');

    // Filter events
    const filteredEvents = mockNearbyEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.address.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Container>
            <div className="py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Nearby Events</h1>
                    <p className="text-neutral-600">Discover events happening in your area</p>
                </div>

                {/* Map Placeholder */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-8">
                    <div className="w-full h-64 bg-neutral-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                            <span className="text-neutral-500">Interactive Map Coming Soon</span>
                            <p className="text-sm text-neutral-400 mt-1">Events will be displayed on an interactive map</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <Input
                                    placeholder="Search nearby events..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-neutral-500" />
                            <select
                                value={radiusFilter}
                                onChange={(e) => setRadiusFilter(e.target.value as any)}
                                className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="5">Within 5 km</option>
                                <option value="10">Within 10 km</option>
                                <option value="25">Within 25 km</option>
                                <option value="50">Within 50 km</option>
                            </select>
                        </div>
                        <Button variant="outline">
                            <MapPin className="w-4 h-4 mr-2" />
                            Use Current Location
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary-600">{filteredEvents.length}</p>
                            <p className="text-sm text-neutral-600">Events Found</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-success-600">
                                {filteredEvents.filter(e => new Date(e.date) > new Date()).length}
                            </p>
                            <p className="text-sm text-neutral-600">Upcoming</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-neutral-900">{radiusFilter} km</p>
                            <p className="text-sm text-neutral-600">Search Radius</p>
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                {paginatedEvents.length === 0 ? (
                    <div className="text-center py-12">
                        <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">No nearby events found</h3>
                        <p className="text-neutral-600 mb-4">
                            {searchTerm
                                ? 'Try adjusting your search or increasing the radius'
                                : 'There are no events in your selected area'
                            }
                        </p>
                        <Button>Browse All Events</Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {paginatedEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
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
                        )}
                    </>
                )}
            </div>
        </Container>
    );
};

export default NearbyEventsPage;