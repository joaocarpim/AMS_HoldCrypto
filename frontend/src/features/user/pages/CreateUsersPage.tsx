"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/features/user/components/UserForm";
import { UserFormValues } from "@/features/user/types/UserFormValues";
import { userService } from "@/features/user/services/userService";
import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { yellowBorderBox } from "@/shared/theme/boxStyles";

export default function CreateUserPage() {
  const router = useRouter();

  // O estado inicial é sempre um formulário vazio para a criação.
  const [initialValues] = useState<UserFormValues>({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    photo: "",
  });

  const handleSubmit = async (values: UserFormValues) => {
    try {
      // A função agora só precisa chamar o método 'create'.
      await userService.create(values);
      alert("Usuário criado com sucesso!");
      router.push("/users");
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao criar usuário.");
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      sx={{ bgcolor: "background.default" }}
    >
      <Header />
      <Box
        sx={{
          ...yellowBorderBox,
          maxWidth: 480,
          width: "100%",
          mx: "auto",
          mt: 8,
          mb: 8,
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          boxShadow: 3,
        }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary"
          mb={3}
          textAlign="center"
        >
          Criar Novo Usuário
        </Typography>
        
        {/* Renderiza o formulário diretamente */}
        <UserForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          buttonLabel="Criar"
        />

      </Box>
      <Footer />
    </Box>
  );
}
