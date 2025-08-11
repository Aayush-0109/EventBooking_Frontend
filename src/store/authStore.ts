import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from "../utils/api"


interface User {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'ORGANIZER' | 'ADMIN';
    profileImage?: string;
}

interface AuthStore {
    // 
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<{
        success: boolean,
        message: string,
        user: User | null
    }>;
    registerUser: (name: string, email: string, password: string, profileImage?: File) => Promise<{
        success: boolean,
        message: string,
        user: User | null,


    }>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
    clearError: () => void;
    setLoading: (Loading: boolean) => void;
    clearAuth: () => void;

}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => (
            {
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
                // login 

                login: async (email: string, password: string) => {
                    set({
                        isLoading: true,
                        error: null
                    })
                    try {
                        const response = await api.post("/auth/login", {
                            email,
                            password
                        })
                        if (response.data?.success) {
                            const user = response.data.data;
                            console.log("Login successfull");
                            set({
                                isLoading: false,
                                isAuthenticated: true,
                                user: user,
                                error: null

                            });
                            return {
                                success: true,
                                message: response.data.message,
                                user: user
                            }
                        }
                        return {
                            success: false,
                            message: response.data.message || "Login Failed",
                            user: null
                        }


                    } catch (error: any) {
                        console.log("login failed", error);
                        const errorMessage = error.response?.data?.message || "Login failed"
                        set({
                            isLoading: false,
                            error: errorMessage,
                            isAuthenticated: false,
                            user: null
                        })

                        throw error
                    }

                },
                clearAuth: async () => {
                    set({
                        user: null,
                        isAuthenticated: false,
                        error: null,
                        isLoading: false
                    })
                },

                registerUser: async (name: string, email: string, password: string, profileImage?: File) => {
                    try {
                        set({
                            isLoading: true,
                            error: null
                        });

                        const formData = new FormData();
                        formData.append('name', name);
                        formData.append('email', email);
                        formData.append('password', password);
                        if (profileImage) {
                            formData.append('profileImage', profileImage);
                        }

                        const response = await api.post("/auth/register", formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });

                        if (response.data.success) {
                            const user = response.data.data;
                            set({
                                user: user,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null
                            });

                            return {
                                success: true,
                                message: response.data.message || 'Registration successful!',
                                user: user
                            };
                        }

                        // Handle unsuccessful response
                        set({ isLoading: false });
                        return {
                            success: false,
                            message: response.data.message || 'Registration failed',
                            user: null
                        };
                        throw new Error(response.data.message || 'Registration failed');
                    } catch (error: any) {
                        const errorMessage = error.response?.data?.message || 'Registration failed';
                        set({
                            isLoading: false,
                            error: errorMessage,
                            isAuthenticated: false,
                            user: null
                        });

                        return {
                            success: false,
                            message: errorMessage,
                            user: null
                        };
                        throw error;  
                    }
                },
                logout: async () => {
                    set({
                        isLoading: true,
                    })
                    try {
                        await api.post("/auth/logout");
                        console.log("Logout successfully")
                    } catch (error) {
                        console.log("Logout error : ", error)
                    } finally {
                        set({
                            isLoading: false,
                            user: null,
                            isAuthenticated: false,
                            error: null
                        })
                    }
                },
                checkAuth: async () => {
                    set({
                        isLoading: true
                    })
                    try {
                        const response = await api.get("/auth/me");
                        const user = response.data.data
                        set({
                            user,
                            isAuthenticated: true,
                            error: null,
                            isLoading: false


                        })
                    } catch (error) {
                        console.log("user not authenticated")
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: null,
                        });
                        throw error
                    }
                },
                refreshToken: async () => {
                    try {
                        console.log("manually refresh token..");
                        const response = await api.post("/auth/refresh-token");
                        if (response.data.success && response.data.data) {
                            const user = response.data.data;
                            console.log("Token refreshed successfully");
                            set({
                                user,
                                isAuthenticated: true,
                                error: null
                            })
                            return true;
                        }
                        return false
                    } catch (error) {
                        console.log("error in refreshing token ", error)
                        set({
                            user: null,
                            isAuthenticated: false,
                            error: null,
                        })
                        return false
                    }
                },
                clearError: () => {
                    set({
                        error: null
                    })
                },
                setLoading: (Loading: boolean) => {
                    set({ isLoading: Loading })
                }
            }
        ),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
)