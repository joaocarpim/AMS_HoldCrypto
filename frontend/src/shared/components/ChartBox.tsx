'use client';
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

// Dados simulados para diferentes períodos
const coins = [
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
  {
    name: "Ethereum",
    symbol: "ETH",
    color: "#a3e635",
    data: {
      dias: [
        { name: "Seg", value: 13000 },
        { name: "Ter", value: 13200 },
        { name: "Qua", value: 13100 },
        { name: "Qui", value: 13400 },
        { name: "Sex", value: 13500 },
      ],
      meses: [
        { name: "Jan", value: 11000 },
        { name: "Fev", value: 11500 },
        { name: "Mar", value: 12000 },
        { name: "Abr", value: 12800 },
        { name: "Mai", value: 13500 },
      ],
      anos: [
        { name: "2020", value: 2000 },
        { name: "2021", value: 4000 },
        { name: "2022", value: 8000 },
        { name: "2023", value: 11000 },
        { name: "2024", value: 13500 },
      ],
    },
  },
  {
    name: "BNB",
    symbol: "BNB",
    color: "#38bdf8",
    data: {
      dias: [
        { name: "Seg", value: 2000 },
        { name: "Ter", value: 2050 },
        { name: "Qua", value: 2100 },
        { name: "Qui", value: 2080 },
        { name: "Sex", value: 2100 },
      ],
      meses: [
        { name: "Jan", value: 1800 },
        { name: "Fev", value: 1900 },
        { name: "Mar", value: 1950 },
        { name: "Abr", value: 2000 },
        { name: "Mai", value: 2100 },
      ],
      anos: [
        { name: "2020", value: 300 },
        { name: "2021", value: 600 },
        { name: "2022", value: 1200 },
        { name: "2023", value: 1800 },
        { name: "2024", value: 2100 },
      ],
    },
  },
];

const periods = [
  { label: "Dias", key: "dias" },
  { label: "Meses", key: "meses" },
  { label: "Anos", key: "anos" },
];

export default function ChartBox() {
  const [selectedCoin, setSelectedCoin] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<"dias" | "meses" | "anos">("anos");

  const coin = coins[selectedCoin];
  const data = coin.data[selectedPeriod];

  return (
    <Box
      sx={{
        borderRadius: "32px",
        border: "3px solid #fcd34d",
        background: "#18181b",
        color: "#fff",
        p: 3,
        boxShadow: 2,
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
        {coins.map((c, idx) => (
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
            onClick={() => setSelectedPeriod(p.key as "dias" | "meses" | "anos")}
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