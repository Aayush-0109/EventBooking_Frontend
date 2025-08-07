import React from 'react';
import {
    Users,
    Calendar,
    FileText,
    TrendingUp,
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock
} from 'lucide-react';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';

// Mock data for admin dashboard
const mockStats = {
    totalUsers: 1247,
    totalEvents: 89,
    pendingRequests: 12,
    totalRevenue: 45230,
    monthlyGrowth: 12.5,
    activeEvents: 34,
    completedEvents: 55,
    totalRegistrations: 3456
};

const mockRecentActivity = [
    {
        id: 1,
        type: 'user_registered',
        message: 'New user John Doe registered',
        timestamp: '2024-01-15T10:30:00Z',
        icon: Users,
        color: 'text-blue-600'
    },
    {
        id: 2,
        type: 'event_created',
        message: 'New event "Tech Conference 2024" created',
        timestamp: '2024-01-15T09:15:00Z',
        icon: Calendar,
        color: 'text-green-600'
    },
    {
        id: 3,
        type: 'organizer_request',
        message: 'New organizer request submitted',
        timestamp: '2024-01-15T08:45:00Z',
        icon: FileText,
        color: 'text-orange-600'
    },
    {
        id: 4,
        type: 'event_completed',
        message: 'Event "Music Festival" completed',
        timestamp: '2024-01-14T18:00:00Z',
        icon: CheckCircle,
        color: 'text-success-600'
    }
];

const mockPendingRequests = [
    {
        id: 1,
        type: 'organizer_request',
        title: 'Organizer Application - Tech Events Inc',
        description: 'Request to become an event organizer',
        timestamp: '2024-01-15T10:00:00Z',
        priority: 'high'
    },
    {
        id: 2,
        type: 'event_approval',
        title: 'Event Approval - Music Festival',
        description: 'Event waiting for admin approval',
        timestamp: '2024-01-15T09:30:00Z',
        priority: 'medium'
    },
    {
        id: 3,
        type: 'user_report',
        title: 'User Report - Inappropriate Content',
        description: 'User reported for inappropriate behavior',
        timestamp: '2024-01-15T08:15:00Z',
        priority: 'high'
    }
];

const AdminDashboardPage: React.FC = () => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-error-100 text-error-700';
            case 'medium':
                return 'bg-warning-100 text-warning-700';
            case 'low':
                return 'bg-success-100 text-success-700';
            default:
                return 'bg-neutral-100 text-neutral-700';
        }
    };

    return (
        <Container>
            <div className="py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Dashboard</h1>
                    <p className="text-neutral-600">Overview of platform activity and management</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-600">Total Users</p>
                                <p className="text-2xl font-bold text-neutral-900">{mockStats.totalUsers.toLocaleString()}</p>
                                <p className="text-sm text-success-600 mt-1">+{mockStats.monthlyGrowth}% this month</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-600">Total Events</p>
                                <p className="text-2xl font-bold text-neutral-900">{mockStats.totalEvents}</p>
                                <p className="text-sm text-neutral-600 mt-1">{mockStats.activeEvents} active</p>
                            </div>
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-primary-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-600">Pending Requests</p>
                                <p className="text-2xl font-bold text-neutral-900">{mockStats.pendingRequests}</p>
                                <p className="text-sm text-warning-600 mt-1">Requires attention</p>
                            </div>
                            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-warning-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-600">Total Registrations</p>
                                <p className="text-2xl font-bold text-neutral-900">{mockStats.totalRegistrations.toLocaleString()}</p>
                                <p className="text-sm text-success-600 mt-1">Growing steadily</p>
                            </div>
                            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-success-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-neutral-900">Recent Activity</h2>
                            <Button variant="outline" size="sm">View All</Button>
                        </div>

                        <div className="space-y-4">
                            {mockRecentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3">
                                    <div className={`p-2 rounded-full bg-neutral-100`}>
                                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-neutral-900">{activity.message}</p>
                                        <p className="text-sm text-neutral-500">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Requests */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-neutral-900">Pending Requests</h2>
                            <Button variant="outline" size="sm">View All</Button>
                        </div>

                        <div className="space-y-4">
                            {mockPendingRequests.map((request) => (
                                <div key={request.id} className="border border-neutral-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-medium text-neutral-900">{request.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                            {request.priority}
                                        </span>
                                    </div>
                                    <p className="text-sm text-neutral-600 mb-3">{request.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-neutral-500">
                                            {new Date(request.timestamp).toLocaleString()}
                                        </span>
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="outline">Review</Button>
                                            <Button size="sm">Approve</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button className="justify-start" variant="outline">
                            <Users className="w-4 h-4 mr-2" />
                            Manage Users
                        </Button>
                        <Button className="justify-start" variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            Manage Events
                        </Button>
                        <Button className="justify-start" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Review Requests
                        </Button>
                        <Button className="justify-start" variant="outline">
                            <Activity className="w-4 h-4 mr-2" />
                            View Analytics
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default AdminDashboardPage;