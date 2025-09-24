"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";
import { authFormBox } from "@/shared/theme/boxStyles";
import { yellowField } from "@/shared/theme/fieldStyles";
import Link from "next/link";
// 1. Importe o novo serviço de autenticação
import authService from "@/features/auth/services/AuthServices";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 2. Use o novo authService para fazer o login
      const response = await authService.login(email, password);
      const token = response.token;
      localStorage.setItem("token", token);
      router.push("/users"); // ou para a página de moedas, ex: "/currency"
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
        <Box component="form" onSubmit={handleLogin} sx={authFormBox}>
          <Typography variant="h4" fontWeight="bold" color="primary" textAlign="center" mb={4}>
            Faça seu Login
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              required
              disabled={loading}
              variant="outlined"
              autoComplete="email"
              sx={yellowField}
            />
            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              required
              disabled={loading}
              variant="outlined"
              autoComplete="current-password"
              sx={yellowField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      onClick={() => setShowPassword(v => !v)}
                      edge="end"
                      sx={{ color: "#fcd34d" }}
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography color="error" textAlign="center" fontWeight="bold">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#fcd34d",
                color: "#18181b",
                fontWeight: "bold",
                fontSize: "1.1rem",
                borderRadius: 2,
                boxShadow: 3,
                "&:hover": { bgcolor: "#ffe066" },
                py: 1.5,
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
            </Button>
            <Typography textAlign="center" mt={2}>
              Não tem uma conta?{" "}
              <Link href="/register" style={{ color: "#fcd34d", fontWeight: "bold", textDecoration: "underline" }}>
                Cadastre-se
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
