import { get, post, put, del } from './api/client'
import {
    ApiResponse,
    EventsResponse,
    EventQuery,
    CreateEventData,
    Event,
    NearbyEventsQuery,
    UpdateEventData,
    Registration,
    RegistrationsResponse, RegistrationQuery

} from './api/types'

class EventService {
    static async getEvents(query?: EventQuery): Promise<ApiResponse<EventsResponse>> {
        if (query?.startDate)
            query.startDate = new Date(query?.startDate).toISOString()
        if (query?.endDate)
            query.endDate = new Date(query.endDate).toISOString()
        const response = await get<EventsResponse>("/events", { params: query });
        return response.data;
    }
    static async getEventById(id: number): Promise<ApiResponse<Event>> {
        const response = await get<Event>(`/events/${id}`);
        return response.data;
    }
    static async getNearbyEvents(query: NearbyEventsQuery): Promise<ApiResponse<EventsResponse>> {
        const response = await get<EventsResponse>("/events/search/nearby", { params: query });
        return response.data;
    }
    static async createEvent(eventData: CreateEventData): Promise<ApiResponse<Event>> {
        if (eventData.images && eventData.images.length > 0) {
            const formData = new FormData();
            Object.entries(eventData).forEach(([key, value]) => {
                if (key !== 'images' && value !== undefined) {
                    formData.append(key, value.toString());
                }
            });

            eventData.images.forEach((image) => {
                formData.append("images", image)
            });
            const response = await post<Event>("/events", formData);
            return response.data;
        }
        else {
            const { images, ...formData } = eventData;
            const response = await post<Event>("/events", formData);
            return response.data
        }
    }
    static async updateEvent(id: number, eventData: UpdateEventData): Promise<ApiResponse<Event>> {
        const response = await put<Event>(`/events/${id}`, eventData);
        return response.data;
    }
    static async deleteEvent(id: number): Promise<ApiResponse<null>> {
        const response = await del<null>(`/events/${id}`);
        return response.data;
    }
    static async bookEvent(eventId: number): Promise<ApiResponse<Registration>> {
        const response = await post<Registration>(`/events/${eventId}/book`);
        return response.data;
    }
    static async getEventBookings(eventId: number, query?: RegistrationQuery): Promise<ApiResponse<RegistrationsResponse>> {
        const response = await get<RegistrationsResponse>(`/events/get/bookings/${eventId}`, { params: query });
        return response.data;
    }
    static async getMyEvents(query?: EventQuery): Promise<ApiResponse<EventsResponse>> {
        const response = await get<EventsResponse>('/events/get/my-events', { params: query });
        return response.data;
    }
}


export default EventService