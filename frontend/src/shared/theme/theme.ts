import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

export const inter = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Este é o nosso novo tema centralizado, a "constituição" do design.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#F0B90B" }, // Amarelo principal
    secondary: { main: "#ffe066" }, // Amarelo mais claro para hovers
    background: { 
      default: "#0B0B0B", // Preto profundo para fundos de página
      paper: "#1E1E1E"    // Cinza escuro para cards e elementos elevados
    },
    text: { 
      primary: "#FFFFFF",
      secondary: "#b0b0b0" 
    },
    divider: "#333333",
    success: { main: "#22c55e" },
    error: { main: "#ef4444" },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
        },
        containedPrimary: {
          color: "#0B0B0B",
          '&:hover': {
            backgroundColor: "#ffe066",
          }
        },
      },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none', // Remove gradientes padrão do MUI em modo dark
            }
        }
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& label.Mui-focused': {
                    color: '#F0B90B',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#333333',
                    },
                    '&:hover fieldset': {
                        borderColor: '#F0B90B',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#F0B90B',
                    },
                },
            }
        }
    }
  },
});

export default theme;

