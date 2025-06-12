"use client";

import React from "react";

import UserForm from 'shared/components/UserForm';

import { UserFormValues } from 'shared/types/types/UserFormValues';

const RegisterPage = () => {
  const handleSubmit = async (values: UserFormValues) => {
    try {
      const response = await fetch("http://localhost:5294/api/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Usuário registrado com sucesso!");
      } else {
        console.error("Erro ao registrar usuário:", await response.json());
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 transform transition duration-300 hover:scale-105">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Registrar Usuário
        </h1>
        <UserForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default RegisterPage;
