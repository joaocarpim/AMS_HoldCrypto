"use client";

import React, { useState } from 'react';
import { UserFormValues } from 'shared/types/types/UserFormValues';

interface UserFormProps {
  initialValues?: UserFormValues; //Para edição ou valores iniciais
  onSubmit: (values: UserFormValues) => void;
  buttonLabel?: string;
}

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  buttonLabel,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {[
        { label: "Nome", id: "name", type: "text", placeholder: "Seu nome" },
        {
          label: "Email",
          id: "email",
          type: "email",
          placeholder: "Seu email",
        },
        {
          label: "Telefone",
          id: "phone",
          type: "text",
          placeholder: "Seu telefone",
        },
        {
          label: "Endereço",
          id: "address",
          type: "text",
          placeholder: "Seu endereço",
        },
        {
          label: "Senha",
          id: "password",
          type: "password",
          placeholder: "Sua senha",
        },
        {
          label: "Foto (URL)",
          id: "photo",
          type: "text",
          placeholder: "URL da sua foto",
        },
      ].map(({ label, id, type, placeholder }) => (
        <div key={id}>
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none text-black"
          />
          {errors[id] && (
            <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition duration-300"
      >
        {buttonLabel || "Registrar"}
      </button>
    </form>
  );
};

export default UserForm;
