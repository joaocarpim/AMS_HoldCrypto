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
  params: { id: string };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<UserFormValues | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user: User = await userService.getById(Number(params.id));
        const { name, email, phone, address, password, photo } = user;
        setInitialValues({ name, email, phone, address, password: password || "", photo });
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o usuário.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [params.id]);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      await userService.update(Number(params.id), values);
      alert("Usuário atualizado com sucesso!");
      router.push("/users");
    } catch (err: any) {
      console.error(err);
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