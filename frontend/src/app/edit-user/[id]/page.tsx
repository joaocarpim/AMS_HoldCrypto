import UserCrudPage from "@/features/user/pages/EditUserPage";
export default function EditUserPage({ params }: { params: { id: string } }) {
  return <UserCrudPage params={params} isEdit />;
}