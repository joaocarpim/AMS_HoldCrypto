import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '@/services/userService';
import UserList from '@/components/common/UserList';

interface User {
  id: string;
  name: string;
  email: string;
}

const DashboardPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <UserList users={users} onDelete={handleDelete} />
    </div>
  );
};

export default DashboardPage;