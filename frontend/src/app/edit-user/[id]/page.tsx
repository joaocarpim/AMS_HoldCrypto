"use client";
import EditUserPage from "@/features/user/pages/EditUserPage";

export default function EditUserRoutePage({ params }: { params: { id: string } }) {
  // Acesse diretamente. O warning é só aviso para o futuro.
  return <EditUserPage id={params.id} />;
}