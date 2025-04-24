import React, { useState, useEffect } from "react";
import UserForm from "@/app/components/UserForm";
import { UserFormValues } from "@/app/types/UserFormValues";
import { useRouter } from "next/navigation";

const EditUserPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<UserFormValues | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5294/api/user/${params.id}`);
        const data: UserFormValues = await response.json();
        setInitialValues(data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, [params.id]);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const response = await fetch(`http://localhost:5294/api/user/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Usuário atualizado com sucesso!");
        router.push("/users");
      } else {
        console.error("Erro ao atualizar usuário:", await response.json());
      }
    } catch (error) {
      console.error("Erro na conexão com o backend:", error);
    }
  };

  if (!initialValues) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Editar Usuário</h1>
      <UserForm initialValues={initialValues} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditUserPage;