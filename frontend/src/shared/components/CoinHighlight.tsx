'use client';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

export interface CoinHighlightProps {
  name: string;
  symbol: string;
  price: number;
  change: number;
  selected?: boolean;
}

export default function CoinHighlight({
  name,
  symbol,
  price,
  change,
  selected = false,
}: CoinHighlightProps) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        bgcolor: selected ? theme.palette.primary.main : theme.palette.background.paper,
        color: selected ? theme.palette.background.paper : theme.palette.text.primary,
        transition: "all 0.2s",
        boxShadow: selected ? 8 : 1,
        border: selected ? `2px solid ${theme.palette.primary.main}` : "none",
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          {name} <span style={{ color: theme.palette.primary.main }}>{symbol}</span>
        </Typography>
        <Typography variant="h5" sx={{ my: 1 }}>
          R$ {price.toLocaleString("pt-BR")}
        </Typography>
        <Typography
          sx={{
            color: change >= 0 ? "#22c55e" : "#ef4444",
            fontWeight: "bold",
          }}
        >
          {change >= 0 ? "▲" : "▼"} {Math.abs(change)}%
        </Typography>
        {selected && (
          <Typography variant="caption" color="primary">
            Selecionado!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}