import { useState } from 'react';
import { register } from '@/app/api/auth';
import UserForm from '@/components/common/UserForm';

const RegisterPage = () => {
    const handleSubmit = async (data: any) => {
        try {
          await register(data.name, data.email, data.password); 
          alert('Usuário registrado com sucesso!');
        } catch (error) {
          console.error('Erro ao registrar usuário', error);
          alert('Ocorreu um erro ao registrar o usuário.');
        }
      };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <UserForm onSubmit={handleSubmit} />
    </div>
  );
};

export default RegisterPage;