import { io, Socket } from 'socket.io-client'

class WebSocketService {
    private socket: Socket | null = null;
    private isConnected = false;

    connect() {
        if (this.socket?.connected) return;
        this.socket = io(import.meta.env.VITE_WEBSOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });
        this.socket.on('connect', () => {
            console.log('Websocket connected');
            this.isConnected = true

        });
        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
            this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            this.isConnected = false;
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }
    on(event: string, callback: (data: any) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string) {
        this.socket?.off(event);
    }

    emit(event: string, data?: any) {
        this.socket?.emit(event, data);
    }
    get connected() {
        return this.isConnected;
    }
}
export default new WebSocketService()