'use client';
import { Grid, Skeleton, Box } from '@mui/material';

export const DashboardSkeleton = () => {
  return (
    <Box sx={{ width: '100%', animate: 'pulse' }}>
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Skeleton variant="text" width={150} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
        </div>
        <Skeleton variant="rounded" width={140} height={45} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
      </div>

      {/* Stats Cards Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Skeleton variant="rounded" height={100} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '16px' }} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Coluna Esquerda */}
        <Grid item xs={12} lg={8}>
          {/* Gráfico */}
          <Skeleton variant="rounded" height={350} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '24px', mb: 4 }} />
          
          {/* Wallets Grid */}
          <div className="flex justify-between mb-4">
             <Skeleton variant="text" width={150} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
          </div>
          <Grid container spacing={2} sx={{ mb: 4 }}>
             {[1, 2, 3].map((i) => (
                <Grid item xs={12} sm={4} key={i}>
                   <Skeleton variant="rounded" height={120} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '16px' }} />
                </Grid>
             ))}
          </Grid>

          {/* Tabela */}
          <Skeleton variant="rounded" height={200} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '16px' }} />
        </Grid>

        {/* Coluna Direita */}
        <Grid item xs={12} lg={4}>
          <Skeleton variant="rounded" height={400} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '24px', mb: 4 }} />
          <Skeleton variant="rounded" height={300} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '24px' }} />
        </Grid>
      </Grid>
    </Box>
  );
};