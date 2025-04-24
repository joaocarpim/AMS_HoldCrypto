// Arquivo: src/components/Header.tsx
import Link from 'next/link';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link href="/">
          <h1 className="text-white text-lg font-bold">AMS Trade Holding</h1>
        </Link>
      </div>
      <nav className="nav">
        <ul className="flex space-x-4">
          <li>
            <Link href="/users" className="text-white hover:text-rose-500">
              Usuários
            </Link>
          </li>
          <li>
            <Link href="/login" className="text-white hover:text-rose-500">
              Login
            </Link>
          </li>
          <li>
            <Link href="/register" className="text-white hover:text-rose-500">
              Registrar
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;