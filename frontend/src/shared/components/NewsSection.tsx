'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';

// Mantendo seus dados de notícias originais
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
        py: { xs: 6, md: 10 },
        bgcolor: theme.palette.background.default, // Fundo principal escuro
      }}
      component="section"
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          fontWeight="bold" 
          sx={{ mb: 6 }}
        >
          Fique por Dentro das <span style={{ color: theme.palette.primary.main }}>Últimas Notícias</span>
        </Typography>
        <Grid container spacing={4}>
          {news.map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 4,
                  height: '100%',
                }}
              >
                <Typography variant="h6" component="h3" fontWeight="bold" color="primary.main" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default NewsSection;

