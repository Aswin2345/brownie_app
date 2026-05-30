import React, { createContext, useContext } from 'react';
import { Toaster } from 'react-hot-toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  return (
    <ToastContext.Provider value={{}}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1A110D',
            color: '#F5E6D3',
            border: '1px solid rgba(212, 165, 116, 0.2)',
            borderRadius: '12px',
            padding: '14px 20px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          },
          success: {
            iconTheme: {
              primary: '#D4A574',
              secondary: '#1A110D',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1A110D',
            },
          },
        }}
      />
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

export default ToastContext;
