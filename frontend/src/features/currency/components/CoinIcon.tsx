import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import Image from 'next/image'; // <-- Importação do componente otimizado

interface CoinIconProps {
  symbol: string;
  name?: string;
  size?: number;
}

const CoinIcon = ({ symbol, name, size = 40 }: CoinIconProps) => {
  const [error, setError] = useState(false);
  const cleanSymbol = symbol ? symbol.toLowerCase().trim() : '';

  // URL da CDN
  const iconUrl = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a6353048692227c97a53c2515a850e6c651632d/128/color/${cleanSymbol}.png`;

  // Fallback específico para BRL
  if (cleanSymbol === 'brl') {
     return (
        <div style={{ width: size, height: size, position: 'relative', borderRadius: '50%', overflow: 'hidden' }}>
            <Image 
                src="https://flagcdn.com/w80/br.png" 
                alt="BRL" 
                width={size}
                height={size}
                style={{ objectFit: 'cover' }}
                unoptimized // Permite carregar de URL externa sem config
            />
        </div>
     );
  }

  // Fallback se a imagem não existir (mostra a inicial)
  if (error || !cleanSymbol) {
    return (
      <Avatar sx={{ width: size, height: size, bgcolor: '#F0B90B', color: '#000', fontWeight: 'bold', fontSize: size * 0.4 }}>
        {symbol ? symbol[0].toUpperCase() : '?'}
      </Avatar>
    );
  }

  return (
    <Image 
        src={iconUrl} 
        alt={name || symbol} 
        width={size} 
        height={size}
        className="rounded-full shadow-sm bg-white/5"
        onError={() => setError(true)}
        unoptimized // Permite carregar de URL externa sem config
    />
  );
};

export default CoinIcon;