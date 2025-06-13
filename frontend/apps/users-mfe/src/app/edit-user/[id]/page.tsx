'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserForm from 'shared/components/UserForm';
import { UserFormValues } from 'shared/types/types/UserFormValues';
import userService, { User } from 'shared/services/apis/userService';
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
        setInitialValues({ name, email, phone, address, password, photo });
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar o usuário.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [params.id]);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      await userService.update(Number(params.id), values);
      alert('Usuário atualizado com sucesso!');
      router.push('/users');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Falha ao atualizar usuário.');
    }
  };

  if (loading) return <p className="p-8 text-center">Carregando...</p>;
  if (error)   return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!initialValues) return null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Editar Usuário</h1>
      <UserForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        buttonLabel="Salvar"
      />
    </div>
  );
}