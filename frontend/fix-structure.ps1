# Garante as pastas necessárias
New-Item -ItemType Directory -Force -Path "shared\components" | Out-Null
New-Item -ItemType Directory -Force -Path "shared\types\types" | Out-Null
New-Item -ItemType Directory -Force -Path "shared\services\apis" | Out-Null

# Cria UserForm se não existir
$userForm = "shared\components\UserForm.tsx"
if (-not (Test-Path $userForm)) {
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

# Cria UserFormValues se não existir
$userFormType = "shared\types\types\UserFormValues.ts"
if (-not (Test-Path $userFormType)) {
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

# Cria api.ts se não existir
$apiFile = "shared\services\apis\api.ts"
if (-not (Test-Path $apiFile)) {
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

# Cria userService.ts se não existir
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

# Corrige imports nos arquivos dos MFEs para usar os aliases
$files = @(
  "apps\users-mfe\src\app\create-user\page.tsx",
  "apps\users-mfe\src\app\edit-user\[id]\page.tsx",
  "apps\register-mfe\src\app\register\page.tsx"
)
foreach ($file in $files) {
  if (Test-Path $file) {
    (Get-Content $file) `
      -replace '\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/shared\/components\/UserForm', 'shared/components/UserForm' `
      -replace '\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/shared\/types\/types\/UserFormValues', 'shared/types/types/UserFormValues' `
      -replace '\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/shared\/services\/apis\/userService', 'shared/services/apis/userService' `
      -replace 'from\s+["'']shared/components/UserForm["'']', "from 'shared/components/UserForm'" `
      -replace 'from\s+["'']shared/types/types/UserFormValues["'']', "from 'shared/types/types/UserFormValues'" `
      -replace 'from\s+["'']shared/services/apis/userService["'']', "from 'shared/services/apis/userService'" `
      | Set-Content $file
  }
}

# Corrige tsconfig.json para garantir os aliases
$tsconfig = "tsconfig.json"
if (Test-Path $tsconfig) {
  $tsconfigContent = Get-Content $tsconfig -Raw
  if ($tsconfigContent -notmatch '"shared/\*": \["shared/\*"\]') {
    $tsconfigContent = $tsconfigContent -replace '"paths": \{[^\}]*\}', '"paths": { "shared/*": ["shared/*"], "services/*": ["shared/services/*"] }'
    Set-Content $tsconfig $tsconfigContent
  }
}

Write-Host "Estrutura e imports corrigidos. Agora rode npm install e npm run dev no micro frontend desejado."