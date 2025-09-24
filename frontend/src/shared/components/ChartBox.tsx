'use client';
import { useState } from "react";
import { Box, Typography, ButtonGroup, Button, CircularProgress, Container, Stack } from "@mui/material"; // 1. Imports adicionados
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { yellowBorderBox } from "@/shared/theme/boxStyles";

// Tipagem para as moedas
type PeriodKey = "dias" | "meses" | "anos";
interface CoinData {
  name: string;
  symbol: string;
  color: string;
  data: Record<PeriodKey, { name: string; value: number }[]>;
}

// Dados simulados para diferentes períodos
const coins: CoinData[] = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    color: "#fcd34d",
    data: {
      dias: [
        { name: "Seg", value: 250000 },
        { name: "Ter", value: 252000 },
        { name: "Qua", value: 251000 },
        { name: "Qui", value: 253000 },
        { name: "Sex", value: 252500 },
      ],
      meses: [
        { name: "Jan", value: 220000 },
        { name: "Fev", value: 230000 },
        { name: "Mar", value: 240000 },
        { name: "Abr", value: 245000 },
        { name: "Mai", value: 252500 },
      ],
      anos: [
        { name: "2020", value: 40000 },
        { name: "2021", value: 120000 },
        { name: "2022", value: 180000 },
        { name: "2023", value: 210000 },
        { name: "2024", value: 252500 },
      ],
    },
  },
  // ... outros dados de moedas
];

const periods: { label: string; key: PeriodKey }[] = [
  { label: "Dias", key: "dias" },
  { label: "Meses", key: "meses" },
  { label: "Anos", key: "anos" },
];

export default function ChartBox() {
  const [selectedCoin, setSelectedCoin] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("anos");

  const coin = coins[selectedCoin];
  const data = coin.data[selectedPeriod];

  return (
    <Box
      sx={{
        ...yellowBorderBox,
        minWidth: 340,
        maxWidth: 600,
        mb: { xs: 4, md: 0 },
        height: { xs: 420, md: 480 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" color="primary" gutterBottom>
        Gráfico de {coin.name}
      </Typography>
      <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
        {coins.map((c: CoinData, idx: number) => (
          <Button
            key={c.symbol}
            onClick={() => setSelectedCoin(idx)}
            sx={{
              color: selectedCoin === idx ? "#18181b" : "#fcd34d",
              background: selectedCoin === idx ? "#fcd34d" : "transparent",
              borderColor: "#fcd34d",
              "&:hover": {
                background: "#ffe066",
                color: "#18181b",
              },
            }}
          >
            {c.symbol}
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroup variant="text" sx={{ mb: 2, ml: 2 }}>
        {periods.map((p) => (
          <Button
            key={p.key}
            onClick={() => setSelectedPeriod(p.key)}
            sx={{
              color: selectedPeriod === p.key ? "#fcd34d" : "#fff",
              fontWeight: selectedPeriod === p.key ? "bold" : "normal",
              textDecoration: selectedPeriod === p.key ? "underline" : "none",
            }}
          >
            {p.label}
          </Button>
        ))}
      </ButtonGroup>
      <Box flex={1} minHeight={300}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#333" strokeDasharray="6 6" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{ background: "#23272f", border: "none", color: "#fff" }}
              labelStyle={{ color: "#fcd34d" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={coin.color}
              strokeWidth={3}
              dot={{ r: 5, fill: coin.color, stroke: "#18181b", strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

