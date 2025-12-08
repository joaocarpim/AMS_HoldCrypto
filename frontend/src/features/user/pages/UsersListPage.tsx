'use client';

import React, { useState, useEffect } from 'react';
import { useUsersStore } from '../store/usersStore';
import { User } from '../services/userService';
import { 
  Search, Trash2, Edit2, Shield, Mail, 
  Loader2, UserX, CheckCircle2, AlertCircle, UserPlus 
} from 'lucide-react';
import { useNotification } from '@/shared/context/NotificationContext';
import Image from 'next/image';

// Importando todos os Modais
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

export function UsersListPage() {
  // Usando a Store para buscar dados
  const { users, loading, fetchUsers } = useUsersStore();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { showNotification } = useNotification();

  // Estados dos Modais
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // Novo estado
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Carregar dados via Store ao abrir a página
  useEffect(() => {
    fetchUsers().catch(() => {
        showNotification("Erro ao sincronizar usuários.", "error");
    });
  }, [fetchUsers, showNotification]);

  // Filtro de busca local (nome, email, role)
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = users.filter(user => 
      (user.name?.toLowerCase() || '').includes(term) ||
      (user.email?.toLowerCase() || '').includes(term) ||
      (user.role?.toLowerCase() || '').includes(term)
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  // --- Handlers de Ação ---

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  // Componente interno de Badge
  const RoleBadge = ({ role }: { role: string }) => {
    const cleanRole = (role || '').trim().toLowerCase();
    const isAdmin = cleanRole === 'admin';
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border tracking-wide uppercase ${isAdmin ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
        {isAdmin ? <Shield size={12} fill="currentColor" /> : <CheckCircle2 size={12} />}
        {isAdmin ? 'Admin' : 'User'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 pb-20">
      
      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            Gestão de Membros
            <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">Admin</span>
          </h1>
          <p className="text-gray-400 text-sm">Administração completa de usuários da plataforma.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
            {/* Barra de Busca */}
            <div className="relative flex-1 md:w-64 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                    <Search size={20} />
                </div>
                <input 
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0f172a]/80 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-500/50 transition-all shadow-lg placeholder-gray-600"
                />
            </div>

            {/* BOTÃO NOVO USUÁRIO */}
            <button 
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20 active:scale-95 whitespace-nowrap"
            >
                <UserPlus size={20} />
                <span className="hidden md:inline">Novo</span>
            </button>
        </div>
      </div>

      {/* --- TABELA DE DADOS --- */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px]">
          
          {/* Estado de Carregamento */}
          {loading && (
            <div className="absolute inset-0 bg-[#0f172a]/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
              <Loader2 size={40} className="animate-spin text-yellow-500 mb-4" />
              <p className="text-gray-400 animate-pulse">Sincronizando dados...</p>
            </div>
          )}

          {/* Estado Vazio */}
          {!loading && filteredUsers.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <UserX size={32} className="mb-4 opacity-50" />
              <p className="text-lg font-medium text-white">Nenhum usuário encontrado</p>
              <p className="text-sm opacity-60">Tente ajustar sua busca.</p>
            </div>
          )}

          {/* Tabela Renderizada */}
          {!loading && filteredUsers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                    <th className="p-6 pl-8">Usuário</th>
                    <th className="p-6">Contato</th>
                    <th className="p-6">Permissão</th>
                    <th className="p-6 text-right pr-8">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                      
                      {/* Coluna 1: Avatar e Nome */}
                      <td className="p-6 pl-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-white/10 overflow-hidden relative flex items-center justify-center shrink-0 shadow-inner">
                            {user.photo ? (
                              <Image src={user.photo} alt={user.name} fill className="object-cover" unoptimized />
                            ) : (
                              <span className="font-bold text-yellow-500">{user.name?.charAt(0).toUpperCase() || '?'}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm group-hover:text-yellow-500 transition-colors">
                                {user.name || "Sem Nome"}
                            </p>
                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">ID: #{user.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Coluna 2: Email */}
                      <td className="p-6 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-600" />
                            {user.email}
                        </div>
                      </td>

                      {/* Coluna 3: Badge */}
                      <td className="p-6">
                        <RoleBadge role={user.role} />
                      </td>

                      {/* Coluna 4: Ações */}
                      <td className="p-6 pr-8 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleEditClick(user)} 
                            className="p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10" 
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteClick(user)} 
                            className="p-2.5 rounded-lg text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20" 
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Footer da Tabela */}
          <div className="px-8 py-4 bg-black/20 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
            <span>Mostrando <strong>{filteredUsers.length}</strong> registro(s)</span>
          </div>
        </div>
        
        {/* Aviso de Segurança */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600 opacity-60 hover:opacity-100 transition-opacity cursor-help">
           <AlertCircle size={12} />
           <span>Painel de acesso restrito. Todas as ações são auditadas.</span>
        </div>
      </div>

      {/* --- INJEÇÃO DOS MODAIS --- */}
      <AddUserModal 
        open={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
      />
      
      <EditUserModal 
        open={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        user={selectedUser} 
      />

      <DeleteConfirmationModal 
        open={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        user={selectedUser} 
      />

    </div>
  );
}