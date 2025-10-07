'use client';
import React from 'react';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from 'next/link';
import { useTheme } from "@mui/material/styles";

const footerLinks = [
  { text: 'Home', href: '/' },
  { text: 'Moedas', href: '/currency' },
  { text: 'Login', href: '/login' },
];

export default function Footer() {
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.background.paper, // Um cinza escuro, #1E1E1E
        color: theme.palette.text.secondary,
        py: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Coluna da Esquerda: Branding */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
              AMS HoldCrypto
            </Typography>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              Sua plataforma completa para acompanhar, negociar e aprender sobre o universo das criptomoedas. Oferecemos ferramentas de ponta para suas decisões financeiras.
            </Typography>
          </Grid>

          {/* Coluna da Direita: Links Rápidos */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="white" fontWeight="bold" gutterBottom>
              Navegação
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {footerLinks.map((link) => (
                <Box component="li" key={link.text} sx={{ mb: 1 }}>
                  <Typography
                    component={Link}
                    href={link.href}
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
        
        {/* Barra de Copyright */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} AMS Trade Holding. Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

