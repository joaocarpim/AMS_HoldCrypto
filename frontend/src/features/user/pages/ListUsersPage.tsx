"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService, User } from "@/features/user/services/userService";
import MainButton from "@/shared/components/MainButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { crudTableBox, yellowBorderBox } from "@/shared/theme/boxStyles";

export default function ListUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push("/login");
        } else {
          setError("Erro ao carregar usuários.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [router]);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        await userService.delete(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch (err) {
        alert("Falha ao deletar usuário.");
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={6}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" py={4}>
        {error}
      </Typography>
    );
  }

  return (
    // O Header e o Footer foram removidos. O AppLayout cuidará disso.
    <Box sx={{ ...yellowBorderBox, maxWidth: 1100, mx: "auto" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Usuários
        </Typography>
        <MainButton onClick={() => router.push("/create-user")}>Criar Novo</MainButton>
      </Box>
      
      {users.length === 0 ? (
        <Typography textAlign="center" py={4}>
          Nenhum usuário encontrado.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={crudTableBox}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Telefone</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Endereço</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color="primary">
                      {user.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <MainButton
                        variant="primary"
                        style={{ padding: "4px 12px", fontSize: 14 }}
                        onClick={() => router.push(`/edit-user/${user.id}`)}
                      >
                        Editar
                      </MainButton>
                      <MainButton
                        variant="secondary"
                        style={{ padding: "4px 12px", fontSize: 14 }}
                        onClick={() => handleDelete(user.id)}
                      >
                        Deletar
                      </MainButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

