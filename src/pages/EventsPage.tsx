import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { message } from 'antd';

import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EventCard from '../components/features/EventCard';
import useEventStore from '../store/eventStore';
import { useAuthStore } from '../store/authStore';
import { EventQuery } from '../services';

const EventsPage: React.FC = () => {
    const location = useLocation()
    const { user, isAuthenticated } = useAuthStore()
    const { allEvents, pagination, isLoading, isMutating, error, fetchEvents, bookEvent, clearError, selectedFilters } = useEventStore()

    const [showFilters, setShowFilters] = useState(false);
    const [tempFilters, setTempFilters] = useState<EventQuery>({});
    const navigate = useNavigate();


    useEffect(() => {
        clearError()
    }, [clearError])

    useEffect(() => {
        setTempFilters(selectedFilters)
    }, [selectedFilters])
    useEffect(() => {
        fetchEvents({ ...selectedFilters, page: 1 });
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (JSON.stringify(tempFilters) !== JSON.stringify(selectedFilters)) {
                handleSearch();
            }
        }, 500)

        return () => clearTimeout(timeout);
    }, [tempFilters]);


    const handleSearch = () => {
        const query: EventQuery = {
            ...tempFilters,
            page: 1,
        };
        fetchEvents(query);
    };

    const handlePageChange = (newPage: number) => {
        console.log(newPage);

        const query: EventQuery = {
            ...selectedFilters,
            page: newPage,
        };
        console.log(query);

        fetchEvents(query);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    const handleClearFilters = () => {
        setTempFilters({});
        fetchEvents({ page: 1 });
        setShowFilters(false);
    }


    const handleBookEvent = async (eventId: number) => {

        if (!isAuthenticated) {
            message.warning('Please login to book events');
            navigate('/login');
            return;
        }
        try {
            await bookEvent(eventId);
            message.success("Event booked successfully!")
        } catch (error) {

        }
    }
    const updateTempFilter = (key: keyof EventQuery, value: string | undefined) => {
        setTempFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }));
    };

    const canCreateEvent: boolean = (isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'ORGANIZER'));
    const { currentPage, totalPages, totalItems } = pagination.allEvents;
    const hasActiveFilters = Object.values(selectedFilters).some(Boolean);
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <Container>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-neutral-800">
                            Discover Events
                        </h1>
                        <p className="text-neutral-600 mt-2">
                            Find amazing events happening around you
                        </p>
                        {totalItems > 0 && (
                            <p className="text-sm text-neutral-500 mt-1">
                                {totalItems} events found
                            </p>
                        )}
                    </div>

                    {canCreateEvent && (
                        <Button
                            variant="primary"
                            onClick={() => navigate('/create-event', { state: { from: location.pathname } })}
                        >
                            Create Event
                        </Button>
                    )}
                </div>

                {/* Search and Filter Section */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1">
                        <Input
                            placeholder="Search events by title, description, location..."
                            value={tempFilters.search || ''}
                            onChange={(e) => updateTempFilter('search', e.target.value)}
                            leftIcon={Search}
                            className="w-full"
                        />
                    </div>

                    {/* Filter Button */}
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        {hasActiveFilters && (
                            <span className="ml-2 bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                                {Object.values(selectedFilters).filter(Boolean).length - 1}
                            </span>
                        )}
                    </Button>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-lg border border-neutral-200 p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-neutral-800">Filter Events</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Location Filter */}
                            <Input
                                label="Location"
                                placeholder="Enter location"
                                value={tempFilters.location || ''}
                                onChange={(e) => updateTempFilter('location', e.target.value)}
                                leftIcon={MapPin}
                            />

                            {/* Date Filters */}
                            <Input
                                label="Date From"
                                type="date"
                                value={tempFilters.startDate || ''}
                                onChange={(e) => updateTempFilter('startDate', e.target.value)}
                                leftIcon={Calendar}
                            />

                            <Input
                                label="Date To"
                                type="date"
                                value={tempFilters.endDate || ''}
                                onChange={(e) => updateTempFilter('endDate', e.target.value)}
                                leftIcon={Calendar}
                            />
                        </div>

                        {/* Sorting Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={`${tempFilters.sortBy || 'date'}-${tempFilters.sortOrder || 'asc'}`}
                                    onChange={(e) => {
                                        const [field, order] = e.target.value.split('-');
                                        updateTempFilter('sortBy', field as 'date' | 'title' | 'createdAt');
                                        updateTempFilter('sortOrder', order as 'asc' | 'desc');
                                    }}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="date-asc">Date (Earliest First)</option>
                                    <option value="date-desc">Date (Latest First)</option>
                                    <option value="title-asc">Title A-Z</option>
                                    <option value="title-desc">Title Z-A</option>
                                    <option value="createdAt-desc">Newest Created</option>
                                    <option value="createdAt-asc">Oldest Created</option>
                                </select>
                            </div>

                            {/* Results Per Page */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Results Per Page
                                </label>
                                <select
                                    value={tempFilters.limit || 10}
                                    onChange={(e) => updateTempFilter('limit', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value={10}>10 per page</option>
                                    <option value={20}>20 per page</option>
                                    <option value={50}>50 per page</option>
                                </select>
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={handleClearFilters}>
                                Clear All
                            </Button>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-red-700">{error}</p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearError}
                            >
                                Dismiss
                                <X className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Events Content */}
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <LoadingSpinner size="lg" />
                                <p className="mt-4 text-neutral-600">Loading events...</p>
                            </div>
                        </div>
                    ) : allEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                                No events found
                            </h3>
                            <p className="text-neutral-500 mb-6">
                                {hasActiveFilters
                                    ? "Try adjusting your search or filter criteria"
                                    : "Be the first to create an event!"
                                }
                            </p>
                            {canCreateEvent && (
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/create-event', { state: { from: location.pathname } })}
                                >
                                    Create First Event
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Events Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {allEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        onBook={handleBookEvent}
                                        loading={isMutating}
                                    />
                                ))}
                            </div>

                            {/* Pagination Controls - Simplified */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
                                    {/* Results Info - Simplified */}
                                    <div className="text-sm text-neutral-700">
                                        Page {currentPage} of {totalPages} • {totalItems} total events
                                    </div>

                                    {/* Pagination Buttons */}
                                    <div className="flex items-center space-x-2">
                                        {/* Previous Button */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1 || isLoading}
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Previous
                                        </Button>

                                        {/* Page Numbers */}
                                        <div className="hidden sm:flex space-x-1">
                                            {getPageNumbers().map((pageNum) => (
                                                <Button
                                                    key={pageNum}
                                                    variant={pageNum === currentPage ? "primary" : "ghost"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNum)}
                                                    disabled={isLoading}
                                                    className="min-w-10"
                                                >
                                                    {pageNum}
                                                </Button>
                                            ))}
                                        </div>

                                        {/* Mobile Page Info */}
                                        <div className="sm:hidden text-sm text-neutral-600">
                                            {currentPage} / {totalPages}
                                        </div>

                                        {/* Next Button */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages || isLoading}
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default EventsPage;