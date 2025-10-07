'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Paper, Grid, useTheme, Divider, Avatar, CircularProgress, Container, Stack, Button, TextField } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import currencyService from '@/features/currency/services/currencyService';
import { Currency, History } from '@/features/currency/types/Currency';
import authService from '@/features/auth/services/AuthServices';

// --- FUNÇÃO DE FORMATAÇÃO ---
const formatCurrencyValue = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// --- COMPONENTES DA DASHBOARD ---
const WalletCard = ({ currency }: { currency: Currency }) => {
    const theme = useTheme();
    const latestPrice = currency.histories?.[0]?.price || 0;
    const userAmount = (Math.random() * 2); 
    const userValue = latestPrice * userAmount;

    return (
        <Paper sx={{ p: 2, bgcolor: '#1E1E1E', borderRadius: 4, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32, mr: 1, color: '#0B0B0B', fontWeight:'bold' }}>
                    {currency.symbol.charAt(0)}
                </Avatar>
                <Typography fontWeight="bold">{currency.name}</Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold">
                R$ {formatCurrencyValue(userValue)}
            </Typography>
            <Typography variant="body2" color="text.secondary">{userAmount.toFixed(4)} {currency.symbol}</Typography>
        </Paper>
    );
};

const HotList = ({ currencies, onSelectCoin, selectedCoin }: { currencies: Currency[], onSelectCoin: (coin: Currency) => void, selectedCoin: Currency | null }) => {
    const theme = useTheme();
    
    const getChange = (histories: History[] | undefined) => {
        if (!histories || histories.length < 2) return 0;
        const sorted = [...histories].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
        const latestPrice = sorted[0].price;
        const previousPrice = sorted[1].price;
        if (previousPrice === 0) return 0;
        return ((latestPrice - previousPrice) / previousPrice) * 100;
    };

    return (
        <Paper sx={{ p: 2, bgcolor: '#1E1E1E', borderRadius: 4, mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Hot List</Typography>
            <Stack spacing={1}>
                {currencies.map((coin) => {
                    const change = getChange(coin.histories);
                    const isPositive = change >= 0;
                    const latestPrice = coin.histories?.[0]?.price || 0;
                    const isSelected = selectedCoin?.id === coin.id;
                    return (
                        <Box 
                            key={coin.id} 
                            onClick={() => onSelectCoin(coin)}
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                cursor: 'pointer',
                                p: 1,
                                borderRadius: 2,
                                backgroundColor: isSelected ? 'rgba(240, 185, 11, 0.1)' : 'transparent',
                                border: `1px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32, mr: 1.5, color: '#0B0B0B', fontWeight:'bold' }}>
                                    {coin.symbol.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">{coin.symbol}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: -0.5 }}>{coin.name}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body1" fontWeight="bold">
                                    {latestPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: isPositive ? theme.palette.success.main : theme.palette.error.main }}>
                                    {isPositive ? '+' : ''}{change.toFixed(2)}%
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Stack>
        </Paper>
    );
};

const SwapWidget = () => (
    <Paper sx={{ p: 3, bgcolor: '#1E1E1E', borderRadius: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>Swap</Typography>
        <Stack spacing={2}>
            <TextField label="Você Paga" defaultValue="0" variant="outlined" />
            <TextField label="Você Recebe" defaultValue="0" variant="outlined" />
            <Button variant="contained" color="primary" sx={{ fontWeight: 'bold', py: 1.5 }}>Swap</Button>
        </Stack>
    </Paper>
);

// --- PÁGINA PRINCIPAL DA DASHBOARD ---
export default function DashboardPage() {
  const router = useRouter();
  const theme = useTheme();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<Currency | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        // Agora, só precisamos buscar as moedas, o perfil já é tratado no Header/Layout
        const currencyData = await currencyService.getAll();
        setCurrencies(currencyData);
        if (currencyData.length > 0) {
            setSelectedCoin(currencyData[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da dashboard:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // Prepara os dados do histórico para o gráfico da moeda selecionada
  const chartData = selectedCoin?.histories
    ?.map(h => ({ 
        name: new Date(h.datetime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'}), 
        price: h.price 
    }))
    .reverse();

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress color="primary" /></Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        
        <Grid container spacing={4}>
          {/* Coluna Principal (Gráfico e Carteiras) */}
          <Grid item xs={12} lg={8}>
            {/* Seção de Overview (Gráfico Dinâmico) */}
            <Paper sx={{ p: 3, bgcolor: '#1E1E1E', borderRadius: 4, mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {selectedCoin ? `Histórico de ${selectedCoin.name}` : 'Overview'}
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke={theme.palette.text.secondary} fontSize={10} />
                    <YAxis 
                        stroke={theme.palette.text.secondary} 
                        fontSize={10} 
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(value) => `$${formatCurrencyValue(value)}`}
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(30, 30, 30, 0.8)', border: 'none', borderRadius: theme.shape.borderRadius }} 
                        labelStyle={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
                        formatter={(value) => [value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'Preço']}
                    />
                    <Area type="monotone" dataKey="price" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            {/* Seção Suas Carteiras */}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Suas Carteiras</Typography>
            <Grid container spacing={3}>
              {currencies.slice(0, 4).map(currency => (
                <Grid item xs={12} sm={6} md={3} key={currency.id}>
                  <WalletCard currency={currency} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Coluna Lateral (Hot List e Swap) */}
          <Grid item xs={12} lg={4}>
             <HotList currencies={currencies} onSelectCoin={setSelectedCoin} selectedCoin={selectedCoin} />
             <SwapWidget />
          </Grid>
        </Grid>
      </Container>
  );
}
