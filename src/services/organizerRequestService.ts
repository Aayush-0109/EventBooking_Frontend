import { get, post, put } from './api/client';
import {
    OrganizerRequest,
    CreateOrganizerRequestData,
    UpdateRequestStatusData,
    OrganizerRequestQuery,
    PaginatedResponse,
    ApiResponse,
    UpdateRequestStatusResponse
} from './api/types';

class OrganizerRequestService {
    static async createRequest(requestData: CreateOrganizerRequestData): Promise<ApiResponse<OrganizerRequest>> {
        const formData = new FormData()
        formData.append("overview", requestData.overview);
        formData.append("resume", requestData.resume);

        const response = await post<OrganizerRequest>("/organizer-request/create", formData);
        return response.data;
    }
    static async getRequests(query?: OrganizerRequestQuery): Promise<ApiResponse<PaginatedResponse<OrganizerRequest>>> {
        const response = await get<PaginatedResponse<OrganizerRequest>>('/organizer-request/get', { params: query });
        return response.data;
    }
    static async getRequestById(id: number): Promise<ApiResponse<OrganizerRequest>> {
        const response = await get<OrganizerRequest>(`/organizer-request/get/${id}`);
        return response.data;
    }
    static async updateRequestStatus(id: number, statusData: UpdateRequestStatusData): Promise<ApiResponse<UpdateRequestStatusResponse>> {
        const response = await put<UpdateRequestStatusResponse>(`/organizer-request/update/${id}`, statusData);
        return response.data;
    }
}
export default OrganizerRequestService