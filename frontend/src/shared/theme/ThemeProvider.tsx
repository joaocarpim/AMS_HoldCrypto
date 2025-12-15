// Caminho: frontend/src/shared/theme/ThemeProvider.tsx

'use client';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
// Usando o caminho relativo para garantir que funcione
import theme from './theme'; 

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}