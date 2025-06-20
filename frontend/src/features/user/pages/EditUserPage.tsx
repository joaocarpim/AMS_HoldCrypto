"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/features/user/components/UserForm";
import { UserFormValues } from "@/features/user/types/UserFormValues";
import userService, { User } from "@/features/user/services/userService";
import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { yellowBorderBox } from "@/shared/theme/boxStyles";

interface EditUserPageProps {
  id: string;
}

export default function EditUserPage({ id }: EditUserPageProps) {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<UserFormValues | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("EditUserPage: id =", id, "typeof:", typeof id);

    const userId = Number(id);
    if (!id || isNaN(userId) || userId <= 0) {
      setError("ID de usuário inválido.");
      setLoading(false);
      console.error(
        "ID inválido detectado no EditUserPage. id:",
        id,
        "userId (Number):",
        userId
      );
      return;
    }

    const fetchUser = async () => {
      try {
        console.log("Buscando usuário ID:", userId);
        const user: User = await userService.getById(userId);
        const { name, email, phone, address, password, photo } = user;
        setInitialValues({
          name,
          email,
          phone,
          address,
          password: password || "",
          photo,
        });
      } catch (err: any) {
        console.error("Erro ao buscar usuário:", err?.response?.data || err);
        setError(
          err?.response?.data?.message ||
            "Não foi possível carregar o usuário."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (values: UserFormValues) => {
    const userId = Number(id);
    if (!id || isNaN(userId) || userId <= 0) {
      alert("ID de usuário inválido.");
      console.error(
        "Tentativa de submit com ID inválido:",
        id,
        "userId (Number):",
        userId
      );
      return;
    }
    try {
      await userService.update(userId, values);
      alert("Usuário atualizado com sucesso!");
      router.push("/users");
    } catch (err: any) {
      console.error("Erro ao atualizar usuário:", err);
      alert(err.message || "Falha ao atualizar usuário.");
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        bgcolor: "background.default",
      }}
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
          Editar Usuário
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={6}>
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
            buttonLabel="Salvar"
          />
        ) : null}
      </Box>
      <Footer />
    </Box>
  );
}