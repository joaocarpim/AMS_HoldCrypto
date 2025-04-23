// Arquivo: app/pages/index.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">Bem-vindo à AMS Trade</h1>
        <p className="text-lg">Gerencie suas criptomoedas com segurança e facilidade.</p>
        <div className="space-x-4">
          <Link href="/login" className="bg-blue-500 px-6 py-3 rounded-md text-white font-semibold hover:bg-blue-600">
            Login
          </Link>
          <Link href="/register" className="bg-green-500 px-6 py-3 rounded-md text-white font-semibold hover:bg-green-600">
            Registrar
          </Link>
        </div>
      </div>
    </div>
  );
}