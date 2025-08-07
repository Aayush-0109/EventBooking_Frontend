import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, X } from 'lucide-react';
import Button from './Button';
import Input from './Input';

export interface SearchFilters {
    query: string;
    category: string;
    location: string;
    dateFrom: string;
    dateTo: string;
    priceRange: string;
}

interface SearchBarProps {
    filters: SearchFilters;
    onFiltersChange: (filters: SearchFilters) => void;
    onSearch: () => void;
    showAdvancedFilters?: boolean;
}

const categories = [
    'All Categories',
    'Technology',
    'Music',
    'Business',
    'Education',
    'Sports',
    'Arts & Culture',
    'Food & Drink',
    'Health & Wellness',
    'Networking',
    'Other'
];

const priceRanges = [
    'Any Price',
    'Free',
    'Under $25',
    '$25 - $50',
    '$50 - $100',
    'Over $100'
];

export const SearchBar: React.FC<SearchBarProps> = ({
    filters,
    onFiltersChange,
    onSearch,
    showAdvancedFilters = false
}) => {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(showAdvancedFilters);

    const handleFilterChange = (key: keyof SearchFilters, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value
        });
    };

    const clearFilters = () => {
        onFiltersChange({
            query: '',
            category: 'All Categories',
            location: '',
            dateFrom: '',
            dateTo: '',
            priceRange: 'Any Price'
        });
    };

    const hasActiveFilters = filters.query ||
        filters.category !== 'All Categories' ||
        filters.location ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.priceRange !== 'Any Price';

    return (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
            {/* Basic Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                            placeholder="Search events..."
                            value={filters.query}
                            onChange={(e) => handleFilterChange('query', e.target.value)}
                            className="pl-10"
                            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                        className="flex items-center space-x-2"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                    </Button>

                    <Button onClick={onSearch}>
                        Search
                    </Button>
                </div>
            </div>

            {/* Advanced Filters */}
            {isAdvancedOpen && (
                <div className="mt-4 pt-4 border-t border-neutral-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location Filter */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <Input
                                    placeholder="Enter location"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                From Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <Input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                To Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <Input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Price Range
                        </label>
                        <select
                            value={filters.priceRange}
                            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            {priceRanges.map(range => (
                                <option key={range} value={range}>
                                    {range}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="flex items-center space-x-1"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Clear All</span>
                                </Button>
                            )}
                        </div>

                        <div className="text-sm text-neutral-500">
                            {hasActiveFilters && 'Filters applied'}
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && !isAdvancedOpen && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-neutral-600">
                            <span>Active filters:</span>
                            {filters.category !== 'All Categories' && (
                                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                                    {filters.category}
                                </span>
                            )}
                            {filters.location && (
                                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                                    {filters.location}
                                </span>
                            )}
                            {filters.priceRange !== 'Any Price' && (
                                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                                    {filters.priceRange}
                                </span>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                        >
                            Clear All
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}; 