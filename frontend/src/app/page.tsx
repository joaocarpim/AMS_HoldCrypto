"use client";
import { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import CardActionArea from "@mui/material/CardActionArea";
import Grow from "@mui/material/Grow";
import Image from "next/image";
import ChartBox from "../shared/components/ChartBox";
import Carousel from "react-material-ui-carouseL"; 

// Componentes customizados
import Header from "../shared/components/Header";
import Footer from "../shared/components/Footer";
import CoinHighlight from "../shared/components/CoinHighlight";
import MainButton from "../shared/components/MainButton";
import NewsSection from "../shared/components/NewsSection";

// Estilos modulares
import { yellowBorderBox } from "@/shared/theme/boxStyles";
import { useRouter } from "next/navigation";

const destaqueMoedas = [
  { name: "Bitcoin", symbol: "BTC", price: 252500, change: 2.5 },
  { name: "Ethereum", symbol: "ETH", price: 13500, change: -1.2 },
  { name: "BNB", symbol: "BNB", price: 2100, change: 0.8 },
  { name: "Solana", symbol: "SOL", price: 900, change: 4.1 },
  { name: "Polygon", symbol: "MATIC", price: 6.1, change: 0.3 },
  { name: "Cardano", symbol: "ADA", price: 2.2, change: -2.4 },
  { name: "XRP", symbol: "XRP", price: 3.5, change: 1.9 },
  { name: "Dogecoin", symbol: "DOGE", price: 0.95, change: 7.8 },
];

export default function Home() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const router = useRouter();

  // Organize as moedas em "páginas" de 3 moedas cada (para slides)
  const coinsPerSlide = 3;
  const slides = [];
  for (let i = 0; i < destaqueMoedas.length; i += coinsPerSlide) {
    slides.push(destaqueMoedas.slice(i, i + coinsPerSlide));
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 8 }}>
        {/* Banner Central */}
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 3,
            p: 5,
            textAlign: "center",
            mb: 6,
          }}
        >
          <Typography variant="h2" color="primary" fontWeight="bold" gutterBottom>
            AMS HoldCrypto
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Sua plataforma para acompanhar, negociar e aprender sobre criptomoedas.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
            <MainButton variant="primary" onClick={() => router.push("/login")}>
              Acessar Minha Conta
            </MainButton>
            <MainButton variant="secondary" onClick={() => setShowInfo((v) => !v)}>
              Saiba Mais
            </MainButton>
            <MainButton
              variant="secondary"
              onClick={() => router.push("/currency")}
            >
              Ver Moedas
            </MainButton>
          </Stack>
          <Collapse in={showInfo} timeout={500}>
            <Grid container spacing={2} alignItems="center" mt={2} justifyContent="flex-start">
              <Grid item xs={12} md={7}>
                <Box textAlign="left" sx={yellowBorderBox}>
                  <Typography variant="h5" color="primary" gutterBottom>
                    Sobre o AMS HoldCrypto
                  </Typography>
                  <Typography>
                    O AMS HoldCrypto é uma plataforma inovadora para acompanhar, negociar e aprender sobre criptomoedas.
                    Oferecemos informações em tempo real, notícias do mercado, destaques de moedas e uma experiência segura para todos os usuários.
                  </Typography>
                  <Typography mt={2}>
                    Explore nossos recursos, veja as tendências do mercado e mantenha-se informado com as últimas novidades do universo cripto!
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box display="flex" justifyContent="center">
                  <Image
                    src="/img/crypto-banner.jpg"
                    alt="Criptomoedas"
                    width={400}
                    height={300}
                    style={{
                      maxWidth: "100%",
                      borderRadius: 16,
                      boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                      height: "auto",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Collapse>
        </Box>

        {/* Destaques de Moedas - Carrossel */}
        <Box mb={6}>
          <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
            Destaques do Mercado
          </Typography>
          <Carousel
            autoPlay={true}
            interval={5000}
            indicators={true}
            navButtonsAlwaysVisible={true}
            animation="slide"
            duration={600}
            sx={{
              width: "100%",
              ".MuiCarousel-root": { width: "100%" },
              ".MuiButtonBase-root": { color: "#fcd34d" }
            }}
          >
            {slides.map((coins, slideIdx) => (
              <Grid container spacing={3} justifyContent="center" key={slideIdx}>
                {coins.map((coin, idx) => (
                  <Grid item xs={12} sm={4} key={coin.symbol}>
                    <Grow in timeout={500 + idx * 200}>
                      <Box>
                        <CardActionArea onClick={() => setSelected(slideIdx * coinsPerSlide + idx)}>
                          <CoinHighlight
                            name={coin.name}
                            symbol={coin.symbol}
                            price={coin.price}
                            change={coin.change}
                            selected={selected === (slideIdx * coinsPerSlide + idx)}
                          />
                        </CardActionArea>
                      </Box>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Carousel>
        </Box>

        {/* Notícias Recentes e Gráfico */}
        <Grid container spacing={4} alignItems="stretch" mt={4}>
          <Grid item xs={12} md={6}>
            <Box sx={yellowBorderBox} height="100%">
              <NewsSection />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartBox />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}