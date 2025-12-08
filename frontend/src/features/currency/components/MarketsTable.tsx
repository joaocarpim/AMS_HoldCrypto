// Caminho: frontend/src/features/currency/components/MarketsTable.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Currency, History } from '../types/Currency';
import { useMarketsStore } from '../store/marketsStore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, IconButton, Tooltip, Avatar } from '@mui/material';
import { Star, ArrowUp, ArrowDown } from 'lucide-react';

interface MarketsTableProps {
  currencies: Currency[];
}

// Helper para calcular a variação em 24h
const getChange = (histories: History[] | undefined) => {
    if (!histories || histories.length < 2) return 0;
    const sorted = [...histories].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
    const latestPrice = sorted[0].price;
    const previousPrice = sorted[1].price;
    if (previousPrice === 0) return 0;
    return ((latestPrice - previousPrice) / previousPrice) * 100;
};

export const MarketsTable: React.FC<MarketsTableProps> = ({ currencies }) => {
  const router = useRouter();
  const { favorites, toggleFavorite } = useMarketsStore();

  const handleRowClick = (symbol: string) => {
    // Futuramente, isso levará para a página de detalhes da moeda
    // router.push(`/price/${symbol.toLowerCase()}`);
    console.log(`Navegar para detalhes de ${symbol}`);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "#fcd34d", width: '5%' }}></TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Ativo</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }} align="right">Preço</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }} align="right">Variação (24h)</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }} align="right">Volume (24h)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currencies.map((coin) => {
            const isFavorite = favorites.includes(coin.symbol);
            const change = getChange(coin.histories);
            const isPositive = change >= 0;
            const latestPrice = coin.histories?.[0]?.price || 0;

            // Adicionado fallback para caso o ID não exista (segurança)
            const uniqueKey = coin.id ?? coin.symbol;

            return (
              <TableRow
                // ****** AQUI ESTÁ A MUDANÇA ******
                key={uniqueKey} // Alterado de coin.symbol para uniqueKey (que prioriza coin.id)
                // **********************************
                hover
                onClick={() => handleRowClick(coin.symbol)}
                sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Tooltip title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que o clique na estrela acione o clique na linha
                        toggleFavorite(coin.symbol);
                      }}
                    >
                      <Star size={20} fill={isFavorite ? '#fcd34d' : 'none'} color={isFavorite ? '#fcd34d' : 'gray'} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#333', width: 32, height: 32 }}>{coin.symbol.charAt(0)}</Avatar>
                    <Box>
                      <Typography fontWeight="bold">{coin.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{coin.symbol}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight="medium">{latestPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: isPositive ? 'success.main' : 'error.main' }}>
                    {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    <Typography fontWeight="medium" sx={{ ml: 0.5 }}>{change.toFixed(2)}%</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography color="text.secondary">R$ --</Typography> {/* Placeholder para Volume */}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};