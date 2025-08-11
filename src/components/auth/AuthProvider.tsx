import React, {useEffect,useState ,useRef} from "react"
import { useAuthStore } from "../../store/authStore"
import LoadingSpinner from "../ui/LoadingSpinner"
import { isDevelopment } from "../../config/environment"
interface AuthProviderProps {
    children : React.ReactNode
}

export const AuthProvider  = ({children} : AuthProviderProps)=>{
    const {checkAuth,isLoading, clearAuth} = useAuthStore();
    const [isInitializing,setIsInitializing] = useState(true)
    const hasInitialized = useRef(false);
    useEffect(()=>{
        if (hasInitialized.current) return;
        hasInitialized.current = true;
        (async () => {
            console.log('🚀 App starting - checking authentication...');
            try {
                await checkAuth()
                console.log('✅ Authentication check completed');
            } catch (error) {
                if(isDevelopment())
                    console.log('❌ Authentication check failed:', error)
                clearAuth()
            }
            finally{
                setIsInitializing(false)
            }
        })()
    },[])
      // Show loading screen while checking authentication
      if (isInitializing || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-lg text-neutral-600">
                        Checking authentication...
                    </p>
                </div>
            </div>
        );
    }
    return<>{children}</>
}