'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import Header from '@/shared/components/Header';
import Footer from '@/shared/components/Footer';
import NewsSection from '@/shared/components/NewsSection';
import CoinHighlight from '@/shared/components/CoinHighlight'; // Importando o novo componente
import currencyService from '@/features/currency/services/currencyService';
import { Currency } from '@/features/currency/types/Currency';

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
        backgroundImage: 'url(https://img.freepik.com/fotos-premium/bolsa-de-valores-grafico-de-precos-criptomoeda-em-uma-tela-grafico-de-velas-btc-mercado-de-cambio-online-negociacao-licitacao-rastreando-a-taxa-de-criptomoeda-4-k-fechar-se_130265-9837.jpg)',
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

// --- NOVA Seção de Destaques do Mercado ---
const CoinHighlightsSection = () => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                // Busca as moedas do nosso backend
                const data = await currencyService.getAll();
                setCurrencies(data);
            } catch (error) {
                console.error("Erro ao buscar moedas para destaques:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrencies();
    }, []);

    const getChange = (histories: Currency['histories']) => {
        if (!histories || histories.length < 2) return 0;
        const sorted = [...histories].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
        const latestPrice = sorted[0].price;
        const previousPrice = sorted[1].price;
        if (previousPrice === 0) return 0;
        return ((latestPrice - previousPrice) / previousPrice) * 100;
    };

    return (
        <Box sx={{ py: 10, bgcolor: '#0B0B0B' }}>
            <Container maxWidth="lg">
                <Typography variant="h3" textAlign="center" fontWeight="bold" sx={{ color: '#fff', mb: 8 }}>
                    Destaques do <span style={{ color: theme.palette.primary.main }}>Mercado</span>
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center"><CircularProgress color="primary"/></Box>
                ) : (
                    <Grid container spacing={4}>
                        {currencies.slice(0, 6).map((coin) => (
                            <Grid item xs={12} sm={6} md={4} key={coin.id}>
                                <CoinHighlight 
                                    name={coin.name}
                                    symbol={coin.symbol}
                                    price={coin.histories?.[0]?.price || 0}
                                    change={getChange(coin.histories)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}


// --- Página Principal ---
export default function HomePage() {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor: '#0B0B0B' }}>
      <Header />
      <main>
        <HeroSection />
        <CoinHighlightsSection />
        <NewsSection />
      </main>
      <Footer />
    </Box>
  );
}

