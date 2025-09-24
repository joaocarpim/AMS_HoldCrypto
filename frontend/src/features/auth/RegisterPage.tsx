"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";
import { authFormBox } from "@/shared/theme/boxStyles";
import { yellowField } from "@/shared/theme/fieldStyles";
// CORREÇÃO FINAL: Usando uma importação nomeada com chaves { }
import { userService } from "@/features/user/services/userService";

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // Agora a chamada funciona corretamente
      await userService.create(form);
      setSuccess("Usuário registrado com sucesso!");
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        photo: "",
      });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao registrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
        <Box component="form" onSubmit={handleSubmit} sx={authFormBox}>
          <Typography variant="h4" fontWeight="bold" color="primary" textAlign="center" mb={4}>
            Registrar Usuário
          </Typography>
          <Stack spacing={3}>
            {success && (
              <Alert severity="success" sx={{ fontWeight: "bold", textAlign: "center" }}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ fontWeight: "bold", textAlign: "center" }}>
                {error}
              </Alert>
            )}
            <TextField label="Nome" name="name" value={form.name} onChange={handleChange} fullWidth required disabled={loading} variant="outlined" sx={yellowField} />
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required disabled={loading} variant="outlined" sx={yellowField} />
            <TextField label="Telefone" name="phone" value={form.phone} onChange={handleChange} fullWidth required disabled={loading} variant="outlined" sx={yellowField} />
            <TextField label="Endereço" name="address" value={form.address} onChange={handleChange} fullWidth required disabled={loading} variant="outlined" sx={yellowField} />
            <TextField
              label="Senha"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
              variant="outlined"
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
            <Button
              variant="outlined"
              component="label"
              sx={{
                borderColor: "#fcd34d",
                color: "#fcd34d",
                fontWeight: "bold",
                borderRadius: 2,
                "&:hover": { borderColor: "#ffe066", color: "#ffe066" },
              }}
              disabled={loading}
            >
              {form.photo ? "Foto selecionada" : "Enviar Foto"}
              <input
                type="file"
                name="photo"
                accept="image/*"
                hidden
                onChange={handlePhotoChange}
                disabled={loading}
              />
            </Button>
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Registrar"}
            </Button>
          </Stack>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
