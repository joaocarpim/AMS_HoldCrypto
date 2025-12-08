"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Alert, AlertTitle, IconButton, Box } from '@mui/material';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error';

interface NotificationToastProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

const toastVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

const icons = {
  success: <CheckCircle color="currentColor" />,
  error: <XCircle color="currentColor" />,
};

const NotificationToast: React.FC<NotificationToastProps> = ({ message, type, onClose }) => {
  const title = type === 'success' ? 'Sucesso' : 'Erro';

  return (
    <motion.div
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <Alert
        severity={type}
        icon={icons[type]}
        action={
          <IconButton color="inherit" size="small" onClick={onClose}>
            <X size={18} />
          </IconButton>
        }
        sx={{
          width: '100%',
          boxShadow: 6,
          borderRadius: 2,
          '& .MuiAlert-icon': {
            alignItems: 'center',
          },
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>{title}</AlertTitle>
        {message}
      </Alert>
    </motion.div>
  );
};

export default NotificationToast;