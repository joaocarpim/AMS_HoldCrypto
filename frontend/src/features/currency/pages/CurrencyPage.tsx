"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Currency } from "@/features/currency/types/Currency";
import currencyService from "@/features/currency/services/currencyService"; 
import CurrencyForm from "@/features/currency/components/CurrencyForm";
import {
  Box,
  Button,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  Collapse,
  useMediaQuery,
  IconButton,
  Grid,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EuroIcon from "@mui/icons-material/Euro";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import HistoryIcon from "@mui/icons-material/History";
import { useTheme } from "@mui/material/styles";

const iconMap: Record<string, JSX.Element> = {
  MonetizationOn: <MonetizationOnIcon />,
  CurrencyBitcoin: <CurrencyBitcoinIcon />,
  AttachMoney: <AttachMoneyIcon />,
  Euro: <EuroIcon />,
  CurrencyYen: <CurrencyYenIcon />,
  CurrencyExchange: <CurrencyExchangeIcon />,
};

const CurrencyPage: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [editing, setEditing] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHistoryId, setShowHistoryId] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const fetchCurrencies = async () => {
    try {
        const data = await currencyService.getAll();
        setCurrencies(data);
    } catch (error: any) {
        console.error("Erro ao buscar moedas:", error);
        if (error.response?.status === 401) {
            router.push("/login");
        }
    }
  };

  useEffect(() => {
    fetchCurrencies();
    const interval = setInterval(fetchCurrencies, 5 * 60 * 1000); // 5 minutos
    return () => clearInterval(interval);
  }, []);

  const handleSave = async (currency: Currency) => {
    setLoading(true);
    try {
      if (currency.id) {
        await currencyService.update(currency.id, currency);
      } else {
        await currencyService.create(currency);
      }
      setEditing(null);
      fetchCurrencies();
    } catch (error) {
      console.error("Erro ao salvar moeda:", error);
      alert("Não foi possível salvar a moeda.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir esta moeda?")) {
      try {
        await currencyService.delete(id);
        fetchCurrencies();
      } catch (error) {
        console.error("Erro ao deletar moeda:", error);
        alert("Não foi possível deletar a moeda.");
      }
    }
  };

  return (
    // O Header, Footer e o Box principal foram removidos. O AppLayout cuidará disso.
    <Box sx={{ maxWidth: 1440, mx: "auto" }}>
      <Typography
        variant={isMobile ? "h4" : "h3"}
        fontWeight="bold"
        color="primary"
        textAlign="center"
        mb={4}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <MonetizationOnIcon sx={{ fontSize: 48, color: "#fcd34d", mb: "2px" }} />
        Moedas <span style={{ color: "#fff", marginLeft: 8 }}>• Seu portfólio digital</span>
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ fontWeight: "bold" }}
          onClick={() =>
            setEditing({
              name: "",
              symbol: "",
              description: "",
              status: true,
              backing: "USD",
              icon: "MonetizationOn",
            })
          }
        >
          Nova Moeda
        </Button>
      </Box>
      {editing && (
        <Box
          sx={{
            border: "2px solid #fcd34d",
            borderRadius: 2,
            background: "#18181b",
            mb: 3,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          <CurrencyForm
            initialValues={editing}
            onSubmit={handleSave}
            loading={loading}
            onCancel={() => setEditing(null)}
          />
        </Box>
      )}
      <TableContainer
        component={Paper}
        sx={{
          background: "#23272f",
          borderRadius: 3,
          boxShadow: 2,
          width: "100%",
          overflowX: { xs: "auto", md: "visible" },
          mt: 2,
        }}
      >
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#fcd34d", width: 60, minWidth: 60 }}>Ícone</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fcd34d", minWidth: 120 }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fcd34d", minWidth: 100 }}>Símbolo</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fcd34d", minWidth: 180 }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fcd34d", minWidth: 80 }}>Backing</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fcd34d", minWidth: 80 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fcd34d", minWidth: 220, maxWidth: 320, whiteSpace: "normal" }}>Histórico</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fcd34d", width: 200, minWidth: 160, textAlign: "center" }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currencies.map((c) => (
              <React.Fragment key={c.id}>
                <TableRow sx={{ "&:hover": { background: "#23272f" } }}>
                  <TableCell sx={{ width: 60, minWidth: 60, verticalAlign: "middle" }}>
                    {c.icon && iconMap[c.icon] ? iconMap[c.icon] : iconMap["MonetizationOn"]}
                  </TableCell>
                  <TableCell sx={{ minWidth: 120, verticalAlign: "middle" }}>
                    <Typography fontWeight="bold" color="primary" sx={{ letterSpacing: 1 }}>
                      {c.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 100, verticalAlign: "middle" }}>{c.symbol}</TableCell>
                  <TableCell sx={{ minWidth: 180, verticalAlign: "middle" }}>{c.description}</TableCell>
                  <TableCell sx={{ minWidth: 80, verticalAlign: "middle" }}>
                    <Chip label={c.backing} size="small" sx={{ bgcolor: "#23272f", color: "#fcd34d", fontWeight: "bold" }} />
                  </TableCell>
                  <TableCell sx={{ minWidth: 80, verticalAlign: "middle" }}>
                    <Chip
                      label={c.status ? "Ativo" : "Inativo"}
                      size="small"
                      sx={{
                        bgcolor: c.status ? "#22c55e" : "#ef4444",
                        color: "#18181b",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 220, maxWidth: 320, whiteSpace: "normal", verticalAlign: "middle" }}>
                    {c.histories && c.histories.length > 0 ? (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" alignItems="center">
                        {c.histories
                          .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
                          .slice(0, 5)
                          .map((h) => (
                            <Tooltip
                              key={h.id}
                              title={new Date(h.datetime).toLocaleString()}
                              arrow
                              placement="top"
                            >
                              <Chip
                                sx={{
                                  bgcolor: "#18181b",
                                  color: "#fcd34d",
                                  fontWeight: "bold",
                                  px: 1,
                                  fontSize: "0.85em",
                                  border: "1px solid #fcd34d",
                                }}
                                label={`${Number(h.price).toFixed(2)}`}
                                size="small"
                              />
                            </Tooltip>
                          ))}
                        <IconButton
                          size="small"
                          sx={{
                            ml: 1,
                            color: "#fcd34d",
                            alignSelf: "center",
                            p: "4px",
                            borderRadius: 2,
                            "&:hover": {
                              bgcolor: "#fcd34d22",
                            },
                          }}
                          onClick={() =>
                            typeof c.id === "number"
                              ? setShowHistoryId(showHistoryId === c.id ? null : c.id)
                              : undefined
                          }
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="#aaa">
                        Sem histórico
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: 200,
                      minWidth: 160,
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <Grid container spacing={1} justifyContent="center" alignItems="center" wrap="nowrap">
                      <Grid item>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            borderColor: "#fcd34d",
                            color: "#fcd34d",
                            px: 2,
                            whiteSpace: "nowrap",
                            minWidth: 80,
                          }}
                          onClick={() => setEditing(c)}
                        >
                          Editar
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            px: 2,
                            whiteSpace: "nowrap",
                            minWidth: 80,
                          }}
                          onClick={() => handleDelete(c.id!)}
                        >
                          Excluir
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={8}
                    sx={{
                      border: 0,
                      background: "#1d1d21",
                      p: 0,
                      height: 0,
                    }}
                  >
                    <Collapse in={showHistoryId === c.id && !!c.histories?.length}>
                      <Box sx={{ py: 2, px: 3, color: "#fff" }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={1}>
                          Histórico completo
                        </Typography>
                        <Stack spacing={1}>
                          {c.histories
                            ?.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
                            .map((h) => (
                              <Box
                                key={h.id}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  bgcolor: "#23272f",
                                  borderRadius: 2,
                                  px: 2,
                                  py: 1,
                                  fontSize: "0.98em",
                                  boxShadow: 1,
                                }}
                              >
                                <Typography fontWeight="bold" color="primary">
                                  {new Date(h.datetime).toLocaleString()}
                                </Typography>
                                <Chip
                                  label={`R$ ${Number(h.price).toFixed(2)}`}
                                  size="small"
                                  sx={{
                                    bgcolor: "#18181b",
                                    color: "#fcd34d",
                                    fontWeight: "bold",
                                    border: "1px solid #fcd34d",
                                  }}
                                />
                              </Box>
                            ))}
                        </Stack>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CurrencyPage;

