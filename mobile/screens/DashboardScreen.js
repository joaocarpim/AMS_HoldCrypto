import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
// AQUI ESTÁ A CORREÇÃO: removido o hífen extra
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { API_BASE_URL } from '../apiConfig';
import { useNavigation, useIsFocused } from '@react-navigation/native';

// --- Componentes Visuais Melhorados ---

// Função para gerar cores consistentes para os ícones
const getSymbolColor = (symbol) => {
  const colors = ['#F0B90B', '#627EEA', '#26A17B', '#F3BA2F', '#8A2BE2', '#4F4F4F', '#f0f0f0'];
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const CoinIcon = ({ symbol }) => (
  <View style={[styles.coinIcon, { backgroundColor: getSymbolColor(symbol) }]}>
    <Text style={styles.coinIconText}>{symbol.charAt(0)}</Text>
  </View>
);

// --- Componente do Cabeçalho ---
const CustomHeader = ({ title, onEditProfile }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <Text style={styles.menuButtonText}>☰</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {onEditProfile && (
        <TouchableOpacity onPress={onEditProfile} style={styles.headerActionButton}>
          <Text style={styles.editButtonText}>⚙️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// --- Tela de Perfil ---
const ProfileScreen = ({ userProfile, onLogout, onEditProfile }) => (
  <SafeAreaView style={styles.pageContainer}>
    <CustomHeader title="Perfil do Usuário" onEditProfile={onEditProfile} />
    <View style={styles.contentContainer}>
      {userProfile ? (
        <View style={styles.profileCard}>
          <Text style={styles.title}>Bem-vindo, {userProfile.user}!</Text>
          <Text style={styles.emailText}>{userProfile.email}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Sair" onPress={onLogout} color="#F0B90B" />
          </View>
        </View>
      ) : (
        <Text style={styles.emptyListText}>Não foi possível carregar o perfil.</Text>
      )}
    </View>
  </SafeAreaView>
);

// --- Tela do Portfólio (AGORA COM UI MELHORADA) ---
const PortfolioScreen = ({ currencies, onDeleteCurrency }) => {
  const CurrencyCard = ({ item }) => {
    // Ordena o histórico do mais recente para o mais antigo
    const sortedHistories = item.histories && item.histories.length > 0
      ? [...item.histories].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
      : [];
      
    const latestHistory = sortedHistories[0] || { price: 0 };
    const currentPrice = latestHistory.price;

    // LÓGICA PARA CÁLCULO REAL DA VARIAÇÃO DIÁRIA
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    // Encontra o registro de preço mais próximo de 24h atrás
    const previousHistory = sortedHistories.find(h => new Date(h.datetime) <= oneDayAgo);
    const previousPrice = previousHistory ? previousHistory.price : null;

    let dailyChange = 0;
    if (previousPrice && previousPrice > 0 && currentPrice > 0) {
      dailyChange = ((currentPrice - previousPrice) / previousPrice) * 100;
    }

    // Simulação de dados para a carteira (holdings)
    const userHoldings = (Math.random() * 5).toFixed(4); // Quantidade de moedas que o usuário "tem"

    return (
      <View style={styles.currencyCard}>
        <CoinIcon symbol={item.symbol} />
        <View style={styles.currencyInfo}>
          <Text style={styles.currencyName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
          <Text style={styles.currencySymbol}>{userHoldings} {item.symbol}</Text>
        </View>
        <View style={styles.currencyValue}>
          <Text style={styles.currencyPrice} numberOfLines={1} ellipsizeMode='tail'>{currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
          <Text style={dailyChange >= 0 ? styles.priceChangePositive : styles.priceChangeNegative}>
            {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)}%
          </Text>
        </View>
         <TouchableOpacity onPress={() => onDeleteCurrency(item.id)} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <CustomHeader title="Moedas" />
      <FlatList
        data={currencies}
        renderItem={({ item }) => <CurrencyCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={<Text style={styles.portfolioTitle}>Ativos Principais</Text>}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>Nenhuma moeda encontrada.</Text>
        }
      />
    </SafeAreaView>
  );
};

// --- Componente Principal (Dashboard) ---
const Drawer = createDrawerNavigator();

export default function DashboardScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  const loadDashboardData = async () => {
    if(!isFocused) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) { handleLogout(); return; }

      const [profileResponse, usersResponse, currencyResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/auth/profile`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/user`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/currency`)
      ]);

      if (!profileResponse.ok) throw new Error('Sessão inválida.');
      const profileData = await profileResponse.json();
      
      let fullProfile = { user: profileData.user, email: profileData.email };
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        const currentUser = users.find(u => u.email === profileData.email);
        if (currentUser) fullProfile = { ...currentUser, user: currentUser.name };
      }
      setUserProfile(fullProfile);
      
      if (currencyResponse.ok) setCurrencies(await currencyResponse.json());
      else throw new Error('Não foi possível carregar as moedas.');

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCurrency = async (currencyId) => {
    Alert.alert( "Confirmar Exclusão", "Tem certeza que deseja excluir esta moeda?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(`${API_BASE_URL}/currency/${currencyId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (response.ok) {
                setCurrencies(prevCurrencies => prevCurrencies.filter(c => c.id !== currencyId));
                Alert.alert("Sucesso", "Moeda excluída.");
              } else { throw new Error("Falha ao excluir a moeda."); }
            } catch (error) {
              console.error("Erro ao deletar moeda:", error);
              Alert.alert("Erro", "Não foi possível excluir a moeda.");
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (isFocused) {
        loadDashboardData();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F0B90B" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerStyle: { backgroundColor: '#1E1E1E' },
          drawerLabelStyle: { color: '#fff', fontSize: 16 },
          drawerActiveBackgroundColor: '#F0B90B',
          drawerActiveTintColor: '#000',
        }}
      >
        <Drawer.Screen name="Profile" options={{ title: 'Perfil' }}>
          {() => <ProfileScreen 
                    userProfile={userProfile} 
                    onLogout={handleLogout} 
                    onEditProfile={() => userProfile?.id && navigation.navigate('EditProfile', { user: userProfile })} 
                 />}
        </Drawer.Screen>
        <Drawer.Screen name="Portfolio" options={{ title: 'Portfólio de Moedas' }}>
          {() => <PortfolioScreen currencies={currencies} onDeleteCurrency={handleDeleteCurrency} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  // Estilos Globais
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0B0B' },
  loadingText: { marginTop: 10, color: '#F0B90B', fontSize: 16 },
  pageContainer: { flex: 1, backgroundColor: '#0B0B0B' },
  contentContainer: { flex: 1, justifyContent: 'center' },
  
  // Estilos do Header
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  menuButton: { padding: 10, position: 'absolute', left: 5, zIndex: 1 },
  menuButtonText: { color: '#F0B90B', fontSize: 24, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  headerActionButton: { padding: 10, position: 'absolute', right: 5, zIndex: 1 },
  editButtonText: { fontSize: 24 },
  
  // Estilos do Perfil
  profileCard: { 
    backgroundColor: '#1E1E1E', 
    borderRadius: 16, 
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 4 },
  emailText: { fontSize: 16, color: '#aaa', marginBottom: 24 },
  buttonContainer: { width: '80%' },

  // Estilos do Portfólio (NOVOS E ATUALIZADOS)
  portfolioTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  currencyCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coinIconText: {
    color: '#0B0B0B',
    fontSize: 20,
    fontWeight: 'bold',
  },
  currencyInfo: {
    flex: 1,
    marginRight: 8, // Adiciona espaço entre as informações e os valores
  },
  currencyName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  currencySymbol: { 
    fontSize: 14, 
    color: '#888', 
    marginTop: 2 
  },
  currencyValue: {
    alignItems: 'flex-end',
    minWidth: 110, // Garante que a área de valor tenha uma largura mínima
  },
  currencyPrice: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  priceChangePositive: {
    fontSize: 14,
    color: '#22c55e', // Verde
    fontWeight: '600',
  },
  priceChangeNegative: {
    fontSize: 14,
    color: '#ef4444', // Vermelho
    fontWeight: '600',
  },
  deleteButton: { 
    paddingLeft: 12,
    paddingVertical: 5
  },
  deleteButtonText: { 
    fontSize: 22,
    color: '#555'
  },
  emptyListText: { color: '#aaa', textAlign: 'center', marginTop: 30, fontSize: 16 },
});

