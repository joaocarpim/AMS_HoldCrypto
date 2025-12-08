'use client';
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthUser, useIsAuthenticated, useAuthActions } from '@/features/auth/store/useAuthStore';
import { Menu, X, User, LogOut, Wallet, BarChart3, LayoutDashboard } from 'lucide-react'; // Ícones modernos

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const user = useAuthUser();
    const isAuthenticated = useIsAuthenticated();
    const { logout } = useAuthActions();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const navLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Mercados", href: "/currency", icon: BarChart3 },
        { name: "Usuários", href: "/users", icon: User }, // Só se for admin, mas deixamos aqui
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                
                {/* Logo & Marca */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500 text-black font-bold text-xl group-hover:shadow-[0_0_15px_rgba(240,185,11,0.6)] transition-all">
                        H
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                        HoldCrypto
                    </span>
                </Link>

                {/* Navegação Desktop (Estilo Clean) */}
                <nav className="hidden md:flex items-center gap-8">
                    {isAuthenticated && navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}
                            >
                                <link.icon size={18} />
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Área do Usuário (Estilo Pro) */}
                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="text-right hidden lg:block">
                                <p className="text-xs text-gray-400">Logado como</p>
                                <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-red-400 transition-colors"
                                title="Sair"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <Link href="/login" className="px-4 py-2 text-sm font-bold text-white hover:text-yellow-400 transition-colors">
                                Entrar
                            </Link>
                            <Link href="/register" className="px-4 py-2 text-sm font-bold text-black bg-yellow-500 rounded-lg hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(240,185,11,0.4)] transition-all">
                                Criar Conta
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu (Simples) */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-[#0f172a] p-4 space-y-4">
                    {isAuthenticated && navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="flex items-center gap-3 text-gray-300 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            <link.icon size={20} /> {link.name}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 py-2 w-full text-left">
                            <LogOut size={20} /> Sair
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}