import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: 'bg-success-50 border-success-200 text-success-800',
  error: 'bg-error-50 border-error-200 text-error-800',
  info: 'bg-primary-50 border-primary-200 text-primary-800',
  warning: 'bg-warning-50 border-warning-200 text-warning-800',
};

const iconStyles = {
  success: 'text-success-500',
  error: 'text-error-500',
  info: 'text-primary-500',
  warning: 'text-warning-500',
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const Icon = toastIcons[type];

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-dismiss
    const dismissTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match transition duration
  };

  return (
    <div
      className={cn(
        'relative w-full max-w-sm bg-white border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out',
        toastStyles[type],
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        isLeaving ? 'translate-x-full opacity-0' : ''
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconStyles[type])} />
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium">{title}</h4>
          {message && (
            <p className="mt-1 text-sm opacity-90">{message}</p>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 w-5 h-5 rounded-full inline-flex items-center justify-center hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20">
        <div
          className="h-full bg-current transition-all duration-300 ease-linear"
          style={{
            width: isLeaving ? '0%' : '100%',
            transitionDuration: `${duration}ms`
          }}
        />
      </div>
    </div>
  );
};

// Toast Container
interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

// Toast Hook
interface ToastOptions {
  type?: ToastType;
  duration?: number;
  message?: string;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (title: string, options: ToastOptions = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      id,
      type: options.type || 'info',
      title,
      message: options.message,
      duration: options.duration || 5000,
      onClose: removeToast,
    };

    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, options?: Omit<ToastOptions, 'type'>) => {
    addToast(title, { ...options, type: 'success' });
  };

  const error = (title: string, options?: Omit<ToastOptions, 'type'>) => {
    addToast(title, { ...options, type: 'error' });
  };

  const info = (title: string, options?: Omit<ToastOptions, 'type'>) => {
    addToast(title, { ...options, type: 'info' });
  };

  const warning = (title: string, options?: Omit<ToastOptions, 'type'>) => {
    addToast(title, { ...options, type: 'warning' });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
}; 