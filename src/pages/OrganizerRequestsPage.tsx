import React, { useState } from 'react';
import {
    Search,
    Calendar,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Eye
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import Container from '../components/layout/Container';
import { OrganizerRequest } from '../services';



const OrganizerRequestsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [requestStatuses] = useState<{ [key: number]: 'pending' | 'approved' | 'rejected' }>({
        1: 'approved',
        2: 'pending'
    });

    // Filter requests
    const filteredRequests = mockOrganizerRequests.filter(request => {
        return request.overview.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Pagination
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-success-100 text-success-700';
            case 'rejected':
                return 'bg-error-100 text-error-700';
            case 'pending':
                return 'bg-warning-100 text-warning-700';
            default:
                return 'bg-neutral-100 text-neutral-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return CheckCircle;
            case 'rejected':
                return XCircle;
            case 'pending':
                return Clock;
            default:
                return Clock;
        }
    };

    return (
        <Container>
            <div className="py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Organizer Requests</h1>
                    <p className="text-neutral-600">Track your organizer application status</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-neutral-900">{mockOrganizerRequests.length}</p>
                            <p className="text-sm text-neutral-600">Total Requests</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-warning-600">
                                {Object.values(requestStatuses).filter(s => s === 'pending').length}
                            </p>
                            <p className="text-sm text-neutral-600">Pending Review</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-success-600">
                                {Object.values(requestStatuses).filter(s => s === 'approved').length}
                            </p>
                            <p className="text-sm text-neutral-600">Approved</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                            placeholder="Search your requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Requests List */}
                <div className="space-y-6">
                    {paginatedRequests.map((request) => {
                        const status = requestStatuses[request.id] || 'pending';
                        const StatusIcon = getStatusIcon(status);

                        return (
                            <div key={request.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <StatusIcon className="w-5 h-5" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-neutral-900">
                                                Organizer Application #{request.id}
                                            </h3>
                                            <div className="flex items-center text-sm text-neutral-500 mt-1">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                Applied on {new Date(request.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Overview:</h4>
                                    <p className="text-sm text-neutral-600">{request.overview}</p>
                                </div>

                                {request.resume && (
                                    <div className="mb-4">
                                        <div className="flex items-center">
                                            <FileText className="w-4 h-4 text-primary-600 mr-2" />
                                            <span className="text-sm text-primary-600">Resume attached</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                                    <div className="text-sm text-neutral-500">
                                        {status === 'pending' && 'Your request is being reviewed by our admin team.'}
                                        {status === 'approved' && 'Congratulations! Your request has been approved.'}
                                        {status === 'rejected' && 'Your request was not approved. You can submit a new application.'}
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}

                {/* Empty State */}
                {filteredRequests.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">No requests found</h3>
                        <p className="text-neutral-600 mb-4">
                            {searchTerm
                                ? 'Try adjusting your search terms'
                                : 'You haven\'t submitted any organizer requests yet'
                            }
                        </p>
                        <Button>Submit New Request</Button>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default OrganizerRequestsPage;