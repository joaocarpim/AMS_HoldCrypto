// mobile/hooks/useInitializeAuth.ts

import { useEffect, useRef } from 'react';
import { useAuthStore } from '../src/features/auth/store/useAuthStore'; 

export function useInitializeAuth() {
  const isRunning = useRef(false);

  useEffect(() => {
    if (isRunning.current) return;
    isRunning.current = true;

    console.log("HOOK: Verificando hidratação...");

    const checkHydration = () => {
        // Verifica diretamente no gerenciador de persistência
        const hasHydrated = useAuthStore.persist.hasHydrated();
        const state = useAuthStore.getState();

        // Se ainda não estiver marcado como hidratado na store, forçamos.
        if (!hasHydrated || !state._hasHydrated) {
             if (!hasHydrated) {
                 console.log("HOOK: Rehidratando...");
                 useAuthStore.persist.rehydrate();
             }
             
             // Pequeno delay para garantir que o React processe
             setTimeout(() => {
                 console.log("HOOK: Liberando App...");
                 // Usamos setState para evitar depender de actions que podem não existir
                 useAuthStore.setState({ _hasHydrated: true } as any);
             }, 100);
        }
    };

    checkHydration();
  }, []);
}