"use client";

import React, { useState } from "react";
import UserForm from "@/features/user/components/UserForm";
import { UserFormValues } from "@/features/user/types/UserFormValues";
import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";

const RegisterPage = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: UserFormValues) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5294/api/User", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setSuccess("Usuário registrado com sucesso!");
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao registrar usuário.");
      }
    } catch (error) {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 transition-all duration-500 hover:shadow-yellow-400/40 hover:scale-[1.025]">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight drop-shadow">
            Registrar Usuário
          </h1>
          {success && <p className="text-green-600 text-center mb-4 font-semibold bg-green-50 border border-green-200 rounded-lg py-2 px-3 shadow-sm animate-pulse">{success}</p>}
          {error && <p className="text-red-500 text-center mb-4 font-semibold bg-red-50 border border-red-200 rounded-lg py-2 px-3 shadow-sm animate-pulse">{error}</p>}
          <UserForm onSubmit={handleSubmit} buttonLabel={loading ? "Registrando..." : "Registrar"} disabled={loading} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;