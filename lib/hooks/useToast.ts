'use client';

import { useState, useCallback } from 'react';
import type { ToastType } from '@/components/common/Toast';

interface ToastState {
  id: string;
  message: string;
  type: ToastType;
  isVisible: boolean;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast: ToastState = {
      id,
      message,
      type,
      isVisible: true,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5300); // Slightly longer than toast display duration
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev =>
      prev.map(toast =>
        toast.id === id ? { ...toast, isVisible: false } : toast
      )
    );

    // Remove from state after animation
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast(message, 'success');
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, 'error');
  }, [showToast]);

  const showInfo = useCallback((message: string) => {
    showToast(message, 'info');
  }, [showToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showInfo,
    clearAll,
  };
}