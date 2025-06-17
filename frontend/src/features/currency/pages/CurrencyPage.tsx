import React, { useState, useEffect } from "react";
import { Currency } from "../types/Currency";
import { getAllCurrencies, createCurrency, updateCurrency, deleteCurrency } from "../services/currencyService";
import CurrencyForm from "../components/CurrencyForm";
import { Box, Button, Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EuroIcon from "@mui/icons-material/Euro";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import Footer from "@/shared/components/Footer";
import Header from "@/shared/components/Header";

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

  const fetchCurrencies = async () => {
    const data = await getAllCurrencies();
    setCurrencies(data);
  };

  useEffect(() => {
    fetchCurrencies();
    // Atualiza a cada 5 minutos
    const interval = setInterval(fetchCurrencies, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = async (currency: Currency) => {
    setLoading(true);
    if (currency.id) {
      await updateCurrency(currency.id, currency);
    } else {
      await createCurrency(currency);
    }
    setEditing(null);
    setLoading(false);
    fetchCurrencies();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir esta moeda?")) {
      await deleteCurrency(id);
      fetchCurrencies();
    }
  };

  return (
    <>
      <Header />
      <Box maxWidth="md" mx="auto" py={6}>
        <Typography
          variant="h3"
          fontWeight="bold"
          color="primary"
          textAlign="center"
          mb={4}
          sx={{
            letterSpacing: 2,
            textShadow: "0 2px 16px #fcd34d44, 0 1px 0 #18181b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <MonetizationOnIcon sx={{ fontSize: 48, color: "#fcd34d", mb: "2px" }} />
          Moedas <span style={{ color: "#fff", marginLeft: 8 }}>• Seu portfólio digital</span>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 3, fontWeight: "bold" }}
          onClick={() => setEditing({ name: "", symbol: "", description: "", status: true, backing: "USD", icon: "MonetizationOn" })}
        >
          Nova Moeda
        </Button>
        {editing && (
          <Box sx={{ border: "2px solid #fcd34d", borderRadius: 2, background: "#18181b" }} mb={3}>
            <CurrencyForm
              initialValues={editing}
              onSubmit={handleSave}
              loading={loading}
              onCancel={() => setEditing(null)}
            />
          </Box>
        )}
        <TableContainer component={Paper} sx={{ background: "#18181b", borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Ícone</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Símbolo</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Descrição</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Backing</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Histórico (últimas 5 cotações)</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fcd34d" }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currencies.map((c) => (
                <React.Fragment key={c.id}>
                  <TableRow>
                    <TableCell>
                      {c.icon && iconMap[c.icon] ? iconMap[c.icon] : iconMap["MonetizationOn"]}
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="primary" sx={{ letterSpacing: 1 }}>
                        {c.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{c.symbol}</TableCell>
                    <TableCell>{c.description}</TableCell>
                    <TableCell>{c.backing}</TableCell>
                    <TableCell>{c.status ? "Ativo" : "Inativo"}</TableCell>
                    <TableCell>
                      {c.histories && c.histories.length > 0 ? (
                        <ul style={{ paddingLeft: 16, margin: 0 }}>
                          {c.histories
                            .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
                            .slice(0, 5)
                            .map((h) => (
                              <li key={h.id} style={{ color: "#fcd34d", fontWeight: "bold" }}>
                                {new Date(h.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {h.price}
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <span style={{ color: "#888" }}>Sem histórico</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{ fontWeight: "bold", borderColor: "#fcd34d", color: "#fcd34d" }}
                          onClick={() =>
                            setEditing({
                              id: c.id,
                              name: c.name,
                              symbol: c.symbol,
                              description: c.description,
                              status: c.status,
                              backing: c.backing,
                              icon: c.icon,
                              histories: c.histories
                            })
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ fontWeight: "bold" }}
                          onClick={() => handleDelete(c.id!)}
                        >
                          Excluir
                        </Button>
                        {c.histories && c.histories.length > 0 && (
                          <Button
                            variant="outlined"
                            color="inherit"
                            size="small"
                            sx={{ fontWeight: "bold", borderColor: "#fcd34d", color: "#fcd34d" }}
                            onClick={() => {
                              if (typeof c.id === "number") {
                                setShowHistoryId(showHistoryId === c.id ? null : c.id);
                              }
                            }}
                          >
                            {showHistoryId === c.id ? "Ocultar Histórico" : "Ver Histórico"}
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                  {showHistoryId === c.id && c.histories && c.histories.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ bgcolor: "#18181b", color: "#fff" }}>
                        <strong>Histórico completo:</strong>
                        <ul style={{ marginLeft: 24 }}>
                          {c.histories
                            .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
                            .map((h) => (
                              <li key={h.id}>
                                {new Date(h.datetime).toLocaleString()} - {h.price}
                              </li>
                            ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Footer />
    </>
  );
};

export default CurrencyPage;