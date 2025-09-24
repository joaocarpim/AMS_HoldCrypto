'use client';
import React from 'react';
import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import Header from '@/shared/components/Header';
import Footer from '@/shared/components/Footer';
import NewsSection from '@/shared/components/NewsSection'; // Importando a seção de notícias/features

// --- Seção Hero (Banner Principal) ---
const HeroSection = () => (
  <Box
    sx={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center',
      color: '#fff',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1640282399599-ce4f4a133b3a?q=80&w=2070&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.3)',
        zIndex: 1,
      },
      '& > *': {
        zIndex: 2,
      },
    }}
  >
    <Container maxWidth="md">
      <Typography variant="h1" component="h1" fontWeight="bold" gutterBottom>
        HoldCrypto
      </Typography>
      <Typography variant="h5" component="p" color="textSecondary" sx={{ mb: 4, color: '#e0e0e0' }}>
        O futuro das finanças digitais começa agora. Domine o mercado de criptomoedas com ferramentas de ponta.
      </Typography>
      <Link href="/register" passHref>
        <Button variant="contained" color="primary" size="large" sx={{ fontWeight: 'bold', px: 6, py: 2, fontSize: '1.2rem' }}>
          Comece Agora
        </Button>
      </Link>
    </Container>
  </Box>
);

// --- Página Principal ---
export default function HomePage() {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor: '#0B0B0B' }}>
      <Header />
      <main>
        <HeroSection />
        {/* AQUI ESTÁ A INTEGRAÇÃO CORRETA: Chamando o componente NewsSection */}
        <NewsSection />
      </main>
      <Footer />
    </Box>
  );
}

