'use client';
import React from 'react';
import { Box, Typography, Paper, Avatar, useTheme } from '@mui/material';

export interface CoinHighlightProps {
  name: string;
  symbol: string;
  price: number;
  change: number;
}

// 1. Adicionamos a mesma função de formatação da Dashboard aqui
const formatCurrencyValue = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
    // Para valores menores, usamos a formatação completa para precisão
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getSymbolColor = (symbol: string) => {
  const colors = ['#F0B90B', '#627EEA', '#26A17B', '#F3BA2F', '#8A2BE2', '#4F4F4F', '#f0f0f0'];
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const CoinHighlight: React.FC<CoinHighlightProps> = ({ name, symbol, price, change }) => {
  const theme = useTheme();
  const isPositive = change >= 0;

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${theme.palette.primary.main}20`,
        },
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: getSymbolColor(symbol), width: 40, height: 40, mr: 2, color: '#0B0B0B', fontWeight: 'bold' }}>
          {symbol.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {symbol}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant="h5" fontWeight="bold" textAlign="right">
          {/* 2. Aplicamos a formatação aqui */}
          R$ {formatCurrencyValue(price)}
        </Typography>
        <Typography
          textAlign="right"
          fontWeight="bold"
          sx={{ color: isPositive ? theme.palette.success.main : theme.palette.error.main }}
        >
          {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </Typography>
      </Box>
    </Paper>
  );
};

export default CoinHighlight;

