'use client';
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const news = [
  {
    title: "Bitcoin atinge novo topo em 2025!",
    desc: "O mercado segue aquecido com alta demanda institucional."
  },
  {
    title: "Ethereum lança atualização Shanghai",
    desc: "Prometendo taxas menores e mais escalabilidade."
  },
  {
    title: "BNB Chain cresce em volume",
    desc: "Novos projetos DeFi impulsionam a rede."
  }
];

const NewsSection: React.FC = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 3,
        p: { xs: 2, sm: 4 },
        my: 4,
        width: "100%",
        maxWidth: 950,
        mx: "auto",
      }}
      component="section"
    >
      <Typography variant="h6" color="primary" fontWeight="bold" mb={2}>
        Notícias Recentes
      </Typography>
      <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
        {news.map((item, i) => (
          <Box
            key={i}
            component="li"
            sx={{
              color: theme.palette.text.primary,
              mb: 2,
              background: theme.palette.background.default,
              borderRadius: 1.5,
              p: 2,
              boxShadow: 1,
              "& strong": { color: theme.palette.primary.main }
            }}
          >
            <strong>{item.title}</strong> — {item.desc}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default NewsSection;