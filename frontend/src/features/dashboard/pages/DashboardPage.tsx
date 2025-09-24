'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Paper, Grid, useTheme, Divider, Avatar, CircularProgress, Container, Stack } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Header from '@/shared/components/Header';
import Footer from '@/shared/components/Footer';
import currencyService from '@/features/currency/services/currencyService';
import { Currency } from '@/features/currency/types/Currency';
import authService from '@/features/auth/services/AuthServices'; // Caminho corrigido

// --- DADOS SIMULADOS PARA O GRÁFICO E TRANSAÇÕES ---
const balanceData = [
  { name: 'Jan', Income: 4000, Outcome: 2400, Balance: 1600 },
  { name: 'Fev', Income: 3000, Outcome: 1398, Balance: 1602 },
  { name: 'Mar', Income: 2000, Outcome: 9800, Balance: -7800 },
  { name: 'Abr', Income: 2780, Outcome: 3908, Balance: -1128 },
  { name: 'Mai', Income: 1890, Outcome: 4800, Balance: -2910 },
  { name: 'Jun', Income: 2390, Outcome: 3800, Balance: -1410 },
  { name: 'Jul', Income: 3490, Outcome: 4300, Balance: -810 },
];

const transactionsData = [
    { id: 1, type: 'Depósito', amount: 1302.00, currency: 'USDT', date: '27 Oct 2022' },
    { id: 2, type: 'Saque', amount: 628.00, currency: 'ETH', date: '26 Oct 2022' },
    { id: 3, type: 'Trade', amount: 200.50, currency: 'BTC', date: '25 Oct 2022' },
];

// --- COMPONENTES DA DASHBOARD ---

// Card para cada moeda na seção "Suas Carteiras"
const WalletCard = ({ currency }: { currency: Currency }) => {
    const theme = useTheme();
    const latestPrice = currency.histories?.[0]?.price || 0;
    // Simulação de quanto o usuário possui daquela moeda
    const userAmount = (Math.random() * 2).toFixed(4); 
    const userValueBRL = (latestPrice * parseFloat(userAmount)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <Paper sx={{ p: 2, bgcolor: '#1E1E1E', borderRadius: 4, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32, mr: 1, color: '#0B0B0B', fontWeight:'bold' }}>
                    {currency.symbol.charAt(0)}
                </Avatar>
                <Typography fontWeight="bold">{currency.name}</Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold">{userValueBRL}</Typography>
            <Typography variant="body2" color="text.secondary">{userAmount} {currency.symbol}</Typography>
        </Paper>
    );
};


// --- PÁGINA PRINCIPAL DA DASHBOARD ---

export default function DashboardPage() {
  const router = useRouter();
  const theme = useTheme();
  const [userName, setUserName] = useState('');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const [profile, currencyData] = await Promise.all([
          authService.getProfile(),
          currencyService.getAll()
        ]);
        setUserName(profile.user);
        setCurrencies(currencyData);
      } catch (error) {
        console.error("Erro ao buscar dados da dashboard:", error);
        router.push("/login"); // Redireciona em caso de erro de autenticação
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#0B0B0B' }}><CircularProgress color="primary" /></Box>;
  }

  return (
    <Box sx={{ bgcolor: '#0B0B0B', color: '#fff', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        
        <Grid container spacing={4}>
          {/* Coluna Principal (Gráfico e Carteiras) */}
          <Grid item xs={12} lg={9}>
            {/* Seção de Overview (Gráfico) */}
            <Paper sx={{ p: 3, bgcolor: '#1E1E1E', borderRadius: 4, mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Overview</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={balanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip contentStyle={{ backgroundColor: '#2a2a2a', border: 'none' }} />
                    <Legend />
                    <Area type="monotone" dataKey="Income" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="Outcome" stroke="#8884d8" fillOpacity={0.2} fill="#8884d8" />
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

          {/* Coluna Lateral (Transações) */}
          <Grid item xs={12} lg={3}>
             <Paper sx={{ p: 3, bgcolor: '#1E1E1E', borderRadius: 4, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Transações Recentes</Typography>
                <Stack spacing={2}>
                    {transactionsData.map((tx, index) => (
                        <React.Fragment key={tx.id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography fontWeight="bold">{tx.type}</Typography>
                                    <Typography variant="body2" color="text.secondary">{tx.date}</Typography>
                                </Box>
                                <Typography fontWeight="bold" sx={{ color: tx.type === 'Saque' ? '#ef4444' : '#22c55e' }}>
                                    {tx.amount.toFixed(2)} {tx.currency}
                                </Typography>
                            </Box>
                            {index < transactionsData.length - 1 && <Divider sx={{ bgcolor: '#333' }} />}
                        </React.Fragment>
                    ))}
                </Stack>
             </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
}

