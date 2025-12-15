"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthActions, useAuthError, useIsAuthenticated } from './store/useAuthStore'; 
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuthActions();
    const authError = useAuthError();
    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const success = await login(email, password);
            if (success) {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Erro no login", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // ADICIONADO: overflow-hidden para evitar scroll lateral causado pelo blur
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617] overflow-hidden relative"> 
            
            {/* Fundo responsivo: ajustei o tamanho para não cobrir tudo em telas pequenas */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-yellow-500/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>

            {/* RESPONSIVIDADE: Padding reduzido no mobile (p-6) e mantido no desktop (md:p-8) */}
            <div className="w-full max-w-md p-6 md:p-8 rounded-3xl relative z-10 shadow-2xl border border-white/10 bg-[#0f172a]/50 backdrop-blur-xl"> 
                
                {/* Botão Voltar ajustado */}
                <div className="mb-6">
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium w-fit">
                        <ArrowLeft size={16} /> Voltar
                    </Link>
                </div>

                <div className="text-center mb-8"> 
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-black font-bold text-3xl mb-4 shadow-lg shadow-yellow-500/30">
                        H
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Bem-vindo de volta</h1>
                    <p className="text-gray-400 text-sm mt-2">Acesse seu terminal de trading profissional</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm md:text-base" // Ajuste de fonte
                                placeholder="ex: satoshi@bitcoin.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Senha</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm md:text-base"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {authError && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            <AlertCircle size={16} className="shrink-0" /> {/* shrink-0 evita que o icone esmague */}
                            <span>{authError}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting} 
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(240,185,11,0.3)] hover:shadow-[0_0_30px_rgba(240,185,11,0.5)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="animate-spin" size={20} /> Autenticando...</>
                        ) : (
                            <>Acessar Plataforma <ArrowRight size={20} /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/5 pt-6">
                    <p className="text-gray-400 text-sm">
                        Não tem uma conta?{' '}
                        <Link href="/register" className="text-yellow-500 font-bold hover:text-yellow-400 hover:underline transition-all">
                            Criar agora
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}