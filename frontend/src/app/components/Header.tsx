"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black text-yellow-400 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 md:px-8">
        <Link href="/">
          <h1 className="text-4xl font-bold uppercase tracking-wide hover:text-yellow-500 transition duration-300 cursor-pointer">
            AMS HoldCrypto
          </h1>
        </Link>
        <nav className="space-x-6">
          <Link href="/login">
            <button className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg shadow hover:bg-yellow-500 transition duration-300">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg shadow hover:bg-yellow-500 transition duration-300">
              Registrar-se
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}