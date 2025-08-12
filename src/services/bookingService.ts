import { get, del } from './api/client';
import {
    Registration,
    RegistrationQuery,
    PaginatedResponse,
    ApiResponse,
    RegistrationsResponse
} from './api/types';

class BookingService {
    static async getBookingById(id: number): Promise<ApiResponse<Registration>> {
        const response = await get<Registration>(`/booking/${id}`);
        return response.data;
    }
    static async getUserBookings(query?: RegistrationQuery): Promise<ApiResponse<RegistrationsResponse>> {
        const response = await get<RegistrationsResponse>('/booking/get/my-bookings', { params: query });
        return response.data;
    }
    static async cancelBooking(id: number): Promise<ApiResponse<null>> {
        const response = await del<null>(`/booking/${id}`);
        return response.data;
    }

}

export default BookingService