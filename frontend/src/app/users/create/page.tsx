"use client";

import React from "react";
import UserForm from "@/app/components/UserForm";
import { UserFormValues } from "@/app/types/UserFormValues";

const CreateUserPage = () => {
  const handleSubmit = async (values: UserFormValues) => {
    try {
      const response = await fetch("http://localhost:5294/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Usuário criado com sucesso!");
      } else {
        console.error("Erro ao criar usuário:", await response.json());
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Criar Usuário</h1>
      <UserForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateUserPage;