// mobile/src/features/currency/components/CoinDetailModal.tsx

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { X, TrendingUp, TrendingDown, Activity, BarChart2, DollarSign, Info } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import CoinIcon from './CoinIcon';
import { Currency } from '../services/currencyService';

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 150;

const COIN_DETAILS: Record<string, { desc: string, vol: string, cap: string }> = {
    'BTC': { desc: "O Bitcoin é a primeira criptomoeda descentralizada do mundo. Funciona como reserva de valor e sistema de pagamento peer-to-peer.", vol: "R$ 150.5B", cap: "R$ 6.2T" },
    'ETH': { desc: "Ethereum é uma plataforma descentralizada capaz de executar contratos inteligentes e dApps, sendo a base para NFTs e DeFi.", vol: "R$ 80.2B", cap: "R$ 2.8T" },
    'SOL': { desc: "Solana é uma blockchain de alta performance projetada para hospedar aplicativos descentralizados, focada em velocidade e baixas taxas.", vol: "R$ 12.4B", cap: "R$ 450B" },
    'USDT': { desc: "Tether (USDT) é uma stablecoin indexada ao dólar americano. Oferece a estabilidade da moeda fiduciária com a tecnologia blockchain.", vol: "R$ 220.1B", cap: "R$ 520B" },
    'ADA': { desc: "Cardano é uma plataforma blockchain de prova de participação (PoS) fundada em filosofia científica e pesquisa revisada por pares.", vol: "R$ 4.5B", cap: "R$ 98B" },
};

const DEFAULT_DETAIL = { desc: "Ativo digital negociado globalmente. Alta volatilidade pode apresentar riscos e oportunidades.", vol: "---", cap: "---" };

interface Props {
    visible: boolean;
    onClose: () => void;
    coin: Currency | null;
    onAction: (action: 'buy' | 'sell', coin: Currency) => void; // NOVO: Callback de ação
}

export const CoinDetailModal = ({ visible, onClose, coin, onAction }: Props) => {
    
    const { currentPrice, change, isPositive, chartPath } = useMemo(() => {
        if (!coin) return { currentPrice: 0, change: 0, isPositive: true, chartPath: "" };

        const h = coin.histories ? [...coin.histories].sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()) : [];
        const latest = h.length > 0 ? h[h.length - 1].price : 0;
        const start = h.length > 0 ? h[0].price : 0;
        const chg = start === 0 ? 0 : ((latest - start) / start) * 100;

        let path = "";
        if (h.length > 1) {
            const maxPrice = Math.max(...h.map((i: any) => i.price));
            const minPrice = Math.min(...h.map((i: any) => i.price));
            const range = maxPrice - minPrice || 1;
            
            const points = h.map((item: any, index: number) => {
                const x = (index / (h.length - 1)) * width; 
                const y = CHART_HEIGHT - ((item.price - minPrice) / range) * CHART_HEIGHT; 
                return `${x},${y}`;
            });

            path = `M0,${CHART_HEIGHT} L${points.join(' L')} L${width},${CHART_HEIGHT} Z`;
        }

        return { currentPrice: latest, change: chg, isPositive: chg >= 0, chartPath: path };
    }, [coin]);

    if (!coin) return null;

    const details = COIN_DETAILS[coin.symbol.toUpperCase()] || DEFAULT_DETAIL;
    const color = isPositive ? '#34d399' : '#f43f5e';

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <CoinIcon symbol={coin.symbol} size={48} />
                        <View style={{marginLeft: 12}}>
                            <Text style={styles.title}>{coin.name}</Text>
                            <Text style={styles.subtitle}>{coin.symbol}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <X size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    
                    <View style={styles.priceContainer}>
                        <Text style={styles.bigPrice}>
                            R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                        </Text>
                        <View style={[styles.badge, { backgroundColor: isPositive ? 'rgba(52, 211, 153, 0.15)' : 'rgba(244, 63, 94, 0.15)' }]}>
                            {isPositive ? <TrendingUp size={16} color={color} /> : <TrendingDown size={16} color={color} />}
                            <Text style={[styles.badgeText, { color }]}>{Math.abs(change).toFixed(2)}% (24h)</Text>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        {chartPath ? (
                            <Svg height={CHART_HEIGHT} width={width}>
                                <Defs>
                                    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0" stopColor={color} stopOpacity="0.4" />
                                        <Stop offset="1" stopColor={color} stopOpacity="0" />
                                    </LinearGradient>
                                </Defs>
                                <Path d={chartPath} fill="url(#grad)" stroke={color} strokeWidth={2} />
                            </Svg>
                        ) : (
                            <View style={styles.noChart}>
                                <Activity size={32} color="#64748b" />
                                <Text style={styles.noChartText}>Gráfico indisponível</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <BarChart2 size={18} color="#9ca3af" />
                            <Text style={styles.statLabel}>Volume (24h)</Text>
                            <Text style={styles.statValue}>{details.vol}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Activity size={18} color="#9ca3af" />
                            <Text style={styles.statLabel}>Market Cap</Text>
                            <Text style={styles.statValue}>{details.cap}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <DollarSign size={18} color="#9ca3af" />
                            <Text style={styles.statLabel}>Máxima (24h)</Text>
                            <Text style={styles.statValue}>R$ {(currentPrice * 1.05).toFixed(2)}</Text>
                        </View>
                    </View>

                    <View style={styles.aboutCard}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8}}>
                            <Info size={16} color="#F0B90B" />
                            <Text style={styles.aboutTitle}>Sobre o Ativo</Text>
                        </View>
                        <Text style={styles.aboutText}>{details.desc}</Text>
                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: '#22c55e' }]} 
                        onPress={() => onAction('buy', coin)}
                    >
                        <Text style={styles.actionText}>Comprar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: '#ef4444' }]} 
                        onPress={() => onAction('sell', coin)}
                    >
                        <Text style={styles.actionText}>Vender</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
    subtitle: { fontSize: 16, color: '#9ca3af', fontWeight: 'bold' },
    closeBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 },
    content: { paddingBottom: 100 },
    priceContainer: { paddingHorizontal: 20, marginBottom: 20 },
    bigPrice: { fontSize: 36, fontWeight: 'bold', color: 'white', fontFamily: 'monospace' },
    badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 8, gap: 6 },
    badgeText: { fontWeight: 'bold', fontSize: 14 },
    chartContainer: { height: CHART_HEIGHT, width: '100%', marginBottom: 30 },
    noChart: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    noChartText: { color: '#64748b', marginTop: 8 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 30 },
    statItem: { flex: 1, alignItems: 'center', backgroundColor: '#0f172a', padding: 16, borderRadius: 16, marginHorizontal: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    statLabel: { color: '#9ca3af', fontSize: 10, textTransform: 'uppercase', marginTop: 8, marginBottom: 4 },
    statValue: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    aboutCard: { marginHorizontal: 20, backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    aboutTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    aboutText: { color: '#9ca3af', lineHeight: 22, fontSize: 14, textAlign: 'justify' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, paddingBottom: 40, backgroundColor: '#020617', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', gap: 16 },
    actionBtn: { flex: 1, paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    actionText: { color: 'white', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' }
});