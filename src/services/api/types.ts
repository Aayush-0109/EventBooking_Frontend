export interface ApiResponse<T = any> {
    success: boolean;
    statusCode: number;
    data: T;
    message: string;
}
export interface ApiError {
    success: false;
    statusCode: number;
    message: string;
    errors?: Record<string, string[]>;
}
export interface User {
    id : number;
    name : string;
    email : string;
    role : 'USER'| 'ORGANIZER'| 'ADMIN';
    profileImage : string | null;
}
export interface LoginCredentials{
    email : string;
    password : string;
}
export interface RegisterData {
    name : string;
    email : string;
    password : string;
    profileImage? : File;
}
export interface UpdateUserData{
    name? : string;
    password? : string;
}
export interface Event{
    id: number;
    title: string;           
    description: string;     
    date: string;            
    address: string;         
    city: string;            
    state: string;           
    country: string;         
    postalCode: string;      
    longitude: number;      
    latitude: number;       
    images: string | null;  
    createdBy: number;      
    createdAt: string;      
    updatedAt: string;     
    
    user?: {                 // Creator information
        id: number;
        name: string;
        email? : string;
        profileImage?: {
            url: string;
        } | null;
    };
}

export interface CreateEventData{
    title : string;
    description : string;
    date : string;
    address : string;
    city : string;
    state : string;
    country : string;
    postalCode : string;
    longitude : number;
    latitude : number;
    images? : File[];
}
export interface UpdateEventData {
    title? : string;
    description? : string;
    date? : string;
    address? : string;
    city? : string;
    state? : string;
    country? : string;
    postalCode? : string;
    longitude? : number;
    latitude? : number;
    images? : File[];

}

export interface EventQuery {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;       // Backend uses single 'location' field
    startDate?: string;
    endDate?: string;
    sortBy?: 'date' | 'title' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
export interface PaginationMeta {
    total : number;
    page : number;
    limit : number;
    skip : number;
    totalPages : number;
    hasNextPage : boolean;
    hasPrevPage : boolean;
}
export interface NearbyEventsQuery {
    latitude: number;
    longitude: number;
    radius?: number;         
    unit?: 'km' | 'miles';   
    page?: number;           
    limit?: number;          
}
export interface EventsResponse {
    events: Event[];
    meta: PaginationMeta;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
export interface RegistrationsResponse {
    registrations: Registration[];
    meta: PaginationMeta;
}
export interface OrganizerRequestsResponse {
    requests: OrganizerRequest[];
    meta: PaginationMeta;
}

export interface Registration {
    id: number;
    userId: number;
    eventId: number;
    createdAt: string;
    // Optional populated fields
    user?: {
        id: number;
        name: string;
        email: string;
    };
    event?: Event;
}
export interface RegistrationQuery {
    page?: number;
    limit?: number;
    sortOrder?: 'asc' | 'desc';
}
export interface OrganizerRequest {
    id: number;              // Line 84: @id @default(autoincrement())
    userId: number;          // Line 85: Int @unique
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';  // Line 86: status @default(PENDING) + enum lines 77-81
    overview: string | null; // Line 87: String? (nullable)
    resume: string | null;   // Line 88: Json? (transformed to URL in controller)
    createdAt: string;       // Line 89: DateTime @default(now())
    updateAt: string;        // Line 90: DateTime @updatedAt (note: typo in schema)
    
    // Optional populated fields
    user?: {                 // Line 92: user relation
        id: number;
        name: string;
        email: string;
    };
}
export interface CreateOrganizerRequestData{
    overview : string;
    resume : File
}
export interface UpdateRequestStatusData {
    status : 'ACCEPTED' | 'REJECTED' | 'PENDING'
}
export interface OrganizerRequestQuery {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'status';
    sortOrder?: 'asc' | 'desc';
}
export interface FileUploadConfig {
    fieldName: string;
    allowedTypes?: string[];
    maxSize?: number;        // in bytes
}

// Request configuration
export interface RequestConfig {
    skipAuth?: boolean;
    timeout?: number;
    retries?: number;
}