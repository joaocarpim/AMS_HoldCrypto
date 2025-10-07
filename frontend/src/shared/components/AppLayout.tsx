'use client';
// A importação do React não é mais necessária no topo com o Next.js moderno
import { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, useTheme, AppBar, IconButton, Typography, Avatar, Button, useMediaQuery } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MenuIcon from '@mui/icons-material/Menu';
import { usePathname, useRouter } from 'next/navigation';
import authService from '@/features/auth/services/AuthServices';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  { text: 'Usuários', href: '/users', icon: <PeopleIcon /> },
  { text: 'Moedas', href: '/currency', icon: <MonetizationOnIcon /> },
];

// CORREÇÃO: Usando uma exportação nomeada
export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUserName(profile.user || "Usuário");
        } catch {
          handleLogout(false);
        }
      }
    };
    checkAuth();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = (redirect = true) => {
    localStorage.removeItem("token");
    if (redirect) router.push("/login");
  };

  const drawerContent = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 1 }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={pathname === item.href}
                onClick={() => {
                  router.push(item.href);
                  if(isMobile) handleDrawerToggle();
                }}
                sx={{
                  borderRadius: 2,
                  marginBottom: '4px',
                  borderLeft: '4px solid transparent',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(240, 185, 11, 0.1)',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                      color: theme.palette.primary.main,
                      fontWeight: '600',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0B0B0B' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                {isMobile && (
                    <IconButton
                        color="primary"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography variant="h5" color="primary" fontWeight="bold">
                    AMS HoldCrypto
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, color: '#0B0B0B' }}>
                    {userName.charAt(0)}
                </Avatar>
                <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>Olá, {userName}</Typography>
                <Button color="primary" variant="outlined" onClick={() => handleLogout()} sx={{fontWeight: 'bold'}}>
                    Sair
                </Button>
            </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: theme.palette.background.paper,
              borderRight: {md: `1px solid ${theme.palette.divider}`},
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, color: '#fff', width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar /> 
        {children}
      </Box>
    </Box>
  );
};

