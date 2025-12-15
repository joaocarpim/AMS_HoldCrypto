'use client';
import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Linkedin, Github, Mail } from 'lucide-react';

const footerLinks = {
  produto: [
    { name: 'Mercados', href: '/currency' },
    { name: 'Trade', href: '/dashboard' },
    { name: 'Taxas', href: '#' },
    { name: 'Segurança', href: '#' },
  ],
  suporte: [
    { name: 'Central de Ajuda', href: '#' },
    { name: 'Fale Conosco', href: '#' },
    { name: 'Status da API', href: '#' },
  ],
  legal: [
    { name: 'Termos de Uso', href: '#' },
    { name: 'Privacidade', href: '#' },
    { name: 'Compliance', href: '#' },
  ]
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0f172a]/30 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Coluna 1: Marca */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500 text-black font-bold text-xl">
                H
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                HoldCrypto
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A plataforma de ativos digitais mais confiável para traders e investidores institucionais.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialLink icon={Twitter} href="#" />
              <SocialLink icon={Instagram} href="#" />
              <SocialLink icon={Linkedin} href="#" />
              <SocialLink icon={Github} href="#" />
            </div>
          </div>

          {/* Coluna 2: Produto */}
          <div>
            <h3 className="font-bold text-white mb-4">Produto</h3>
            <ul className="space-y-2">
              {footerLinks.produto.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Suporte */}
          <div>
            <h3 className="font-bold text-white mb-4">Suporte</h3>
            <ul className="space-y-2">
              {footerLinks.suporte.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4: Newsletter (CTA) */}
          <div>
            <h3 className="font-bold text-white mb-4">Fique Atualizado</h3>
            <p className="text-xs text-gray-400 mb-4">Receba análises de mercado diárias.</p>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={16} />
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Rodapé Inferior */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} AMS HoldCrypto. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistemas Operacionais
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Componente auxiliar para ícones sociais
const SocialLink = ({ icon: Icon, href }: { icon: any, href: string }) => (
  <a 
    href={href} 
    className="p-2 rounded-full bg-white/5 text-gray-400 hover:bg-yellow-500 hover:text-black transition-all duration-300"
  >
    <Icon size={18} />
  </a>
);