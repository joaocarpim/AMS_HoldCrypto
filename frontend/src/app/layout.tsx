import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";

// CORREÇÃO: Usando um caminho relativo para garantir que o módulo seja encontrado.
import { ThemeProvider } from "../shared/theme/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AMS HoldCrypto",
  description: "Sua plataforma completa para o universo cripto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* Envolva todo o conteúdo (children) com o ThemeProvider */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

