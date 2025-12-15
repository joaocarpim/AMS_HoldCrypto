'use client';



import React, { useState } from 'react';
import Modal from '@/shared/components/Modal'; 
import { useUsersStore } from '../store/usersStore';
import { GlassInput } from './GlassInput'; // <--- Importando o novo input
import { User, Mail, Phone, MapPin, Lock, Image as ImageIcon, Loader2, Save } from 'lucide-react';
import { UserFormValues } from '../types/UserFormValues';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ open, onClose }) => {
  const { addUser } = useUsersStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<UserFormValues>({
    name: '', email: '', phone: '', address: '', password: '', photo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await addUser(formData);
    setIsLoading(false);

    if (success) {
      setFormData({ name: '', email: '', phone: '', address: '', password: '', photo: '' });
      onClose();
    } else {
      alert("Erro ao criar usuário.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Novo Membro">
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        
        {/* Grid de 2 colunas para ficar organizado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassInput label="Nome" icon={User} name="name" value={formData.name} onChange={handleChange} required placeholder="Nome completo" />
            <GlassInput label="Email" icon={Mail} type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@exemplo.com" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassInput label="Telefone" icon={Phone} name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000" />
            <GlassInput label="Endereço" icon={MapPin} name="address" value={formData.address} onChange={handleChange} placeholder="Cidade, Estado" />
        </div>

        <GlassInput label="URL da Foto (Opcional)" icon={ImageIcon} name="photo" value={formData.photo} onChange={handleChange} placeholder="https://..." />
        
        <GlassInput label="Senha Inicial" icon={Lock} type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••" />

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(240,185,11,0.2)] hover:shadow-[0_0_30px_rgba(240,185,11,0.4)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Cadastrar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;