import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#fcd34d" },
    background: { default: "#18181b", paper: "#23272f" },
    text: { primary: "#fff" },
    divider: "#333",
    success: { main: "#22c55e" },
    error: { main: "#ef4444" },
    warning: { main: "#fbbf24" },
    info: { main: "#38bdf8" }
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
          borderRadius: 8,
        },
        containedPrimary: {
          backgroundColor: "#fcd34d",
          color: "#18181b",
          "&:hover": { backgroundColor: "#ffe066" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: "#23272f",
          color: "#fff",
          borderRadius: 8,
        },
        notchedOutline: {
          borderColor: "#fcd34d",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "#18181b",
          color: "#fff",
        },
      },
    },
  },
});

export default muiTheme;