"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.default",
        color: "primary.main",
        py: 3,
        textAlign: "center",
        mt: 8,
        borderTop: "1px solid #333",
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} AMS Trade Holding. Todos os direitos reservados.
      </Typography>
    </Box>
  );
}