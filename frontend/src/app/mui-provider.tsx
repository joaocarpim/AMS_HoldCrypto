// src/app/mui-provider.tsx
"use client";
import * as React from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import muiTheme from "../shared/theme/muiTheme";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#fcd34d" },
    background: { default: "#18181b", paper: "#23272f" },
  },
});

export default function MuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}