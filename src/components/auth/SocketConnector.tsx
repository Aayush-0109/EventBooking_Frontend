import { useEffect, ReactNode } from 'react';
import websocketService from '../../services/Websocket.service';
import {useAuthStore} from '../../store/authStore';
import { useSocketStore } from '../../store/socketStore';
interface SocketWrapperProps {
    children: ReactNode;
}

export default function SocketWrapper({ children }: SocketWrapperProps) {
    const { isAuthenticated, user } = useAuthStore();
    const {setConnected} = useSocketStore();

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            console.log('🔌 Connecting to WebSocket...');
            websocketService.connect();

            websocketService.on('connect',()=> setConnected(true));
            websocketService.on('disconnect',()=> setConnected(false))

            return () => {
                console.log(' Disconnecting from WebSocket...');
                websocketService.disconnect();
            };
        } else {
            websocketService.disconnect();
            setConnected(false)

        }
    }, [isAuthenticated, user?.id]);

    return <>{children}</>;
}