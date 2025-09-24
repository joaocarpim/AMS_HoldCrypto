"use client";

import React, { useState } from "react";
import { UserFormValues } from "@/features/user/types/UserFormValues";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import MainButton from "@/shared/components/MainButton";
import { yellowField } from "@/shared/theme/fieldStyles";

///////resolvido
interface UserFormProps {
  initialValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => void;
  buttonLabel?: string;
}

const fields = [
  { label: "Nome", id: "name", type: "text", placeholder: "Seu nome" },
  { label: "Email", id: "email", type: "email", placeholder: "Seu email" },
  { label: "Telefone", id: "phone", type: "text", placeholder: "Seu telefone" },
  { label: "Endereço", id: "address", type: "text", placeholder: "Seu endereço" },
  { label: "Senha", id: "password", type: "password", placeholder: "Sua senha" },
  { label: "Foto (URL)", id: "photo", type: "text", placeholder: "URL da sua foto" },
];

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
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {fields.map(({ label, id, type, placeholder }) => (
        <TextField
          key={id}
          label={label}
          name={id}
          type={type}
          value={values[id as keyof UserFormValues] as string}
          onChange={handleChange}
          placeholder={placeholder}
          error={!!errors[id]}
          helperText={errors[id]}
          sx={yellowField}
          fullWidth
        />
      ))}
      <MainButton type="submit">
        {buttonLabel || "Registrar"}
      </MainButton>
    </Box>
  );
};

export default UserForm;