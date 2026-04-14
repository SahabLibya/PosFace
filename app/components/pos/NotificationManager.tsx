import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export type Notification = {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
};

type NotificationManagerProps = {
    notifications: Notification[];
    onRemove: (id: string) => void;
};

const getStyles = (type: NotificationType) => {
    switch (type) {
        case 'success':
            return { bg: 'bg-white dark:bg-[#1e1e1e]', border: 'border-green-500', icon: 'text-green-500', bar: 'bg-green-500' };
        case 'error':
            return { bg: 'bg-white dark:bg-[#1e1e1e]', border: 'border-red-500', icon: 'text-red-500', bar: 'bg-red-500' };
        case 'warning':
            return { bg: 'bg-white dark:bg-[#1e1e1e]', border: 'border-yellow-500', icon: 'text-yellow-500', bar: 'bg-yellow-500' };
        case 'info':
        default:
            return { bg: 'bg-white dark:bg-[#1e1e1e]', border: 'border-blue-500', icon: 'text-blue-500', bar: 'bg-blue-500' };
    }
};

export function NotificationManager({ notifications, onRemove }: NotificationManagerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm pointer-events-none">
            {notifications.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} onRemove={onRemove} />
            ))}
        </div>
    );
}

function NotificationItem({ notification, onRemove }: { notification: Notification; onRemove: (id: string) => void; }) {
    const [isVisible, setIsVisible] = useState(false);
    const styles = getStyles(notification.type);
    const duration = notification.duration || 3500;

    useEffect(() => {
        // Slight delay to trigger enter animation
        const enterTimer = setTimeout(() => setIsVisible(true), 10);
        const exitTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onRemove(notification.id), 300);
        }, duration);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
        };
    }, [notification.id, duration, onRemove]);

    return (
        <div
            className={`pointer-events-auto transform transition-all duration-300 ease-out flex flex-col overflow-hidden rounded-lg shadow-xl border-l-4 ${styles.bg} ${styles.border} border-y border-r border-gray-200 dark:border-gray-800 ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-12 opacity-0 scale-95'
                }`}
        >
            <div className="flex items-center gap-3 p-4">
                <div className={`shrink-0 w-5 h-5 ${styles.icon}`}>
                    {notification.type === 'success' && <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                    {notification.type === 'error' && <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
                    {notification.type === 'warning' && <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>}
                    {notification.type === 'info' && <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>}
                </div>
                <div className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200">{notification.message}</div>
                <button onClick={() => { setIsVisible(false); setTimeout(() => onRemove(notification.id), 300); }} className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-white transition">
                    <X className="w-4 h-4" />
                </button>
            </div>
            {/* Animated Progress Bar */}
            <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
                <div className={`h-full ${styles.bar} opacity-70 transition-all ease-linear`} style={{ width: isVisible ? '0%' : '100%', transitionDuration: `${duration}ms` }} />
            </div>
        </div>
    );
}