# Cria layout.tsx para users-mfe se não existir
$usersLayout = "apps\users-mfe\src\app\layout.tsx"
if (-not (Test-Path $usersLayout)) {
@"
import React from "react";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body>{children}</body>
    </html>
  );
}
"@ | Set-Content $usersLayout
}

# Cria layout.tsx para register-mfe se não existir
$registerLayout = "apps\register-mfe\src\app\layout.tsx"
if (-not (Test-Path $registerLayout)) {
@"
import React from "react";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body>{children}</body>
    </html>
  );
}
"@ | Set-Content $registerLayout
}

# Cria layout.tsx para shell se não existir
$shellLayout = "apps\shell\src\app\layout.tsx"
if (-not (Test-Path $shellLayout)) {
New-Item -ItemType Directory -Force -Path "apps\shell\src\app" | Out-Null
@"
import React from "react";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body>{children}</body>
    </html>
  );
}
"@ | Set-Content $shellLayout
}

# Cria página de listagem de usuários se não existir
$usersPage = "apps\users-mfe\src\app\users\page.tsx"
if (-not (Test-Path $usersPage)) {
New-Item -ItemType Directory -Force -Path "apps\users-mfe\src\app\users" | Out-Null
@"
'use client';
import React, { useEffect, useState } from "react";
import userService, { User } from 'shared/services/apis/userService';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getAll().then(setUsers).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-4'>Usuários</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}
"@ | Set-Content $usersPage
}

# Cria UserForm se não existir
$userForm = "shared\components\UserForm.tsx"
if (-not (Test-Path $userForm)) {
New-Item -ItemType Directory -Force -Path "shared\components" | Out-Null
@"
import React from 'react';
import { UserFormValues } from 'shared/types/types/UserFormValues';

interface Props {
  initialValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => void;
  buttonLabel?: string;
}

export default function UserForm({ initialValues, onSubmit, buttonLabel = 'Salvar' }: Props) {
  const [form, setForm] = React.useState<UserFormValues>(initialValues || {
    name: '', email: '', phone: '', address: '', password: '', photo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" className="w-full p-2 border rounded" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefone" className="w-full p-2 border rounded" />
      <input name="address" value={form.address} onChange={handleChange} placeholder="Endereço" className="w-full p-2 border rounded" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Senha" className="w-full p-2 border rounded" />
      <input name="photo" value={form.photo} onChange={handleChange} placeholder="Foto (URL)" className="w-full p-2 border rounded" />
      <button type="submit" className="bg-yellow-500 px-4 py-2 rounded">{buttonLabel}</button>
    </form>
  );
}
"@ | Set-Content $userForm
}

# Cria types/UserFormValues.ts se não existir
$userFormType = "shared\types\types\UserFormValues.ts"
if (-not (Test-Path $userFormType)) {
New-Item -ItemType Directory -Force -Path "shared\types\types" | Out-Null
@"
export interface UserFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  photo: string;
}
"@ | Set-Content $userFormType
}

# Cria shared/services/apis/api.ts se não existir
$apiFile = "shared\services\apis\api.ts"
if (-not (Test-Path $apiFile)) {
New-Item -ItemType Directory -Force -Path "shared\services\apis" | Out-Null
@"
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5294/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
"@ | Set-Content $apiFile
}

# Cria shared/services/apis/userService.ts se não existir
$userServiceFile = "shared\services\apis\userService.ts"
if (-not (Test-Path $userServiceFile)) {
@"
import api from './api';
import { UserFormValues } from 'shared/types/types/UserFormValues';

export interface User extends UserFormValues {
  id: number;
}

const userService = {
  async getById(id: number): Promise<User> {
    const response = await api.get<User>(`/User/${id}`);
    return response.data;
  },
  async update(id: number, data: UserFormValues): Promise<void> {
    await api.put(`/User/${id}`, data);
  },
  async create(data: UserFormValues): Promise<void> {
    await api.post('/User', data);
  },
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/User');
    return response.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/User/${id}`);
  },
};

export default userService;
export type { UserFormValues };
"@ | Set-Content $userServiceFile
}

Write-Host "Estrutura mínima criada. Agora rode npm install e npm run dev no micro frontend desejado."