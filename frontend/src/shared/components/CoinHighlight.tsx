'use client';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export interface CoinHighlightProps {
  name: string;
  symbol: string;
  price: number;
  change: number;
  selected?: boolean; // <-- adicione esta linha
}

export default function CoinHighlight({
  name,
  symbol,
  price,
  change,
  selected = false,
}: CoinHighlightProps) {
  return (
    <Card
      sx={{
        bgcolor: selected ? "#fcd34d" : "#23272f",
        color: selected ? "#23272f" : "#fff",
        transition: "all 0.2s",
        boxShadow: selected ? 8 : 2,
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          {name} <span style={{ color: "#fcd34d" }}>{symbol}</span>
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