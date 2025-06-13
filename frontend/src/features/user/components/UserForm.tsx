"use client";

import React, { useState } from "react";
import { UserFormValues } from "@/features/user/types/UserFormValues";
interface UserFormProps {
  initialValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => void;
  buttonLabel?: string;
  disabled?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  buttonLabel,
  disabled = false,
}) => {
  const [values, setValues] = useState<UserFormValues>(
    initialValues || {
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      photo: "",
    }
  );
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!values.name) newErrors.name = "O nome é obrigatório.";
    if (!values.email) {
      newErrors.email = "O email é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Formato de email inválido.";
    }
    if (!values.phone) newErrors.phone = "O telefone é obrigatório.";
    if (!values.password) newErrors.password = "A senha é obrigatória.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(values);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
      aria-label="Formulário de Usuário"
    >
      {[
        { label: "Nome", id: "name", type: "text", placeholder: "Seu nome" },
        { label: "Email", id: "email", type: "email", placeholder: "Seu email" },
        { label: "Telefone", id: "phone", type: "text", placeholder: "Seu telefone" },
        { label: "Endereço", id: "address", type: "text", placeholder: "Seu endereço" },
        { label: "Senha", id: "password", type: showPassword ? "text" : "password", placeholder: "Sua senha" },
        { label: "Foto (URL)", id: "photo", type: "text", placeholder: "URL da sua foto" },
      ].map(({ label, id, type, placeholder }) => (
        <div key={id} className="flex flex-col gap-1 relative">
          <label
            htmlFor={id}
            className="block text-base font-semibold text-gray-800"
          >
            {label}
          </label>
          <input
            type={type}
            name={id}
            id={id}
            value={values[id as keyof UserFormValues] as string}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full h-12 px-4 border ${
              errors[id]
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-yellow-400"
            } rounded-2xl shadow-sm focus:outline-none focus:ring-2 text-black bg-gray-50 transition-all duration-300 ${id === "password" ? "pr-12" : "pr-4"}`}
            disabled={disabled}
            aria-required="true"
            aria-label={label}
          />
          {/* Olho para senha */}
          // ...existing code...
{ id === "password" && (
  <button
    type="button"
    tabIndex={-1}
    className="absolute right-3 inset-y-0 my-auto flex items-center justify-center text-gray-500 hover:text-yellow-500 transition"
    onClick={() => setShowPassword(v => !v)}
    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
    disabled={disabled}
    style={{ pointerEvents: disabled ? "none" : "auto" }}
  >
    {showPassword ? (
      // Olho aberto
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ) : (
      // Olho fechado
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m1.414-1.414A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6.364 6.364L6 18m12-12l-1.636 1.636" />
      </svg>
    )}
  </button>
)}

          {errors[id] && (
            <p className="text-red-600 text-xs font-medium mt-1">{errors[id]}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-black font-bold py-3 rounded-2xl shadow-lg transition-all duration-200 text-lg disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400"
        disabled={disabled}
        aria-busy={disabled}
      >
        {disabled && (
          <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        )}
        {buttonLabel || "Registrar"}
      </button>
    </form>
  );
};

export default UserForm;