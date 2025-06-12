'use client';

import React from "react";
import UserForm from 'shared/components/UserForm';
import { UserFormValues } from 'shared/types/types/UserFormValues';
import userService from 'shared/services/apis/userService';

export default function CreateUserPage() {
  const handleSubmit = async (values: UserFormValues) => {
    try {
      await userService.create(values);
      alert('Usuário criado com sucesso!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Criar Usuário</h1>
      <UserForm onSubmit={handleSubmit} buttonLabel="Criar" />
    </div>
  );
}
