"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/features/user/components/UserForm";
import { UserFormValues } from "@/features/user/types/UserFormValues";
import { userService, User } from "@/features/user/services/userService";
import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { yellowBorderBox } from "@/shared/theme/boxStyles";

// A página recebe os parâmetros da URL, que incluem o 'id' do usuário.
export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params; // Extrai o id dos parâmetros

  const [initialValues, setInitialValues] = useState<UserFormValues | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = Number(id);
    if (!id || isNaN(userId)) {
      setError("ID de usuário inválido.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const user: User = await userService.getById(userId);
        const { name, email, phone, address, photo } = user;
        // Preenche o formulário com os dados do usuário. A senha fica em branco por segurança.
        setInitialValues({ name, email, phone, address, password: "", photo });
      } catch (err: any) {
        console.error("Erro ao buscar usuário:", err);
        setError(err.response?.data?.message || "Não foi possível carregar o usuário.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const userId = Number(id);
      
      // Lógica para não enviar a senha se o campo estiver vazio
      const dataToUpdate: Partial<UserFormValues> = { ...values };
      if (!dataToUpdate.password?.trim()) {
        delete dataToUpdate.password;
      }
      
      await userService.update(userId, dataToUpdate);
      alert("Usuário atualizado com sucesso!");
      router.push("/users");
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao atualizar usuário.");
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
          Editar Usuário
        </Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Typography color="error" textAlign="center" py={4}>
            {error}
          </Typography>
        ) : initialValues ? (
          <UserForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            buttonLabel="Salvar Alterações"
          />
        ) : null}
      </Box>
      <Footer />
    </Box>
  );
}
