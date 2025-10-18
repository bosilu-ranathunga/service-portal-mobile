import React, { useState, useEffect } from 'react';
import Toast from './Toast';

const ToastManager = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleChartAdded = (event) => {
            const { message, type } = event.detail;
            addToast(message, type);
        };

        window.addEventListener('chartAdded', handleChartAdded);

        return () => {
            window.removeEventListener('chartAdded', handleChartAdded);
        };
    }, []);

    const addToast = (message, type = 'success', duration = 4000) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            message,
            type,
            duration,
            isVisible: true
        };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after duration
        setTimeout(() => {
            removeToast(id);
        }, duration);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        isVisible={toast.isVisible}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ToastManager;