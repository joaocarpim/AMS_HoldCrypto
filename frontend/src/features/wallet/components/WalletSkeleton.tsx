'use client';
import { Grid, Skeleton, Box } from '@mui/material';

export const WalletSkeleton = () => {
  return (
    <Box sx={{ width: '100%', animate: 'pulse' }}>
      {/* Header e Botão */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton variant="text" width={180} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Skeleton variant="text" width={120} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
        </div>
        <Skeleton variant="rounded" width={160} height={45} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
      </div>

      {/* Card de Saldo Total (Hero) */}
      <Skeleton variant="rounded" height={140} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '24px', mb: 6 }} />

      {/* Grid de Carteiras */}
      <div className="mb-4">
         <Skeleton variant="text" width={200} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      </div>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Skeleton variant="rounded" height={180} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '16px' }} />
          </Grid>
        ))}
      </Grid>

      {/* Histórico */}
      <Skeleton variant="rounded" height={250} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '16px' }} />
    </Box>
  );
};