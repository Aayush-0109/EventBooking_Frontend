import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import AuthService from '../services/authService'
import { User, LoginCredentials, RegisterData, UpdateUserData, } from '../services/api/types'
import { classifyError } from '../utils/errorHandling';





interface AuthStore {
    // 
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (credentials: LoginCredentials) => Promise<void>;
    registerUser: (userData: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
    updateprofile: (userData: UpdateUserData) => Promise<void>;
    setLoading: (Loading: boolean) => void;
    clearError: () => void;
    clearAuth: () => void;

}

export const useAuthStore = create<AuthStore>()(
    persist(
        devtools((set, get) => (
            {
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
                // login 

                login: async (credentials) => {
                    set({
                        isLoading: true,
                        error: null
                    })
                    try {

                        const response = await AuthService.login(credentials);
                        if (response.success && response.data) {
                            set(
                                {
                                    user: response.data,
                                    isAuthenticated: true,
                                    isLoading: false,
                                    error: null
                                }
                            );
                            console.log("Login successful");
                        }
                        else {
                            throw new Error(response.message || "Login Failed");
                        }

                    } catch (error: any) {
                        console.log("Login failed :", error);
                        const classifiedError = classifyError(error);
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: classifiedError.message
                        })
                        throw error
                    }

                },
                registerUser: async (userData) => {
                    set({
                        isLoading: true,
                        error: null
                    });
                    try {


                        const response = await AuthService.register(userData);
                        if (response.success) {
                            set(
                                {
                                    user: response.data,
                                    isAuthenticated: true,
                                    isLoading: false,
                                    error: null
                                }
                            );
                            console.log("registration successful");
                        }
                        else throw new Error(response.message || "Registration failed")

                    } catch (error: any) {
                        console.log("Registration failed : ", error);
                        const classifiedError = classifyError(error);
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: classifiedError.message
                        })
                        throw error;


                    }
                },
                logout: async () => {
                    set({
                        isLoading: true,
                    })
                    try {
                        const response = await AuthService.logout()
                        if (response.success) {
                            set({
                                user: null,
                                isAuthenticated: false,
                                isLoading: false,
                                error: null
                            });
                        }


                    } catch (error) {
                        console.error('⚠️ Logout API error (continuing with local logout):', error);
                        const classifiedError = classifyError(error);


                        if (classifiedError.type === 'network_error') {

                            set({
                                isLoading: false,
                                error: 'Logout failed due to network error. Please try again.',

                            });
                            throw error;

                        } else if (classifiedError.type === 'authentication_error' || classifiedError.type === 'authorization_error') {

                            console.log('🔐 Auth error during logout - tokens likely expired');
                            set({
                                user: null,
                                isAuthenticated: false,
                                isLoading: false,
                                error: null
                            });

                        } else if (classifiedError.type === 'server_error') {

                            set({
                                isLoading: false,
                                error: 'Server error during logout. Please try again or contact support.',

                            });
                            throw error;

                        } else {

                            set({
                                isLoading: false,
                                error: 'Logout failed. Please try again.',
                            });
                            throw error;
                        }
                    }
                },
                checkAuth: async () => {

                    set({
                        isLoading: true
                    })
                    try {
                        const response = await AuthService.getCurrentUser();
                        if (response.success) {
                            set({
                                user: response.data,
                                isAuthenticated: true,
                                error: null,
                                isLoading: false
                            })
                            console.log("Ath check successful");

                        }
                        else throw new Error("Authentication check failed")
                    } catch (error) {
                        console.log('Authentication check failed')
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
                        console.log("Refreshing token ")
                        const response = await AuthService.refreshAccessToken()
                        if (response.success) {
                            set({
                                user: response.data,
                                isAuthenticated: true,
                                error: null
                            })
                            return true
                        }
                        else {
                            return false
                        }

                    } catch (error) {
                        console.log("Token refresh failed : ", error);
                        set({
                            user: null,
                            isAuthenticated: false,
                            error: null
                        })
                        return false
                    }
                },
                updateprofile: async (userData) => {
                    set({
                        isLoading: true, error: null
                    })
                    try {
                        const response = await AuthService.updateProfile(userData);
                        if (response.success) {
                            set({
                                user: response.data,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null
                            })
                            console.log("Profile Update Successful");

                        }
                        else {
                            throw new Error(response.message || "Profile Update Failed")
                        }
                    } catch (error) {
                        const classifiedError = classifyError(error);
                        set({

                            isLoading: false,
                            error: classifiedError.message
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
                clearError: () => {
                    set({
                        error: null
                    })
                },
                setLoading: (Loading: boolean) => {
                    set({ isLoading: Loading })
                }
            }
        ), { name: 'Auth-Store' })
        ,
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
)