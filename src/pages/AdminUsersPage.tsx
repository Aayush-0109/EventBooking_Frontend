import React, { useState } from 'react';
import {
    Search,
    Filter,
    Eye,
    Ban,
    Mail,
    Calendar,
    MoreVertical
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import Container from '../components/layout/Container';
import { User } from '../types';

// Mock users data with pagination
const generateMockUsers = (): User[] => {
    const users: User[] = [];
    const roles = ['USER', 'ORGANIZER', 'ADMIN'] as const;
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Wilson', 'Charlie Brown', 'Diana Prince', 'Edward Norton', 'Fiona Green'];

    for (let i = 1; i <= 127; i++) {
        users.push({
            id: i,
            name: names[i % names.length] + ` ${i}`,
            email: `user${i}@example.com`,
            role: roles[i % 3],
            profileImage: i % 4 === 0 ? `https://images.unsplash.com/photo-${1500000000000 + i}?w=100&h=100&fit=crop&crop=face` : null,
            createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
            updatedAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString()
        });
    }
    return users;
};

const mockUsers = generateMockUsers();

const AdminUsersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'USER' | 'ORGANIZER' | 'ADMIN'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Filter users
    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-error-100 text-error-700';
            case 'ORGANIZER':
                return 'bg-primary-100 text-primary-700';
            case 'USER':
                return 'bg-success-100 text-success-700';
            default:
                return 'bg-neutral-100 text-neutral-700';
        }
    };

    const handleAction = (action: string, user: User) => {
        alert(`${action} user: ${user.name} (mock action)`);
    };

    return (
        <Container>
            <div className="py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">User Management</h1>
                    <p className="text-neutral-600">Manage platform users and their permissions</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-neutral-900">{mockUsers.length}</p>
                            <p className="text-sm text-neutral-600">Total Users</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-success-600">{mockUsers.filter(u => u.role === 'USER').length}</p>
                            <p className="text-sm text-neutral-600">Regular Users</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary-600">{mockUsers.filter(u => u.role === 'ORGANIZER').length}</p>
                            <p className="text-sm text-neutral-600">Organizers</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-error-600">{mockUsers.filter(u => u.role === 'ADMIN').length}</p>
                            <p className="text-sm text-neutral-600">Admins</p>
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
                                    placeholder="Search users by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-neutral-500" />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value as any)}
                                className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="USER">Users</option>
                                <option value="ORGANIZER">Organizers</option>
                                <option value="ADMIN">Admins</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {paginatedUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-neutral-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                                                    {user.profileImage ? (
                                                        <img
                                                            src={user.profileImage}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-neutral-500 text-sm font-medium">
                                                            {user.name.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-neutral-900">{user.name}</div>
                                                    <div className="text-sm text-neutral-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAction('View', user)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAction('Email', user)}
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </Button>
                                                {user.role !== 'ADMIN' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleAction('Ban', user)}
                                                    >
                                                        <Ban className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAction('More', user)}
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
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
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

export default AdminUsersPage;