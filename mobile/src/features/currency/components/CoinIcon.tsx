// mobile/src/features/currency/components/CoinIcon.tsx

import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CoinIconProps {
  symbol: string;
  name?: string;
  size?: number;
}

const CoinIcon = ({ symbol, name, size = 40 }: CoinIconProps) => {
  const [error, setError] = useState(false);
  const cleanSymbol = symbol ? symbol.toUpperCase().trim() : ''; 
  const cdnSymbol = cleanSymbol.toLowerCase(); 

  // --- Ícones Vetoriais (Convertidos para React Native SVG) ---
  switch (cleanSymbol) {
    case 'BTC':
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <Circle cx="16" cy="16" r="16" fill="#F7931A"/>
          <Path d="M23.189 12.866C23.506 11.698 23.012 10.666 22.094 9.944L22.1 9.933C21.353 9.324 20.472 9.07 19.336 9.022V6.666H18.232V9.006C17.989 9.006 17.747 9.011 17.502 9.022V6.666H16.398V9.056C16.173 9.067 15.945 9.077 15.717 9.091V9.056H14.189L14.214 10.63C14.214 10.63 15.225 10.651 15.203 10.677C15.753 10.742 15.86 11.082 15.842 11.332V17.073C15.845 17.086 15.842 17.104 15.836 17.118C15.842 17.108 15.845 17.092 15.842 17.073V17.27C15.772 17.896 15.568 18.064 15.203 18.13V18.156C15.225 18.182 14.214 18.204 14.214 18.204L13.939 19.821H15.42C15.632 19.839 15.84 19.851 16.046 19.863V22.253H17.15V19.902C17.388 19.907 17.622 19.907 17.854 19.902V22.253H18.958V19.873C20.852 19.831 22.28 19.431 22.744 17.712C23.118 16.327 22.723 15.549 21.72 15.029C22.469 14.851 23.037 14.186 23.189 12.866ZM19.297 16.891C18.91 18.441 16.517 18.358 15.842 18.358V15.42C16.517 15.42 19.721 15.352 19.297 16.891ZM19.575 12.232C19.23 13.612 17.142 13.541 16.517 13.541V10.82C17.142 10.82 20.007 10.767 19.575 12.232Z" fill="white"/>
        </Svg>
      );

    case 'ETH':
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <Circle cx="16" cy="16" r="16" fill="#627EEA"/>
          <Path d="M16.498 4V12.87L23.995 16.22L16.498 4Z" fill="white" fillOpacity="0.602"/>
          <Path d="M16.498 4L9 16.22L16.498 12.87V4Z" fill="white"/>
          <Path d="M16.498 21.968V27.995L24 17.632L16.498 21.968Z" fill="white" fillOpacity="0.602"/>
          <Path d="M16.498 27.995V21.967L9 17.632L16.498 27.995Z" fill="white"/>
          <Path d="M16.498 20.555L23.995 16.221L16.498 12.871V20.555Z" fill="#C0CBF6"/>
          <Path d="M9 16.221L16.498 20.555V12.871L9 16.221Z" fill="#C0CBF6"/>
        </Svg>
      );

    case 'USDT':
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <Circle cx="16" cy="16" r="16" fill="#26A17B"/>
          <Path d="M17.66 18.735V26H14.33V18.735C11.35 18.592 9 17.962 9 17.221C9 16.48 11.35 15.851 14.33 15.708V12.787H9V10H23V12.787H17.66V15.708C20.64 15.851 22.99 16.48 22.99 17.221C22.99 17.962 20.64 18.592 17.66 18.735ZM16 18.23C18.665 18.23 20.9 17.747 20.9 17.221C20.9 16.695 18.665 16.212 16 16.212C13.335 16.212 11.1 16.695 11.1 17.221C11.1 17.747 13.335 18.23 16 18.23Z" fill="white"/>
        </Svg>
      );

    case 'SOL':
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <Circle cx="16" cy="16" r="16" fill="#000000"/>
          <Defs>
            <LinearGradient id="sol_grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#9945FF" />
              <Stop offset="100%" stopColor="#14F195" />
            </LinearGradient>
          </Defs>
          <Path d="M9.5 22.5L20.8 19.2C21.1 19.1 21.3 19.2 21.4 19.4L22.5 21.2C22.6 21.4 22.5 21.7 22.3 21.8L11.2 25.8C10.9 25.9 10.7 25.8 10.6 25.6L9.5 23.8C9.4 23.6 9.5 23.3 9.7 23.2L9.5 22.5ZM22.5 9.5L11.2 12.8C10.9 12.9 10.7 12.8 10.6 12.6L9.5 10.8C9.4 10.6 9.5 10.3 9.7 10.2L20.8 6.2C21.1 6.1 21.3 6.2 21.4 6.4L22.5 8.2C22.6 8.4 22.5 8.7 22.3 8.8L22.5 9.5ZM9.5 16L20.8 12.7C21.1 12.6 21.3 12.7 21.4 12.9L22.5 14.7C22.6 14.9 22.5 15.2 22.3 15.3L11.2 19.3C10.9 19.4 10.7 19.3 10.6 19.1L9.5 17.3C9.4 17.1 9.5 16.8 9.7 16.7L9.5 16Z" fill="url(#sol_grad)"/>
        </Svg>
      );

    case 'BRL':
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <Circle cx="16" cy="16" r="16" fill="#009C3B"/>
          <Circle cx="16" cy="16" r="12" fill="#FFDF00"/>
          <Circle cx="16" cy="16" r="8" fill="#002776"/>
          <Path d="M13.5 11H15.5C17.5 11 18.5 12 18.5 13.5C18.5 15 17.5 16 15.5 16H14.5V19H13.5V16H12.5V11ZM13.5 12V15H15.5C16.5 15 17.5 14.5 17.5 13.5C17.5 12.5 16.5 12 15.5 12H13.5Z" fill="white"/>
          <Path d="M19.5 19L17.5 16" stroke="white" strokeWidth="1.5"/>
          <Path d="M14.5 9V23" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
        </Svg>
      );

    case 'ADA': 
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
           <Circle cx="16" cy="16" r="16" fill="#0033AD"/>
           <Circle cx="16" cy="16" r="10" fill="white" fillOpacity="0.2"/>
           <Circle cx="16" cy="16" r="3" fill="white"/>
           <Circle cx="16" cy="8" r="1.5" fill="white"/>
           <Circle cx="24" cy="16" r="1.5" fill="white"/>
           <Circle cx="16" cy="24" r="1.5" fill="white"/>
           <Circle cx="8" cy="16" r="1.5" fill="white"/>
        </Svg>
      );
  }

  // 2. Fallback para CDN
  const iconUrl = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a6353048692227c97a53c2515a850e6c651632d/128/color/${cdnSymbol}.png`;

  if (error || !cleanSymbol) {
    return (
      <View style={{ width: size, height: size, backgroundColor: '#F0B90B', borderRadius: size / 2, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: size * 0.4, color: 'black' }}>
            {cleanSymbol ? cleanSymbol[0] : '?'}
        </Text>
      </View>
    );
  }

  return (
    <Image 
        source={{ uri: iconUrl }} 
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: 'rgba(255,255,255,0.05)' }}
        onError={() => setError(true)}
    />
  );
};

export default CoinIcon;