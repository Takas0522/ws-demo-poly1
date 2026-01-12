import React, { useEffect } from 'react';
import { Toast, ToastProps } from './Toast';

interface ToastContainerProps {
  toasts: Omit<ToastProps, 'onClose'>[];
  onClose: (id: string) => void;
}

/**
 * ToastContainer component for managing and displaying multiple toasts
 * Stacks toasts vertically in the top-right corner
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="flex flex-col items-end pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </div>
    </div>
  );
};
