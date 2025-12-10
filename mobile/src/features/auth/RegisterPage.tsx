"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; 
import { User, Mail, Phone, MapPin, Lock, Camera, ArrowRight, Loader2, CheckCircle, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { userService } from "@/features/user/services/userService";

// --- CORREÇÃO: InputField MOVIDO PARA FORA DO COMPONENTE ---
const InputField = ({ icon: Icon, isPassword, showPasswordToggle, onTogglePassword, ...props }: any) => (
  <div className="relative group">
    <Icon className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
    <input 
      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
      {...props}
    />
    {isPassword && (
        <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
        >
            {showPasswordToggle ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
    )}
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    photo: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  
  // Estado para visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    setLoading(true);

    try {
      await userService.create(form);
      setStatus({ type: 'success', message: 'Conta criada com sucesso! Redirecionando...' });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Erro ao criar conta. Verifique os dados.";
      setStatus({ type: 'error', message: errorMsg });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="glass-panel w-full max-w-2xl p-8 md:p-10 rounded-3xl relative z-10 shadow-2xl border border-white/10">
        
        <Link href="/" className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
             <ArrowLeft size={16} /> Voltar
        </Link>

        <div className="text-center mb-8 mt-4">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Junte-se à <span className="text-yellow-500">HoldCrypto</span></h1>
          <p className="text-gray-400">Crie sua conta e comece a operar no mercado global.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nome Completo</label>
              <InputField icon={User} name="name" placeholder="Ex: Ana Silva" value={form.name} onChange={handleChange} required />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">E-mail</label>
              <InputField icon={Mail} name="email" type="email" placeholder="Ex: ana@crypto.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Telefone</label>
              <InputField icon={Phone} name="phone" placeholder="(00) 00000-0000" value={form.phone} onChange={handleChange} required />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Cidade/Estado</label>
              <InputField icon={MapPin} name="address" placeholder="Ex: São Paulo, SP" value={form.address} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Senha de Acesso</label>
            <InputField 
                icon={Lock} 
                name="password" 
                type={showPassword ? "text" : "password"} // Alterna o tipo
                placeholder="Crie uma senha forte" 
                value={form.password} 
                onChange={handleChange} 
                required 
                isPassword={true} // Flag para mostrar o olho
                showPasswordToggle={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Foto de Perfil</label>
            <label className={`flex items-center justify-center gap-3 w-full border border-dashed rounded-xl py-4 cursor-pointer transition-all ${form.photo ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/20 hover:border-white/40 hover:bg-white/5'}`}>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" disabled={loading} />
              {form.photo ? (
                <>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-yellow-500">
                    <Image 
                      src={form.photo} 
                      alt="Preview" 
                      fill 
                      className="object-cover" 
                      unoptimized 
                    />
                  </div>
                  <span className="text-yellow-500 font-medium text-sm">Foto carregada com sucesso</span>
                </>
              ) : (
                <>
                  <Camera size={20} className="text-gray-400" />
                  <span className="text-gray-400 text-sm">Clique para enviar uma foto</span>
                </>
              )}
            </label>
          </div>

          {status.message && (
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm font-medium">{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(240,185,11,0.2)] hover:shadow-[0_0_30px_rgba(240,185,11,0.4)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={20} /> Criando Conta...</>
            ) : (
              <>Começar Agora <ArrowRight size={20} /></>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-gray-400 text-sm">
              Já é um investidor?{' '}
              <Link href="/login" className="text-yellow-500 font-bold hover:text-yellow-400 hover:underline transition-all">
                Fazer Login
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}