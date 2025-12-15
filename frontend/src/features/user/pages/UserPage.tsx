"use client";

import React, { useEffect, useState } from "react";
import { useUsersStore } from "@/features/user/store/usersStore";
import { User } from "@/features/user/services/userService";

// MUI Components
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress,
  IconButton, Avatar, Tooltip, TextField, InputAdornment
} from "@mui/material";

// Lucide Icons
import { Users as UsersIcon, UserPlus, Edit, Trash2, Search } from 'lucide-react';

// Nossos componentes de Modal
import AddUserModal from '@/features/user/components/AddUserModal';
import EditUserModal from '@/features/user/components/EditUserModal';
import DeleteConfirmationModal from '@/features/user/components/DeleteConfirmationModal'; // <-- 1. IMPORTAÇÃO

export default function UsersPage() {
  const { users, loading, error, fetchUsers } = useUsersStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };
  
  const handleOpenDeleteModal = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      {/* ... (Cabeçalho da página e Paper da tabela) ... */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <UsersIcon size={32} color="#fcd34d" />
          Gerenciamento de Usuários
        </Typography>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md transition-colors duration-200 shadow-sm font-bold"
        >
          <UserPlus size={20} />
          <span>Adicionar Usuário</span>
        </button>
      </Box>

      <Paper sx={{ p: 3, bgcolor: '#1E1E1E', borderRadius: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
                Todos os Usuários ({filteredUsers.length})
            </Typography>
            <TextField
                variant="outlined"
                size="small"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search size={18} />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
        
        {loading ? (
            <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress color="primary" />
            </Box>
        ) : error ? (
            <Typography color="error" textAlign="center" py={10}> {error} </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Usuário</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Contato</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#fcd34d", textAlign: 'center' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={user.photo} alt={user.name}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography fontWeight="bold" color="text.primary">{user.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2" color="text.primary">{user.phone}</Typography>
                        <Typography variant="body2" color="text.secondary">{user.address}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleOpenEditModal(user)}>
                          <Edit size={20} color="#fcd34d" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deletar">
                        <IconButton onClick={() => handleOpenDeleteModal(user)}>
                          <Trash2 size={20} color="#ef4444" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Nossos modais renderizados */}
      <AddUserModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <EditUserModal open={editModalOpen} onClose={() => setEditModalOpen(false)} user={selectedUser} />
      
      {/* 2. ATIVAÇÃO DO MODAL DE DELEÇÃO */}
      <DeleteConfirmationModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} user={selectedUser} />
    </Box>
  );
}