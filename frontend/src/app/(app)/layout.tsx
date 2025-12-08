import { AppLayout } from "@/shared/components/AppLayout";
import { Box } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppLayout>
        {children}
      </AppLayout>
    </Box>
  );
}