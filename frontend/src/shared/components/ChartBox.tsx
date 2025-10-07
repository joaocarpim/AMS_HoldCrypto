'use client';
import React, { useState } from 'react';
import { Box, Typography, Button, useTheme, Paper, ButtonGroup } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Tipagem para os dados do gráfico
type PeriodKey = 'week' | 'month' | 'year';
interface BalanceData {
  name: string;
  Balance: number;
  Income: number;
  Outcome: number;
}

// Dados simulados para diferentes períodos, focados em balanço
const chartData: Record<PeriodKey, BalanceData[]> = {
  week: [
    { name: 'Seg', Income: 400, Outcome: 240, Balance: 160 },
    { name: 'Ter', Income: 300, Outcome: 139, Balance: 161 },
    { name: 'Qua', Income: 200, Outcome: 980, Balance: -780 },
    { name: 'Qui', Income: 278, Outcome: 390, Balance: -112 },
    { name: 'Sex', Income: 189, Outcome: 480, Balance: -291 },
  ],
  month: [
    { name: 'Sem 1', Income: 1400, Outcome: 400, Balance: 1000 },
    { name: 'Sem 2', Income: 1500, Outcome: 1000, Balance: 500 },
    { name: 'Sem 3', Income: 1200, Outcome: 1800, Balance: -600 },
    { name: 'Sem 4', Income: 2000, Outcome: 500, Balance: 1500 },
  ],
  year: [
    { name: 'Jan', Income: 4000, Outcome: 2400, Balance: 1600 },
    { name: 'Fev', Income: 3000, Outcome: 1398, Balance: 1602 },
    { name: 'Mar', Income: 2000, Outcome: 9800, Balance: -7800 },
    { name: 'Abr', Income: 2780, Outcome: 3908, Balance: -1128 },
    { name: 'Mai', Income: 1890, Outcome: 4800, Balance: -2910 },
    { name: 'Jun', Income: 2390, Outcome: 3800, Balance: -1410 },
  ],
};

const periods: { label: string; key: PeriodKey }[] = [
  { label: "Semana", key: "week" },
  { label: "Mês", key: "month" },
  { label: "Ano", key: "year" },
];

export default function ChartBox() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("year");
  const theme = useTheme();
  const data = chartData[selectedPeriod];

  return (
    <Paper 
        sx={{ 
            p: 3, 
            bgcolor: 'background.paper', 
            borderRadius: 4, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Overview
        </Typography>
        <ButtonGroup variant="outlined" size="small">
            {periods.map((p) => (
                <Button
                    key={p.key}
                    onClick={() => setSelectedPeriod(p.key)}
                    sx={{
                        color: selectedPeriod === p.key ? '#0B0B0B' : 'primary.main',
                        backgroundColor: selectedPeriod === p.key ? 'primary.main' : 'transparent',
                        borderColor: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'primary.main',
                            color: '#0B0B0B',
                            opacity: 0.9
                        }
                    }}
                >
                    {p.label}
                </Button>
            ))}
        </ButtonGroup>
      </Box>
      <Box flex={1} minHeight={300}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
             <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke={theme.palette.text.secondary} fontSize={12} />
            <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
            <Tooltip
              contentStyle={{ 
                  backgroundColor: 'rgba(30, 30, 30, 0.8)', 
                  borderColor: theme.palette.divider,
                  borderRadius: theme.shape.borderRadius
              }}
              labelStyle={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Area 
                type="monotone" 
                dataKey="Balance" 
                stroke={theme.palette.primary.main} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

