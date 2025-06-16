import React, { useState, useEffect } from "react";
import { Currency, Backing } from "../types/Currency";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import EuroIcon from "@mui/icons-material/Euro";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { yellowField } from "@/shared/theme/fieldStyles";

interface Props {
  initialValues?: Currency;
  onSubmit: (currency: Currency) => void;
  loading?: boolean;
  onCancel?: () => void;
}

const backings: Backing[] = ["BRL", "USD", "JPY", "EUR", "CNY", "ARS"];

const iconOptions = [
  { label: "Padrão", value: "MonetizationOn" },
  { label: "Bitcoin", value: "CurrencyBitcoin" },
  { label: "Dólar", value: "AttachMoney" },
  { label: "Euro", value: "Euro" },
  { label: "Iene", value: "CurrencyYen" },
  { label: "Exchange", value: "CurrencyExchange" },
];

const iconMap: Record<string, JSX.Element> = {
  MonetizationOn: <MonetizationOnIcon />,
  CurrencyBitcoin: <CurrencyBitcoinIcon />,
  AttachMoney: <AttachMoneyIcon />,
  Euro: <EuroIcon />,
  CurrencyYen: <CurrencyYenIcon />,
  CurrencyExchange: <CurrencyExchangeIcon />,
};

const CurrencyForm: React.FC<Props> = ({ initialValues, onSubmit, loading, onCancel }) => {
  const [form, setForm] = useState<Currency>({
    name: "",
    description: "",
    status: true,
    backing: "USD",
    icon: "MonetizationOn",
    ...(initialValues || {}),
  });

  useEffect(() => {
    if (initialValues) setForm({ ...form, ...initialValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({
      ...f,
      backing: e.target.value as Backing,
    }));
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({
      ...f,
      icon: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validação básica extra para garantir que o campo icon está sempre presente
    if (!form.icon) {
      alert("Selecione um ícone para a moeda.");
      return;
    }
    if (!form.name || !form.description) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <TextField
          name="name"
          label="Nome"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
          sx={yellowField}
        />
        <TextField
          name="description"
          label="Descrição"
          value={form.description}
          onChange={handleChange}
          required
          fullWidth
          sx={yellowField}
        />
        <TextField
          select
          name="backing"
          label="Backing"
          value={form.backing}
          onChange={handleSelectChange}
          required
          fullWidth
          sx={yellowField}
        >
          {backings.map((b) => (
            <MenuItem key={b} value={b}>{b}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          name="icon"
          label="Ícone"
          value={form.icon}
          onChange={handleIconChange}
          required
          fullWidth
          sx={yellowField}
        >
          {iconOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {iconMap[opt.value]}
                <span>{opt.label}</span>
              </Stack>
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={
            <Checkbox
              checked={!!form.status}
              onChange={handleChange}
              name="status"
              sx={{
                color: "#fcd34d",
                "&.Mui-checked": { color: "#fcd34d" },
              }}
            />
          }
          label="Ativo"
          sx={{ color: "#fff" }}
        />
        <Stack direction="row" spacing={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ minWidth: 120, fontWeight: "bold" }}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              onClick={onCancel}
              disabled={loading}
              sx={{
                minWidth: 120,
                fontWeight: "bold",
                borderColor: "#fcd34d",
                color: "#fcd34d"
              }}
            >
              Cancelar
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default CurrencyForm;