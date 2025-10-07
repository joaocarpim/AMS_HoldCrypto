'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar, 
  useTheme 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
// Importando o serviço de autenticação que criamos
import authService from "@/features/auth/services/AuthServices";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Usando o authService para buscar o perfil
          const profile = await authService.getProfile();
          setIsLoggedIn(true);
          setUserName(profile.user || "Usuário");
        } catch (error) {
          console.error("Sessão inválida, limpando token.", error);
          handleLogout(false); // Apenas limpa o estado, não redireciona
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogout = (redirect = true) => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName("");
    if (redirect) {
      router.push("/login");
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1} // Sombra mais sutil
      sx={{
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`, // Borda mais fina
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Typography
            variant="h5"
            color="primary"
            fontWeight="bold"
            sx={{
              letterSpacing: 1.5,
              cursor: "pointer",
            }}
          >
            AMS HoldCrypto
          </Typography>
        </Link>

        {/* Menu para telas pequenas */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton color="primary" onClick={handleMenu}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              },
            }}
          >
            {isLoggedIn ? (
              [
                <MenuItem key="user" disabled sx={{opacity: 1}}>Olá, {userName}</MenuItem>,
                <MenuItem key="logout" onClick={() => handleLogout()}>Sair</MenuItem>
              ]
            ) : (
              [
                <MenuItem key="login" onClick={() => router.push("/login")}>Login</MenuItem>,
                <MenuItem key="register" onClick={() => router.push("/register")}>Registrar-se</MenuItem>
              ]
            )}
          </Menu>
        </Box>

        {/* Menu para telas médias/grandes */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
          {isLoggedIn ? (
            <>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, color: '#0B0B0B', fontWeight: 'bold' }}>
                {userName.charAt(0)}
              </Avatar>
              <Typography color="text.primary" fontWeight="500">
                Olá, {userName}
              </Typography>
              <Button 
                color="primary" 
                variant="outlined" 
                onClick={() => handleLogout()}
                sx={{ fontWeight: "bold", borderWidth: 2 }}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button
                color="primary"
                variant="text"
                component={Link}
                href="/login"
                sx={{ fontWeight: "bold" }}
              >
                Sign In
              </Button>
              <Button
                color="primary"
                variant="contained"
                component={Link}
                href="/register"
                sx={{ fontWeight: "bold" }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

