import React, { useState } from 'react';
import {
    Search,
    Filter,
    Eye,
    Check,
    X,
    Calendar,
    FileText,
    Download,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import Container from '../components/layout/Container';
import { OrganizerRequest } from '../types';

// Mock organizer requests data with pagination - matches backend schema exactly
const generateMockRequests = (): OrganizerRequest[] => {
    const requests: OrganizerRequest[] = [];
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Wilson', 'Charlie Brown', 'Diana Prince', 'Edward Norton', 'Fiona Green'];
    const overviews = [
        'Experienced event organizer with 5+ years in corporate events',
        'Specialized in music festivals and entertainment events',
        'Tech conference organizer with startup background',
        'Non-profit event coordinator with community focus',
        'Wedding and social event planning expert',
        'Sports tournament and competition organizer',
        'Art gallery and cultural event specialist',
        'Food festival and culinary event organizer'
    ];

    for (let i = 1; i <= 43; i++) {
        requests.push({
            id: i,
            userId: i + 100,
            overview: overviews[i % overviews.length],
            resume: i % 3 === 0 ? `https://example.com/resume-${i}.pdf` : null,
            createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
            user: {
                id: i + 100,
                name: names[i % names.length] + ` ${i}`,
                email: `applicant${i}@example.com`,
                role: 'USER' as const,
                profileImage: i % 4 === 0 ? `https://images.unsplash.com/photo-${1500000000000 + i}?w=100&h=100&fit=crop&crop=face` : null,
                createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
                updatedAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString()
            }
        });
    }
    return requests;
};

const mockRequests = generateMockRequests();

const AdminOrganizerRequestsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [processedRequests, setProcessedRequests] = useState<{ [key: number]: 'approved' | 'rejected' }>({});

    // Filter requests
    const filteredRequests = mockRequests.filter(request => {
        const matchesSearch = request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.overview.toLowerCase().includes(searchTerm.toLowerCase());

        const requestStatus = processedRequests[request.id] || 'pending';
        const matchesStatus = statusFilter === 'all' || requestStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

    const handleAction = (action: 'approve' | 'reject' | 'view', request: OrganizerRequest) => {
        if (action === 'approve' || action === 'reject') {
            setProcessedRequests(prev => ({
                ...prev,
                [request.id]: action === 'approve' ? 'approved' : 'rejected'
            }));
            alert(`Request ${action}d for ${request.user.name} (mock action)`);
        } else {
            alert(`View request details for ${request.user.name} (mock action)`);
        }
    };

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

    const pendingCount = mockRequests.filter(r => !processedRequests[r.id]).length;
    const approvedCount = Object.values(processedRequests).filter(s => s === 'approved').length;
    const rejectedCount = Object.values(processedRequests).filter(s => s === 'rejected').length;

    return (
        <Container>
            <div className="py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Organizer Requests</h1>
                    <p className="text-neutral-600">Review and manage organizer applications</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-neutral-900">{mockRequests.length}</p>
                            <p className="text-sm text-neutral-600">Total Requests</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-warning-600">{pendingCount}</p>
                            <p className="text-sm text-neutral-600">Pending Review</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-success-600">{approvedCount}</p>
                            <p className="text-sm text-neutral-600">Approved</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-error-600">{rejectedCount}</p>
                            <p className="text-sm text-neutral-600">Rejected</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <Input
                                    placeholder="Search by name, email, or overview..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-neutral-500" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Applicant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Overview
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Applied
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {paginatedRequests.map((request) => {
                                    const status = processedRequests[request.id] || 'pending';
                                    const StatusIcon = getStatusIcon(status);

                                    return (
                                        <tr key={request.id} className="hover:bg-neutral-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                                                        {request.user.profileImage ? (
                                                            <img
                                                                src={request.user.profileImage}
                                                                alt={request.user.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-neutral-500 text-sm font-medium">
                                                                {request.user.name.charAt(0)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-neutral-900">{request.user.name}</div>
                                                        <div className="text-sm text-neutral-500">{request.user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-neutral-900 max-w-xs">
                                                    {request.overview.length > 80
                                                        ? `${request.overview.substring(0, 80)}...`
                                                        : request.overview
                                                    }
                                                </div>
                                                {request.resume && (
                                                    <div className="flex items-center mt-2">
                                                        <FileText className="w-4 h-4 text-primary-600 mr-1" />
                                                        <span className="text-xs text-primary-600">Resume attached</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <StatusIcon className="w-4 h-4 mr-2" />
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleAction('view', request)}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    {request.resume && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => alert('Download resume (mock)')}
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {status === 'pending' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleAction('approve', request)}
                                                                className="bg-success-600 hover:bg-success-700"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleAction('reject', request)}
                                                                className="bg-error-600 hover:bg-error-700"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-neutral-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-neutral-500">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of {filteredRequests.length} requests
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

export default AdminOrganizerRequestsPage;