'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/shared/components/Modal';
import { useUsersStore } from '../store/usersStore';
import { User as UserType } from '../services/userService';
import { GlassInput } from './GlassInput';
import { User, Mail, Phone, MapPin, Lock, Image as ImageIcon, Loader2, Save, ShieldAlert } from 'lucide-react';
import { UserFormValues } from '../types/UserFormValues';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: UserType | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ open, onClose, user }) => {
  const { updateUser } = useUsersStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormValues>({
    name: '', email: '', phone: '', address: '', password: '', photo: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        photo: user.photo || '',
        password: '', 
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!user) return;
    e.preventDefault();
    setIsLoading(true);

    const dataToUpdate = { ...formData };
    if (!dataToUpdate.password?.trim()) {
        delete (dataToUpdate as any).password;
    }

    const success = await updateUser(user.id, dataToUpdate);
    setIsLoading(false);

    if (success) {
      onClose();
    } else {
      alert("Erro ao atualizar.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Editar: ${user?.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassInput label="Nome" icon={User} name="name" value={formData.name} onChange={handleChange} />
            <GlassInput label="Email" icon={Mail} type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassInput label="Telefone" icon={Phone} name="phone" value={formData.phone} onChange={handleChange} />
            <GlassInput label="Endereço" icon={MapPin} name="address" value={formData.address} onChange={handleChange} />
        </div>

        <GlassInput label="URL da Foto" icon={ImageIcon} name="photo" value={formData.photo} onChange={handleChange} />
        
        {/* Área de Senha diferenciada */}
        <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl mt-2">
            <div className="flex items-center gap-2 mb-3">
                <ShieldAlert size={16} className="text-yellow-500" />
                <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Área de Segurança</p>
            </div>
            <GlassInput 
                label="Nova Senha (Opcional)" 
                icon={Lock} 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Deixe vazio para manter a atual" 
                className="bg-[#0f172a]" // Um pouco mais escuro para destacar
            />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 text-sm"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Salvar Alterações
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;