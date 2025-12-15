// mobile/app/(tabs)/dashboard.tsx

import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, RefreshControl, 
  TouchableOpacity, ActivityIndicator, Modal, TextInput, StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthUser } from '../../src/features/auth/store/useAuthStore';
import { 
  useDashboardActions, 
  useDashboardLoading, 
  useDashboardWallets, 
  useDashboardCurrencies 
} from '../../src/features/dashboard/store/useDashboardStore';
import walletService, { Wallet } from '../../src/features/wallet/services/walletService';
import { Currency } from '../../src/features/currency/services/currencyService';
import { Eye, EyeOff, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, X, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react-native';
import CoinIcon from '../../src/features/currency/components/CoinIcon';

const formatFiat = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatCrypto = (value: number, symbol: string) => {
  const decimals = value > 1 ? 2 : 6;
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} ${symbol}`;
};

export default function DashboardScreen() {
  const user = useAuthUser();
  const loading = useDashboardLoading();
  const wallets = useDashboardWallets();
  const currencies = useDashboardCurrencies();
  const { fetchDashboardData } = useDashboardActions();

  const [refreshing, setRefreshing] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  
  // Estados do Modal de Ação
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [inputAmount, setInputAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Estados do Modal de Feedback (Substitui o Alert)
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  // Helper para mostrar feedback bonito
  const showFeedback = (type: 'success' | 'error', message: string) => {
      setFeedbackType(type);
      setFeedbackMessage(message);
      setFeedbackVisible(true);
  };

  const totalBalance = useMemo(() => {
    let total = 0;
    wallets.forEach((wallet: Wallet) => {
        const balance = Number(wallet.balance);
        if (isNaN(balance)) return;
        if (wallet.currencySymbol === 'BRL') {
            total += balance;
        } else {
            const currency = currencies.find((c: Currency) => c.symbol === wallet.currencySymbol);
            const price = currency?.histories?.length 
                ? currency.histories.sort((a: any, b: any) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())[0].price 
                : 0;
            total += balance * price;
        }
    });
    return total;
  }, [wallets, currencies]);

  const handleMainAction = (type: 'deposit' | 'withdraw') => {
      const brlWallet = wallets.find(w => w.currencySymbol === 'BRL');
      if (brlWallet) {
          setModalType(type);
          setSelectedWallet(brlWallet);
          setInputAmount('');
          setModalVisible(true);
      } else {
          showFeedback('error', 'Crie uma carteira BRL primeiro.');
      }
  };

  const handleModalSubmit = async () => {
      if (!user?.id || !selectedWallet) return;
      
      const amount = Number(inputAmount);
      
      // Validação básica local antes de chamar API
      if (isNaN(amount) || amount <= 0) {
          showFeedback('error', 'Digite um valor válido maior que zero.');
          return;
      }

      if (modalType === 'withdraw' && amount > selectedWallet.balance) {
          showFeedback('error', 'Saldo insuficiente para este saque.');
          return;
      }

      setActionLoading(true);
      try {
          if (modalType === 'deposit') {
              await walletService.deposit(selectedWallet.id, amount);
              setModalVisible(false); // Fecha o modal de input
              setTimeout(() => showFeedback('success', `Depósito de R$ ${inputAmount} realizado!`), 300);
          } else {
              await walletService.withdraw(selectedWallet.id, amount);
              setModalVisible(false); // Fecha o modal de input
              setTimeout(() => showFeedback('success', `Saque de R$ ${inputAmount} confirmado!`), 300);
          }
          fetchDashboardData(); 
      } catch (error: any) {
          // Tratamento de erro amigável
          let msg = "Falha na operação.";
          if (error.response?.data) {
             // Tenta pegar mensagem limpa do backend ou usa uma genérica
             msg = typeof error.response.data === 'string' 
                ? error.response.data 
                : (error.response.data.message || error.response.data.title || "Erro no servidor.");
          }
          showFeedback('error', msg);
      } finally {
          setActionLoading(false);
      }
  };

  const firstName = user?.name?.split(' ')[0] || 'Trader';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F0B90B" />}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                <Text style={styles.welcomeLabel}>Olá, {firstName}</Text>
                <Sparkles size={16} color="#F0B90B" />
            </View>
            <Text style={styles.headerSubtitle}>Visão Geral da Carteira</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => setHideBalance(!hideBalance)}>
            {hideBalance ? <Eye size={20} color="#94a3b8" /> : <EyeOff size={20} color="#94a3b8" />}
          </TouchableOpacity>
        </View>

        {/* HERO CARD */}
        <View style={styles.heroCard}>
            <View style={styles.cardGlow} />
            <View style={styles.cardContent}>
                <View style={styles.heroTop}>
                    <View style={styles.balanceBadge}>
                        <WalletIcon size={14} color="#F0B90B" />
                        <Text style={styles.balanceBadgeText}>PATRIMÔNIO TOTAL</Text>
                    </View>
                </View>
                <Text style={styles.heroBalance}>
                    {hideBalance ? 'R$ ••••••••' : formatFiat(totalBalance)}
                </Text>
                <View style={styles.heroActions}>
                    <TouchableOpacity style={[styles.heroBtn, { backgroundColor: '#22c55e' }]} onPress={() => handleMainAction('deposit')}>
                        <ArrowDownLeft size={18} color="#000" strokeWidth={2.5} />
                        <Text style={styles.heroBtnText}>Depositar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.heroBtn, { backgroundColor: 'rgba(255,255,255,0.1)' }]} onPress={() => handleMainAction('withdraw')}>
                        <ArrowUpRight size={18} color="#fff" strokeWidth={2.5} />
                        <Text style={[styles.heroBtnText, { color: 'white' }]}>Sacar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        {/* LISTA ATIVOS */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Seus Ativos</Text>
        </View>

        {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#F0B90B" style={{ marginTop: 20 }} />
        ) : (
            <View style={styles.assetList}>
                {wallets.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <WalletIcon size={48} color="#1e293b" />
                        <Text style={styles.emptyText}>Você ainda não possui ativos.</Text>
                    </View>
                ) : (
                    wallets.map((wallet: Wallet) => {
                        const balance = Number(wallet.balance);
                        const isBRL = wallet.currencySymbol === 'BRL';
                        const currency = currencies.find((c: Currency) => c.symbol === wallet.currencySymbol);
                        const price = currency?.histories?.length 
                            ? currency.histories.sort((a: any, b: any) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())[0].price 
                            : (isBRL ? 1 : 0);
                        const balanceInBRL = balance * price;

                        return (
                            <View key={wallet.id} style={styles.assetItem}>
                                <View style={styles.assetLeft}>
                                    <View style={styles.coinIconWrapper}>
                                        <CoinIcon symbol={wallet.currencySymbol} size={36} />
                                    </View>
                                    <View style={{ marginLeft: 14 }}>
                                        <Text style={styles.assetSymbol}>{wallet.currencySymbol}</Text>
                                        <Text style={styles.assetName}>{wallet.name}</Text>
                                    </View>
                                </View>
                                <View style={styles.assetRight}>
                                    <Text style={styles.assetBalance}>
                                        {hideBalance ? '••••' : isBRL ? formatFiat(balance) : formatCrypto(balance, wallet.currencySymbol)}
                                    </Text>
                                    {!isBRL && (
                                        <Text style={styles.assetFiat}>
                                            {hideBalance ? 'R$ ••••' : `≈ ${formatFiat(balanceInBRL)}`}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        );
                    })
                )}
            </View>
        )}
      </ScrollView>

      {/* --- MODAL DE INPUT (DEPOSITAR/SACAR) --- */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{modalType === 'deposit' ? 'Depositar BRL' : 'Sacar BRL'}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                        <X size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Valor</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.currencyPrefix}>R$</Text>
                        <TextInput 
                            style={styles.modalInput} 
                            placeholder="0,00" 
                            placeholderTextColor="#475569"
                            keyboardType="numeric"
                            value={inputAmount}
                            onChangeText={setInputAmount}
                            autoFocus
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.confirmButton} onPress={handleModalSubmit} disabled={actionLoading}>
                    {actionLoading ? <ActivityIndicator color="#020617" /> : <Text style={styles.confirmText}>Confirmar</Text>}
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* --- MODAL DE FEEDBACK (SUCESSO/ERRO) - O NOVO! --- */}
      <Modal visible={feedbackVisible} transparent animationType="fade" onRequestClose={() => setFeedbackVisible(false)}>
        <View style={styles.feedbackOverlay}>
            <View style={styles.feedbackCard}>
                <View style={[styles.feedbackIcon, feedbackType === 'success' ? styles.bgSuccess : styles.bgError]}>
                    {feedbackType === 'success' ? (
                        <CheckCircle size={32} color="#22c55e" />
                    ) : (
                        <AlertTriangle size={32} color="#ef4444" />
                    )}
                </View>
                <Text style={styles.feedbackTitle}>
                    {feedbackType === 'success' ? 'Tudo certo!' : 'Algo deu errado'}
                </Text>
                <Text style={styles.feedbackMessage}>{feedbackMessage}</Text>
                
                <TouchableOpacity 
                    style={[styles.feedbackButton, feedbackType === 'success' ? {backgroundColor: '#22c55e'} : {backgroundColor: '#ef4444'}]}
                    onPress={() => setFeedbackVisible(false)}
                >
                    <Text style={styles.feedbackButtonText}>OK, Entendi</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  welcomeLabel: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#64748b', fontSize: 13, marginTop: 2 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },

  heroCard: { 
    height: 200, borderRadius: 32, overflow: 'hidden', marginBottom: 40,
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 8
  },
  cardGlow: {
    position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(240, 185, 11, 0.15)', transform: [{ scale: 2 }]
  },
  cardContent: { flex: 1, padding: 24, justifyContent: 'space-between' },
  heroTop: { alignItems: 'flex-start' },
  balanceBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  balanceBadgeText: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  heroBalance: { color: 'white', fontSize: 38, fontWeight: 'bold', letterSpacing: -1, marginVertical: 10 },
  heroActions: { flexDirection: 'row', gap: 12 },
  heroBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 20, gap: 8 },
  heroBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  assetList: { gap: 12 },
  assetItem: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: '#0f172a', padding: 16, borderRadius: 24, 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' 
  },
  assetLeft: { flexDirection: 'row', alignItems: 'center' },
  coinIconWrapper: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 },
  assetSymbol: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  assetName: { color: '#64748b', fontSize: 12, marginTop: 2 },
  assetRight: { alignItems: 'flex-end' },
  assetBalance: { color: 'white', fontWeight: 'bold', fontSize: 16, fontFamily: 'monospace' },
  assetFiat: { color: '#64748b', fontSize: 12, marginTop: 2 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40, opacity: 0.5 },
  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 12 },

  // MODAL INPUT
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1e293b', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, paddingBottom: 50 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  closeBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 },
  inputWrapper: { marginBottom: 32 },
  inputLabel: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: 20, paddingHorizontal: 20, height: 64, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  currencyPrefix: { color: 'white', fontSize: 20, fontWeight: 'bold', marginRight: 12 },
  modalInput: { flex: 1, color: 'white', fontSize: 24, fontWeight: 'bold', height: '100%' },
  confirmButton: { backgroundColor: '#F0B90B', padding: 18, borderRadius: 20, alignItems: 'center', shadowColor: '#F0B90B', shadowOpacity: 0.2, shadowRadius: 10 },
  confirmText: { color: '#020617', fontWeight: 'bold', fontSize: 16 },

  // MODAL FEEDBACK (NOVO)
  feedbackOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  feedbackCard: { width: '100%', backgroundColor: '#1e293b', borderRadius: 32, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  feedbackIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  bgSuccess: { backgroundColor: 'rgba(34, 197, 94, 0.15)' },
  bgError: { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
  feedbackTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  feedbackMessage: { color: '#94a3b8', fontSize: 16, textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  feedbackButton: { width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  feedbackButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});