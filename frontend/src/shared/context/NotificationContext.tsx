"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';
import NotificationToast, { NotificationType } from '@/shared/components/NotificationToast';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
    };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000); // A notificação desaparecerá após 5 segundos
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Box
        sx={{
          position: 'fixed',
          top: 80, // Abaixo do Header
          right: 16,
          zIndex: 1500, // Acima de outros elementos
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <AnimatePresence>
          {notifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              message={notification.message}
              type={notification.type}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </Box>
    </NotificationContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};