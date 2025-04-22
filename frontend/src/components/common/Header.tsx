'use client'; 

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

interface HeaderProps {
  pageName?: string;
}

const Header = ({ pageName = 'AMS Trade' }: HeaderProps) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1>{pageName}</h1>
        <nav>
          {isAuthenticated ? (
            <button onClick={logout} className="text-red-500">
              Logout
            </button>
          ) : (
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;