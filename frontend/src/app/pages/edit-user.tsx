// Arquivo: src/app/pages/edit-user/[id].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserById, updateUser } from '@/services/userService';

export interface User {
  id: string;
  name: string;
  email: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const data = await getUserById(id as string);
      setUser(data);
      setFormData({ name: data.name, email: data.email });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(id as string, formData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  return (
    <div className="p-8 bg-black-primary text-yellow-primary min-h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold mb-6">Editar Usuário</h1>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nome"
          className="input"
        />
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          className="input"
        />
        <button type="submit" className="btn w-full">
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}