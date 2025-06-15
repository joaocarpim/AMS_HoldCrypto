"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setIsLoggedIn(true);
          setUserName(res.data.user || "Usuário");
        })
        .catch(() => setIsLoggedIn(false));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName("");
    router.push("/login");
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="default" elevation={2} sx={{ mb: 4 }}>
      <Toolbar>
        <Link href="/" style={{ textDecoration: "none", flexGrow: 1 }}>
          <Typography
            variant="h5"
            color="primary"
            fontWeight="bold"
            sx={{
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              "&:hover": { color: "secondary.main" },
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
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {isLoggedIn ? (
              [
                <MenuItem key="user" disabled>
                  Olá, {userName}
                </MenuItem>,
                <MenuItem key="logout" onClick={handleLogout}>
                  Sair
                </MenuItem>,
              ]
            ) : (
              [
                <MenuItem key="login" onClick={() => router.push("/login")}>
                  Login
                </MenuItem>,
                <MenuItem key="register" onClick={() => router.push("/register")}>
                  Registrar-se
                </MenuItem>,
              ]
            )}
          </Menu>
        </Box>

        {/* Menu para telas médias/grandes */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
          {isLoggedIn ? (
            <>
              <Typography color="primary" fontWeight="bold">
                Olá, {userName}
              </Typography>
              <Button color="error" variant="contained" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button
                color="primary"
                variant="contained"
                component={Link}
                href="/login"
              >
                Login
              </Button>
              <Button
                color="primary"
                variant="outlined"
                component={Link}
                href="/register"
              >
                Registrar-se
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}