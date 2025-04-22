import { AuthProvider } from '@/app/context/AuthContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/common/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trade Holding',
  description: 'by AMS-ADS 5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <AuthProvider>
          <Header pageName="Trade Holding" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}