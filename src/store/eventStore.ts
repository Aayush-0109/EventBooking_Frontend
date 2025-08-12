import { ApiResponse, Event, EventQuery, PaginationState, NearbyEventsQuery, EventsResponse, CreateEventData, UpdateEventData, RegistrationQuery, EventService } from "../services/index"
import { create } from 'zustand';
import { persist, devtools, subscribeWithSelector } from 'zustand/middleware'
import { createInitialPaginationState, updatePaginationFromMeta } from "../utils/storeHelpers";
import { classifyError } from "../utils/errorHandling";
import { normalizeById, extractIds } from '../utils/storeHelpers'
import { isDevelopment } from "../config/environment";


interface EventStore {
    eventsById: Record<number, Event>;

    // view
    allEventIds: number[];
    nearbyEventIds: number[];
    selectedFilters: EventQuery

    pagination: {
        allEvents: PaginationState,
        nearbyEvents: PaginationState,
    }

    isLoading: boolean,
    isMutating: boolean,
    error: string | null

    fetchEvents: (query?: EventQuery) => Promise<void>
    fetchEventById: (id: number) => Promise<void>
    fetchNearbyEvents: (query: NearbyEventsQuery) => Promise<void>

    createEvent: (eventData: CreateEventData) => Promise<Event>
    updateEvent: (id: number, eventData: UpdateEventData) => Promise<void>
    deleteEvent: (id: number) => Promise<void>

    bookEvent: (eventId: number) => Promise<void>

    clearError: () => void
    clearEvents: () => void

    getEventById: (id: number) => Event | null
    getAllEvents: () => Event[]
    getNearbyEvents: () => Event[]

}

const useEventStore = create<EventStore>()(
    persist(
        devtools(
            (set, get) => ({

                eventsById: {},
                allEventIds: [],
                nearbyEventIds: [],
                pagination: {
                    allEvents: createInitialPaginationState(),
                    nearbyEvents: createInitialPaginationState(),
                },
                selectedFilters: {},
                isLoading: false,
                isMutating: false,
                error: null,


                fetchEvents: async (query) => {
                    set({
                        isLoading: true,
                        error: null,
                        selectedFilters: query || {}

                    })
                    try {
                        const response = await EventService.getEvents(query);
                        if (response.success) {
                            const eventsById = normalizeById<Event>(response.data.events)
                            const allEventIds = extractIds<Event>(response.data.events)


                            set((state) => ({
                                ...state,
                                eventsById: {
                                    ...state.eventsById,
                                    ...eventsById
                                },
                                allEventIds: allEventIds,

                                pagination: {
                                    ...state.pagination,
                                    allEvents: updatePaginationFromMeta(response.data.meta)
                                },
                                isLoading: false
                            }))
                        }
                        else throw new Error(response.message || "Error while fetching the events")
                    } catch (error) {
                        const classifiedError = classifyError(error);
                        if(isDevelopment())
                        console.log(classifiedError);
                        set({
                            isLoading: false,
                            error: classifiedError.message
                        })
                        throw error;
                    }
                },
                fetchEventById: async (id) => {
                    const existingEvent = get().eventsById[id];
                    if (existingEvent) return;

                    set({ isLoading: true, error: null })
                    try {
                        const response = await EventService.getEventById(id);
                        if (response.success) {
                            set((state) => ({
                                ...state,
                                isLoading: false,
                                eventsById: {
                                    ...state.eventsById,
                                    [id]: response.data
                                }
                            }))
                        }
                        else throw new Error(response.message)
                    } catch (error) {
                        const classifiedError = classifyError(error);
                        if(isDevelopment())
                        console.log(classifiedError);
                        set({
                            isLoading: false,
                            error: classifiedError.message
                        })
                        throw error;
                    }
                },
                fetchNearbyEvents: async (query) => {
                    set({
                        isLoading: true,
                        error: null
                    })
                    try {
                        const response = await EventService.getNearbyEvents(query);
                        if (response.success) {
                            const events = response.data.events;
                            const normalizedEvents = normalizeById<Event>(events);
                            const eventIds = extractIds<Event>(events);
                            set((state) => ({
                                ...state,
                                isLoading: false,
                                error: null,
                                eventsById: {
                                    ...state.eventsById,
                                    ...normalizedEvents,
                                },
                                nearbyEventIds: eventIds,
                                pagination: {
                                    ...state.pagination,
                                    nearbyEvents: updatePaginationFromMeta(response.data.meta)
                                }

                            }))
                        }
                        else throw new Error(response.message)

                    } catch (error) {
                        const classifiedError = classifyError(error);
                        if(isDevelopment())
                        console.log(classifiedError);
                        set({
                            isLoading: false,
                            error: classifiedError.message
                        })
                        throw error;
                    }


                },

                createEvent: async (eventData) => {
                    set({
                        isMutating: true,
                        error: null
                    });
                    try {
                        const response = await EventService.createEvent(eventData);
                        if (response.success) {
                            set((state) => ({
                                ...state,
                                isMutating: false,
                                eventsById: {
                                    ...state.eventsById,
                                    [response.data.id]: response.data
                                },
                                allEventIds: [],
                                nearbyEventIds: [],
                                selectedFilters: {}

                            }))
                            return response.data
                        }
                        else throw new Error(response.message)
                    } catch (error) {
                        const classifiedError = classifyError(error);
                        if(isDevelopment())
                        console.log(classifiedError);
                        set({
                            isMutating: false,
                            error: classifiedError.message
                        })
                        throw error;
                    }
                },
                updateEvent: async (id, eventData) => {
                    set({
                        isMutating: true,
                        error: null
                    });
                    try {
                        const response = await EventService.updateEvent(id, eventData);
                        if (response.success) {
                            set((state) => ({
                                ...state,
                                isMutating: false,
                                eventsById: {
                                    ...state.eventsById,
                                    [id]: response.data
                                },
                                nearbyEventIds: [],
                                allEventIds: [],
                                selectedFilters: {}
                            }))
                            return response.data
                        }
                        else throw new Error(response.message)
                    } catch (error) {
                        const classifiedError = classifyError(error);
                        if(isDevelopment())
                        console.log(classifiedError);
                        set({
                            isMutating: false,
                            error: classifiedError.message
                        })
                        throw error;
                    }
                },
                deleteEvent: async (id) => {
                    set({
                        isMutating: true,
                        error: null
                    });
                    try {
                        const response = await EventService.deleteEvent(id);
                        if (response.success) {
                            const { [id]: deletedEvent, ...remainingEvents } = get().eventsById
                            set((state) => ({
                                eventsById: remainingEvents,
                                allEventIds: state.allEventIds.filter((x) => x !== id),
                                nearbyEventIds: state.nearbyEventIds.filter((x) => x !== id),
                                isMutating: false
                            }))
                        }
                        else throw new Error(response.message)
                    } catch (error) {
                        const classifiedError = classifyError(error)
                        if(isDevelopment())
                            console.log(classifiedError);
                            
                        set({
                            isMutating: false,
                            error: classifiedError.message
                        })
                        throw error
                    }
                },

                bookEvent: async (eventId) => {
                    set({ isMutating: true, error: null })

                    try {
                        const response = await EventService.bookEvent(eventId)

                        if (response.success) {

                            set({ isMutating: false })
                        } else {
                            throw new Error(response.message)
                        }
                    } catch (error: any) {
                        const classifiedError = classifyError(error)
                        if(isDevelopment())
                            console.log(classifiedError);
                        set({
                            isMutating: false,
                            error: classifiedError.message
                        })
                        throw error
                    }
                },

                clearError: () => { set({ error: null }) },
                clearEvents: () => {
                    set({
                        eventsById: {},
                        allEventIds: [],
                        nearbyEventIds: [],
                        selectedFilters: {},
                        pagination: {
                            allEvents: createInitialPaginationState(),
                            nearbyEvents: createInitialPaginationState()
                        }
                    })
                },

                getEventById: (id) => {
                    const state = get()
                    return state.eventsById[id] || null
                },
                getAllEvents: () => {
                    const state = get()
                    return state.allEventIds
                        .map(id => state.eventsById[id])
                        .filter(Boolean)
                },
                getNearbyEvents: () => {
                    const state = get()
                    return state.nearbyEventIds
                        .map(id => state.eventsById[id])
                        .filter(Boolean)
                },


            }), { name: 'event-store' }
        ), { name: 'event-storage'  ,
            partialize :(state)=>({
                eventsById : state.eventsById,
                selectedFilters : state.selectedFilters
            })
        }
    )
)

export default useEventStore