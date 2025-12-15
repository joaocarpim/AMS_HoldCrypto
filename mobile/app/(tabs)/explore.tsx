// mobile/app/(tabs)/explore.tsx

import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, TextInput, FlatList, 
  TouchableOpacity, RefreshControl, ActivityIndicator, ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, TrendingUp, TrendingDown, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router'; // Importar useRouter
import { useMarketsStore } from '../../src/features/currency/store/useMarketsStore';
import CoinIcon from '../../src/features/currency/components/CoinIcon';
import { CoinDetailModal } from '../../src/features/currency/components/CoinDetailModal';
import { Currency } from '../../src/features/currency/services/currencyService';

const HighlightCard = ({ title, coin, icon: Icon, type }: any) => {
    if (!coin) return null;
    const isGainer = type === 'gainer';
    const bgColor = isGainer ? 'rgba(16, 185, 129, 0.1)' : 'rgba(249, 115, 22, 0.1)';
    const borderColor = isGainer ? 'rgba(16, 185, 129, 0.2)' : 'rgba(249, 115, 22, 0.2)';
    const textColor = isGainer ? '#34d399' : '#fb923c';

    return (
        <View style={[styles.highlightCard, { backgroundColor: bgColor, borderColor: borderColor }]}>
            <View style={styles.hlHeader}>
                <View style={[styles.hlIcon, { borderColor: borderColor }]}>
                    <Icon size={14} color={textColor} />
                </View>
                <Text style={styles.hlTitle}>{title}</Text>
            </View>
            <View style={styles.hlContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <CoinIcon symbol={coin.symbol} size={24} />
                    <Text style={styles.hlSymbol}>{coin.symbol}</Text>
                </View>
                <Text style={[styles.hlChange, { color: coin.isPositive ? '#34d399' : '#f43f5e' }]}>
                    {coin.isPositive ? '+' : ''}{coin.change.toFixed(2)}%
                </Text>
            </View>
            <Text style={styles.hlPrice}>
                R$ {coin.latestPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
        </View>
    );
};

export default function ExploreScreen() {
  const router = useRouter(); // Hook de navegação
  const { currencies, loading, fetchCurrencies } = useMarketsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'gainers' | 'losers'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Currency | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => { fetchCurrencies(); }, [fetchCurrencies]);
  const onRefresh = async () => { setRefreshing(true); await fetchCurrencies(); setRefreshing(false); };

  const processedData = useMemo(() => {
    const data = currencies.map(coin => {
        const history = coin.histories ? [...coin.histories].sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()) : [];
        const latestPrice = history.length > 0 ? history[history.length - 1].price : 0;
        const startPrice = history.length > 0 ? history[0].price : 0;
        const change = startPrice === 0 ? 0 : ((latestPrice - startPrice) / startPrice) * 100;
        return { ...coin, latestPrice, change, isPositive: change >= 0 };
    });
    return data.sort((a, b) => b.latestPrice - a.latestPrice); 
  }, [currencies]);

  const filteredList = useMemo(() => {
      let list = processedData.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.symbol.toLowerCase().includes(searchTerm.toLowerCase()));
      if (activeFilter === 'gainers') list = list.filter(c => c.isPositive);
      if (activeFilter === 'losers') list = list.filter(c => !c.isPositive);
      return list;
  }, [processedData, searchTerm, activeFilter]);

  const highlights = useMemo(() => {
      if (processedData.length === 0) return { gainer: null, hot: null };
      const sortedByChange = [...processedData].sort((a, b) => b.change - a.change);
      return { gainer: sortedByChange[0], hot: sortedByChange[1] || sortedByChange[0] };
  }, [processedData]);

  const handleCoinPress = (coin: any) => { setSelectedCoin(coin); setModalVisible(true); };

  // Função para lidar com a ação de comprar/vender
  const handleAction = (action: 'buy' | 'sell', coin: Currency) => {
      setModalVisible(false); // Fecha o modal
      // Navega para a tela de Carteira
      // Como estamos usando tabs, a rota é /wallet dentro do grupo (tabs) ou similar
      // Se a estrutura for: app/(tabs)/wallet.tsx, a rota é "/(tabs)/wallet" ou simplesmente "/wallet" dependendo da config.
      // Tentaremos navegar para a tab 'wallet'.
      router.push('/(tabs)/wallet'); 
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.coinRow} onPress={() => handleCoinPress(item)}>
        <View style={styles.coinLeft}>
            <CoinIcon symbol={item.symbol} size={40} />
            <View style={{ marginLeft: 12 }}>
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowSymbol}>{item.symbol}</Text>
            </View>
        </View>
        <View style={styles.coinRight}>
            <Text style={styles.rowPrice}>
                R$ {item.latestPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
            </Text>
            <View style={[styles.badge, { backgroundColor: item.isPositive ? 'rgba(52, 211, 153, 0.1)' : 'rgba(244, 63, 94, 0.1)' }]}>
                {item.isPositive ? <TrendingUp size={12} color="#34d399" /> : <TrendingDown size={12} color="#f43f5e" />}
                <Text style={[styles.badgeText, { color: item.isPositive ? '#34d399' : '#f43f5e' }]}>
                    {Math.abs(item.change).toFixed(2)}%
                </Text>
            </View>
        </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mercados</Text>
        <View style={styles.searchContainer}>
            <Search size={20} color="#64748b" />
            <TextInput style={styles.searchInput} placeholder="Buscar ativo..." placeholderTextColor="#64748b" value={searchTerm} onChangeText={setSearchTerm} />
        </View>
        <View style={styles.filterContainer}>
            <TouchableOpacity style={[styles.filterBtn, activeFilter === 'all' && styles.filterBtnActive]} onPress={() => setActiveFilter('all')}>
                <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterBtn, activeFilter === 'gainers' && styles.filterBtnActive]} onPress={() => setActiveFilter('gainers')}>
                <Text style={[styles.filterText, activeFilter === 'gainers' && styles.filterTextActive]}>Em Alta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterBtn, activeFilter === 'losers' && styles.filterBtnActive]} onPress={() => setActiveFilter('losers')}>
                <Text style={[styles.filterText, activeFilter === 'losers' && styles.filterTextActive]}>Em Baixa</Text>
            </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F0B90B" />}
        ListHeaderComponent={
            (!searchTerm && activeFilter === 'all' && processedData.length > 0) ? (
                <View style={styles.highlightsContainer}>
                    <Text style={styles.sectionTitle}>Destaques 24h 🔥</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 24 }}>
                        <HighlightCard title="Top Gainer" coin={highlights.gainer} icon={TrendingUp} type="gainer" />
                        <HighlightCard title="Trending" coin={highlights.hot} icon={Zap} type="hot" />
                    </ScrollView>
                </View>
            ) : null
        }
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>Nenhum ativo encontrado.</Text> : <ActivityIndicator color="#F0B90B" style={{ marginTop: 20 }} />}
      />
      <CoinDetailModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        coin={selectedCoin} 
        onAction={handleAction} // Passando a função de ação
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { padding: 24, paddingBottom: 10, backgroundColor: '#020617', zIndex: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: 16, paddingHorizontal: 16, height: 52, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  searchInput: { flex: 1, marginLeft: 12, color: 'white', fontSize: 16 },
  filterContainer: { flexDirection: 'row', gap: 10 },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)' },
  filterBtnActive: { backgroundColor: 'rgba(255,255,255,0.1)' },
  filterText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  filterTextActive: { color: 'white' },
  listContent: { paddingBottom: 100 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#94a3b8', marginLeft: 24, marginBottom: 12, marginTop: 10, textTransform: 'uppercase' },
  coinRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  coinLeft: { flexDirection: 'row', alignItems: 'center' },
  rowName: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  rowSymbol: { color: '#64748b', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  coinRight: { alignItems: 'flex-end' },
  rowPrice: { color: 'white', fontWeight: 'bold', fontSize: 16, fontFamily: 'monospace' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 6, gap: 4 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  highlightsContainer: { marginBottom: 24 },
  highlightCard: { width: 180, padding: 16, borderRadius: 20, borderWidth: 1, marginRight: 0 },
  hlHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  hlIcon: { padding: 6, borderRadius: 8, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  hlTitle: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  hlContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  hlSymbol: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  hlChange: { fontSize: 12, fontWeight: 'bold' },
  hlPrice: { color: 'white', fontSize: 14, fontFamily: 'monospace', opacity: 0.9, fontWeight: 'bold' },
  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 40 },
});