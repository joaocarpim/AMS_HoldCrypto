import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import MuiProvider from './mui-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AMS HoldCrypto',
  description: 'Sua plataforma de criptomoedas',
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <MuiProvider>
          {children}
        </MuiProvider>
      </body>
    </html>
  );
}

