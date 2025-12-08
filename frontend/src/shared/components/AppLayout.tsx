'use client';
import { useState, useEffect, useMemo } from 'react';
import { 
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
    useMediaQuery, IconButton, Avatar
} from '@mui/material';
// 1. Adicionado o ícone Wallet
import { LayoutDashboard, Users, LineChart, Menu as MenuIcon, LogOut, UserCircle, Wallet } from 'lucide-react'; 
import { usePathname, useRouter } from 'next/navigation';
import { useAuthUser, useIsAuthenticated, useAuthLoading, useAuthActions } from '@/features/auth/store/useAuthStore';

const drawerWidth = 260;

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const isMobile = useMediaQuery('(max-width:900px)');
    const [mobileOpen, setMobileOpen] = useState(false);

    const { fetchProfile, logout } = useAuthActions();
    const user = useAuthUser();
    const isAuthenticated = useIsAuthenticated();
    const isLoadingAuth = useAuthLoading();

    const navItems = useMemo(() => {
        const items = [
            { text: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard },
            // 2. Novo item da Carteira adicionado aqui
            { text: 'Carteira', href: '/wallet', icon: Wallet }, 
            { text: 'Mercados', href: '/currency', icon: LineChart },
        ];
        
        if (user?.role === 'admin') {
            items.push({ text: 'Usuários', href: '/users', icon: Users });
        }
        
        items.push({ text: 'Meu Perfil', href: '/profile', icon: UserCircle });
        
        return items;
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (!isLoadingAuth && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoadingAuth, isAuthenticated, router]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    if (isLoadingAuth) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#020617]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
                    <span className="text-yellow-500 font-mono text-sm">CARREGANDO SISTEMA...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const drawerContent = (
        <div className="h-full flex flex-col bg-[#0f172a]/95 backdrop-blur-xl border-r border-white/5 text-white">
            <div className="p-6 flex items-center gap-3 border-b border-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500 text-black font-bold text-2xl shadow-[0_0_20px_rgba(240,185,11,0.4)]">H</div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white leading-tight">HoldCrypto</h1>
                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Pro Terminal</p>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto py-6 px-3">
                <List>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    onClick={() => { router.push(item.href); if (isMobile) handleDrawerToggle(); }}
                                    sx={{
                                        borderRadius: '12px', py: 1.5, px: 2,
                                        bgcolor: isActive ? 'rgba(240, 185, 11, 0.15)' : 'transparent',
                                        border: '1px solid', borderColor: isActive ? 'rgba(240, 185, 11, 0.3)' : 'transparent',
                                        color: isActive ? '#F0B90B' : '#94a3b8',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)', color: '#fff', transform: 'translateX(4px)' }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><item.icon size={20} /></ListItemIcon>
                                    <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 500, fontFamily: 'inherit' }} />
                                    {isActive && <div className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_10px_#F0B90B]"></div>}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </div>
            <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => router.push('/profile')}>
                    <Avatar src={user?.photo || undefined} sx={{ bgcolor: '#F0B90B', color: '#000', width: 36, height: 36, fontWeight: 'bold' }}>{user?.name?.charAt(0) || 'U'}</Avatar>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                        <div className="flex items-center gap-2"><span className="text-[10px] uppercase tracking-wider text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Usuário'}</span></div>
                    </div>
                </div>
                <button onClick={() => logout()} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20">
                    <LogOut size={16} /> Encerrar Sessão
                </button>
            </div>
        </div>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'transparent' }}>
            {isMobile && (
                <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#0f172a]/80 px-4 backdrop-blur-md">
                    <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded bg-yellow-500 text-black font-bold">H</div><span className="font-bold text-white">HoldCrypto</span></div>
                    <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}><MenuIcon /></IconButton>
                </div>
            )}
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'transparent', border: 'none' } }}>{drawerContent}</Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'transparent', border: 'none' } }} open>{drawerContent}</Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { md: `calc(100% - ${drawerWidth}px)` }, mt: { xs: 8, md: 0 }, overflowX: 'hidden' }}>{children}</Box>
        </Box>
    );
};