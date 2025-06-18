'use client';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

export default function Footer() {
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.primary.main,
        py: 3,
        textAlign: "center",
        mt: 8,
        borderTop: `1px solid ${theme.palette.divider || "#333"}`,
      }}
    >
      <Typography variant="body2" fontWeight="500">
        &copy; {new Date().getFullYear()} AMS Trade Holding. Todos os direitos reservados.
      </Typography>
    </Box>
  );
}