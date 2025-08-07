// User types (matching your backend schema)
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'ORGANIZER' | 'ADMIN';
    profileImage: string | null;
    createdAt: string;
    updatedAt: string;
}

// Event types (matching your backend schema)
export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    images: string[];
    longitude: number;
    latitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
    registrations: Registration[];
    user: User;
}

// Registration types
export interface Registration {
    id: number;
    userId: number;
    eventId: number;
    registeredAt: string;
    user: User;
    event: Event;
}

// Organizer Request types
export interface OrganizerRequest {
    id: number;
    userId: number;
    overview: string;
    resume: string | null;
    createdAt: string;
    user: User;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

// Form types
export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    name: string;
    email: string;
    password: string;
}

export interface CreateEventForm {
    title: string;
    description: string;
    date: string;
    longitude: number;
    latitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

// UI State types
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

// Navigation types
export interface NavItem {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}