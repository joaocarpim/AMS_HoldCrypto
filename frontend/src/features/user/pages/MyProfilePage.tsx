'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useAuthUser, useAuthActions } from '@/features/auth/store/useAuthStore';
import { userService } from '@/features/user/services/userService';
import { 
  User, Mail, Phone, MapPin, Camera, Save, Lock, Loader2, 
  ShieldCheck, Calendar, CheckCircle2, AlertTriangle 
} from 'lucide-react';
import { useNotification } from '@/shared/context/NotificationContext';
import Image from 'next/image';

// --- Componente de Input Visual (Glass) ---
const ProfileInput = ({ label, icon: Icon, ...props }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
        <Icon size={18} />
      </div>
      <input 
        className="w-full bg-[#0b0f19] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all font-medium"
        {...props}
      />
    </div>
  </div>
);

export function MyProfilePage() {
  const user = useAuthUser();
  const { fetchProfile } = useAuthActions();
  const { showNotification } = useNotification();

  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    photo: '',
    password: '',
    confirmPassword: ''
  });

  // Carregar dados ao entrar
  useEffect(() => {
    if (user.id) {
      const loadUserData = async () => {
        try {
          const data = await userService.getById(user.id!);
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            photo: data.photo || '',
            password: '',
            confirmPassword: ''
          });
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        }
      };
      loadUserData();
    }
  }, [user.id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.id) return;

    if (activeTab === 'security' && formData.password !== formData.confirmPassword) {
        showNotification("As senhas não coincidem.", "error");
        return;
    }

    setIsLoading(true);
    try {
        const updatePayload: any = { ...formData };
        if (!updatePayload.password) delete updatePayload.password;
        delete updatePayload.confirmPassword;

        await userService.update(user.id, updatePayload);
        await fetchProfile(); 
        
        showNotification("Perfil atualizado com sucesso!", "success");
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
        showNotification("Erro ao atualizar perfil.", "error");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20">
      
      {/* --- CAPA --- */}
      <div className="relative h-64 w-full bg-gradient-to-r from-yellow-600/20 via-purple-900/40 to-blue-900/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#020617] to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 mb-8">
            <div className="flex items-end gap-6">
                <div className="relative group">
                    <div className="w-36 h-36 rounded-3xl p-1.5 bg-[#020617] shadow-2xl">
                        <div className="w-full h-full rounded-2xl overflow-hidden bg-white/5 relative">
                            {formData.photo ? (
                                <Image src={formData.photo} alt="Profile" fill className="object-cover" unoptimized />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-yellow-500 bg-yellow-500/10">
                                    {formData.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-xs font-bold gap-2 backdrop-blur-sm">
                                <Camera size={24} className="text-yellow-500" />
                                ALTERAR FOTO
                                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-1.5 rounded-full border-4 border-[#020617]" title="Conta Verificada">
                        <CheckCircle2 size={16} strokeWidth={3} />
                    </div>
                </div>

                <div className="mb-2">
                    <h1 className="text-3xl font-bold text-white mb-1">{formData.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg">
                            <Mail size={14} className="text-yellow-500" /> {formData.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-emerald-500" /> KYC Verificado
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-2">
                <div className="glass-panel px-5 py-3 rounded-2xl text-center border border-white/5 bg-[#0f172a]/60">
                    <p className="text-xs text-gray-500 uppercase font-bold">Membro Desde</p>
                    <p className="text-white font-mono flex items-center justify-center gap-1">
                        <Calendar size={14} className="text-yellow-500" /> 2025
                    </p>
                </div>
                <div className="glass-panel px-5 py-3 rounded-2xl text-center border border-white/5 bg-[#0f172a]/60">
                    <p className="text-xs text-gray-500 uppercase font-bold">Nível</p>
                    <p className="text-yellow-500 font-bold flex items-center justify-center gap-1">
                        VIP <span className="text-white">Trader</span>
                    </p>
                </div>
            </div>
        </div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-2">
                <button 
                    onClick={() => setActiveTab('general')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'general' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <User size={20} /> Dados Pessoais
                </button>
                <button 
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'security' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <Lock size={20} /> Segurança
                </button>
                
                <div className="mt-8 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                    <h4 className="text-blue-400 text-sm font-bold flex items-center gap-2 mb-2">
                        <ShieldCheck size={16} /> Segurança
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        A equipe HoldCrypto nunca pedirá sua senha por email ou chat. Mantenha seus dados seguros.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
                <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-[#0f172a]/40 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {activeTab === 'general' ? 'Informações da Conta' : 'Segurança e Acesso'}
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">
                                {activeTab === 'general' ? 'Atualize seus dados de contato.' : 'Gerencie sua senha e proteja sua conta.'}
                            </p>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Salvar
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {activeTab === 'general' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                <ProfileInput label="Nome Completo" icon={User} name="name" value={formData.name} onChange={handleChange} />
                                <ProfileInput label="Email Principal" icon={Mail} name="email" value={formData.email} onChange={handleChange} />
                                <ProfileInput label="Telefone" icon={Phone} name="phone" value={formData.phone} onChange={handleChange} />
                                <ProfileInput label="Endereço" icon={MapPin} name="address" value={formData.address} onChange={handleChange} />
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 max-w-lg animate-fade-in">
                                <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 flex gap-3">
                                    <AlertTriangle className="text-yellow-500 shrink-0" size={24} />
                                    <div>
                                        <h4 className="text-yellow-500 font-bold text-sm">Alterar Senha</h4>
                                        <p className="text-gray-400 text-xs mt-1">Deixe os campos em branco se não quiser alterar sua senha atual.</p>
                                    </div>
                                </div>
                                <ProfileInput label="Nova Senha" icon={Lock} type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                                <ProfileInput label="Confirmar Nova Senha" icon={Lock} type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                            </div>
                        )}

                        <div className="pt-8 border-t border-white/5 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(240,185,11,0.2)] hover:shadow-[0_0_30px_rgba(240,185,11,0.4)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}