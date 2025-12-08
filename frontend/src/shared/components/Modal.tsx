"use client";
import React from 'react';
import { Modal as MuiModal, Box, IconButton, Typography, Backdrop } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// CORREÇÃO: A centralização (x: "-50%", y: "-50%") agora faz parte da animação
const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95, 
    x: "-50%", 
    y: "-45%" // Começa um pouquinho mais pra baixo (efeito de subir)
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    x: "-50%", 
    y: "-50%" // Fica perfeitamente no centro
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    x: "-50%", 
    y: "-45%" 
  },
};

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <MuiModal
          open={open}
          onClose={onClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
              sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.7)' }
            },
          }}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
                position: 'absolute',
                top: '50%',  // Posiciona o topo no meio da tela
                left: '50%', // Posiciona a esquerda no meio da tela
                width: '100%',
                maxWidth: '500px',
                outline: 'none',
                // Removemos o 'transform' daqui porque os variants acima cuidam disso agora
            }}
          >
            <Box
              sx={{
                width: { xs: '90%', sm: '100%' },
                maxWidth: 500,
                mx: 'auto',
                bgcolor: 'rgba(15, 23, 42, 0.85)', // Um pouco mais escuro para leitura
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                maxHeight: '90vh', // Garante que não estoure a altura da tela
              }}
            >
              {/* Modal Header */}
              <Box sx={{ 
                  p: 3, 
                  pb: 2,
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)' 
              }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
                  {title}
                </Typography>
                
                <IconButton 
                    onClick={onClose} 
                    sx={{ 
                        color: 'rgba(255,255,255,0.4)', 
                        '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } 
                    }}
                >
                  <X size={20} />
                </IconButton>
              </Box>

              {/* Modal Content - Com Scroll se necessário */}
              <Box sx={{ 
                  p: 3, 
                  pt: 2, 
                  overflowY: 'auto', // Scroll automático se o form for grande
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px' }
              }}>
                {children}
              </Box>
            </Box>
          </motion.div>
        </MuiModal>
      )}
    </AnimatePresence>
  );
};

export default Modal;