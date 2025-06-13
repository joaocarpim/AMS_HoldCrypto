import React from "react";
import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 px-8 py-16 space-y-12">
        <div className="text-center">
          <h2 className="text-6xl font-extrabold text-gray-900 mb-6">
            Bem-vindo à AMS HoldCrypto
          </h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Gerencie suas transações com inteligência e segurança. Use nossas ferramentas exclusivas para expandir seus negócios e se manter atualizado com as melhores práticas de mercado.
          </p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-10 py-4 rounded-lg shadow-md transition-all duration-300 focus:ring-4 focus:ring-yellow-300 font-semibold">
            Acessar Minha Conta
          </button>
          <button className="bg-black hover:bg-gray-800 text-yellow-500 px-10 py-4 rounded-lg shadow-md transition-all duration-300 focus:ring-4 focus:ring-gray-600 font-semibold">
            Saiba Mais
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}