// Arquivo: src/components/UserItem.tsx
import { User } from '../types/user';

const UserItem = ({ user }: { user: User }) => {
  return (
    <li className="bg-rose-100 p-4 rounded mb-4 shadow-md">
      <h2 className="text-binance-gray text-lg font-bold">{user.name}</h2>
      <p className="text-binance-gray text-sm">{user.email}</p>
    </li>
  );
};

export default UserItem;