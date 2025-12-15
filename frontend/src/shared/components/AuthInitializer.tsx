// Caminho: frontend/src/shared/components/AuthInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useAuthActions } from '@/features/auth/store/useAuthStore'; // Ajuste o caminho se necessário

// Este componente não renderiza nada visualmente,
// ele apenas executa a lógica de verificação de auth uma vez.
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { fetchProfile } = useAuthActions();

  useEffect(() => {
    console.log("AuthInitializer: Running initial auth check...");
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executa apenas uma vez quando o app carrega

  return <>{children}</>; // Renderiza os filhos normalmente
}