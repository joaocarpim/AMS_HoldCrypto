"use client";

import React, { useState } from 'react';
import Modal from '@/shared/components/Modal';
import { useUsersStore } from '../store/usersStore';
import { User } from '../services/userService';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ open, onClose, user }) => {
  const { deleteUser } = useUsersStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!user) return;

    setIsLoading(true);
    const success = await deleteUser(user.id);
    setIsLoading(false);

    if (success) {
      onClose();
    } else {
      alert("Falha ao deletar usuário.");
    }
  };

  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose} title="Confirmar Exclusão">
      <div className="flex flex-col items-center text-center space-y-4 pt-2">
        
        {/* Ícone de Alerta Animado */}
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-2">
            <AlertTriangle size={32} className="text-red-500" />
        </div>

        <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Você tem certeza?</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                Você está prestes a excluir permanentemente o usuário <span className="text-white font-bold">{user.name}</span>.
                <br/>
                <span className="text-red-400 text-xs uppercase tracking-wider font-bold mt-2 block">Essa ação é irreversível.</span>
            </p>
        </div>

        <div className="flex gap-3 w-full mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleConfirmDelete}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
            Sim, Excluir
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;