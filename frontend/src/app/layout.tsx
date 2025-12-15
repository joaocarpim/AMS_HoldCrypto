import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// IMPORTANTE: Trazendo o provedor de volta
import { NotificationProvider } from "@/shared/context/NotificationContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HoldCrypto",
  description: "Plataforma de Trading de Criptomoedas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Envolvemos o app com o provedor de notificações */}
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}