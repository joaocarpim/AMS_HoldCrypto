import { AppLayout } from "@/shared/components/AppLayout";
import Footer from "@/shared/components/Footer"; // 1. Importe o Footer
import { Box } from "@mui/material";

// Este arquivo aplica o layout com o menu lateral e o rodapé a todas as páginas filhas.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppLayout>
        {children}
      </AppLayout>
      {/* 2. Adicione o Footer aqui, fora do AppLayout para que ele fique no final da página */}
      <Footer />
    </Box>
  );
}
