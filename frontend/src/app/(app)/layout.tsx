/* ======================================================================
   FILE: src/app/(app)/layout.tsx
   ====================================================================== */
import { AppLayout } from "@/shared/components/AppLayout";
import ChatbotWidget from "@/features/chatbot/components/ChatbotWidget";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* 1. AppLayout: 
               Componente que contém a Sidebar lateral e a Topbar.
               Ele envolve o {children} (que é a página atual: Dashboard, Wallet, etc).
            */}
            <AppLayout>
                {children}
            </AppLayout>

            {/* 2. ChatbotWidget:
               Colocado fora do AppLayout (mas dentro do Fragmento <>), 
               ele flutua por cima da aplicação inteira graças ao CSS 'fixed'.
               Como este layout não recarrega ao mudar de rota interna, 
               o chat não fecha ao navegar.
            */}
            <ChatbotWidget />
        </>
    );
}