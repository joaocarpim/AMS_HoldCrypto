// mobile/app/(tabs)/wallet.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  RefreshControl, Modal, TextInput, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ArrowDownLeft, ArrowUpRight, X, Repeat, Send, CheckCircle, AlertTriangle } from 'lucide-react-native';

import { useAuthUser } from '../../src/features/auth/store/useAuthStore';
import { useDashboardCurrencies, useDashboardActions } from '../../src/features/dashboard/store/useDashboardStore';
import walletService, { Wallet, WalletTransaction } from '../../src/features/wallet/services/walletService';
import CoinIcon from '../../src/features/currency/components/CoinIcon';

export default function WalletScreen() {
  const user = useAuthUser();
  const currencies = useDashboardCurrencies(); 
  const { fetchDashboardData } = useDashboardActions(); 

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Estados dos Modais
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'deposit' | 'withdraw'>('create');
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  
  // Inputs
  const [inputAmount, setInputAmount] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputCurrency, setInputCurrency] = useState('BTC');

  // Estados de Feedback (Novo!)
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [wList, tList] = await Promise.all([
        walletService.getUserWallets(user.id),
        walletService.getHistory(user.id)
      ]);
      setWallets(wList);
      setTransactions(tList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      fetchDashboardData();
    } catch (error) { console.error(error); }
  }, [user?.id, fetchDashboardData]);

  useEffect(() => { setLoading(true); loadData().finally(() => setLoading(false)); }, [loadData]);
  const onRefresh = () => { setRefreshing(true); loadData().finally(() => setRefreshing(false)); };

  // Helpers
  const showFeedback = (type: 'success' | 'error', message: string) => {
      setFeedbackType(type);
      setFeedbackMessage(message);
      setFeedbackVisible(true);
  };

  const openActionModal = (type: 'deposit' | 'withdraw', wallet: Wallet) => {
    setModalType(type); setSelectedWallet(wallet); setInputAmount(''); setModalVisible(true);
  };
  const openCreateModal = () => {
    setModalType('create'); setInputName(''); setInputCurrency(currencies[0]?.symbol || 'BTC'); setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!user?.id) return;

    // Validação básica
    if (modalType !== 'create') {
        const amount = Number(inputAmount);
        if (isNaN(amount) || amount <= 0) {
            showFeedback('error', 'Digite um valor válido maior que zero.');
            return;
        }
        if (modalType === 'withdraw' && selectedWallet && amount > selectedWallet.balance) {
             showFeedback('error', 'Saldo insuficiente para esta operação.');
             return;
        }
    }

    setLoading(true);
    try {
        if (modalType === 'create') {
            if(!inputName) { showFeedback('error', 'Digite um nome para a carteira.'); setLoading(false); return; }
            await walletService.createWallet({ userId: user.id, name: inputName, currencySymbol: inputCurrency, category: 0 });
            setModalVisible(false);
            setTimeout(() => showFeedback('success', "Carteira criada com sucesso!"), 300);
        } else if (modalType === 'deposit' && selectedWallet) {
            await walletService.deposit(selectedWallet.id, Number(inputAmount));
            setModalVisible(false);
            setTimeout(() => showFeedback('success', "Depósito/Recebimento confirmado!"), 300);
        } else if (modalType === 'withdraw' && selectedWallet) {
            await walletService.withdraw(selectedWallet.id, Number(inputAmount));
            setModalVisible(false);
            setTimeout(() => showFeedback('success', "Saque/Envio realizado!"), 300);
        }
        loadData(); 
    } catch (error: any) { 
        let msg = "Falha na operação.";
        if (error.response?.data) {
            msg = typeof error.response.data === 'string' 
            ? error.response.data 
            : (error.response.data.message || error.response.data.title || "Erro no servidor.");
        }
        showFeedback('error', msg);
    } 
    finally { setLoading(false); }
  };

  const getModalTitle = () => {
      if (modalType === 'create') return 'Nova Carteira';
      const isBRL = selectedWallet?.currencySymbol === 'BRL';
      return modalType === 'deposit' ? (isBRL ? 'Depositar Pix' : 'Receber Cripto') : (isBRL ? 'Sacar para Conta' : 'Enviar Cripto');
  };

  const getTxDetails = (tx: WalletTransaction) => {
      const date = new Date(tx.createdAt);
      const dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')} • ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
      switch(tx.type) {
          case 0: return { label: 'Recebido', icon: ArrowDownLeft, color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)', dateString }; 
          case 1: return { label: 'Enviado', icon: ArrowUpRight, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', dateString }; 
          default: return { label: 'Troca', icon: Repeat, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', dateString }; 
      }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F0B90B" />}>
        
        <View style={styles.header}>
            <View>
                <Text style={styles.title}>Carteiras</Text>
                <Text style={styles.subtitle}>{wallets.length} ativas</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
                <Plus size={20} color="#020617" strokeWidth={3} />
                <Text style={styles.addButtonText}>Criar</Text>
            </TouchableOpacity>
        </View>

        {/* Grid de Carteiras */}
        <View style={styles.grid}>
            {wallets.length === 0 && !loading ? <Text style={styles.emptyText}>Sem carteiras.</Text> : (
                wallets.map(wallet => {
                    const isBRL = wallet.currencySymbol === 'BRL';
                    return (
                        <View key={wallet.id} style={[styles.card, isBRL && styles.cardBrl]}>
                            <View style={styles.cardHeader}>
                                <View style={styles.coinBadge}>
                                    <CoinIcon symbol={wallet.currencySymbol} size={36} />
                                    <View>
                                        <Text style={styles.coinSymbol}>{wallet.currencySymbol}</Text>
                                        <Text style={styles.cardName}>{wallet.name}</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.balanceValue}>
                                {wallet.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                            </Text>
                            <Text style={styles.balanceLabel}>SALDO DISPONÍVEL</Text>

                            <View style={styles.cardActions}>
                                <TouchableOpacity style={[styles.actionBtn, isBRL ? styles.btnGreen : styles.btnBlue]} onPress={() => openActionModal('deposit', wallet)}>
                                    <ArrowDownLeft size={16} color={isBRL ? "#4ade80" : "#60a5fa"} />
                                    <Text style={[styles.actionText, { color: isBRL ? '#4ade80' : '#60a5fa' }]}>{isBRL ? 'Depositar' : 'Receber'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.actionBtn, styles.btnRed]} onPress={() => openActionModal('withdraw', wallet)}>
                                    {isBRL ? <ArrowUpRight size={16} color="#fb7185" /> : <Send size={14} color="#fb7185" />}
                                    <Text style={[styles.actionText, { color: '#fb7185' }]}>{isBRL ? 'Sacar' : 'Enviar'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })
            )}
        </View>

        {/* Histórico Compacto */}
        <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Histórico</Text>
            <View style={styles.historyContainer}>
                {transactions.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhuma movimentação recente.</Text>
                ) : (
                    transactions.map((tx, index) => {
                        const { label, icon: Icon, color, bg, dateString } = getTxDetails(tx);
                        const isLast = index === transactions.length - 1;
                        
                        return (
                            <View key={tx.id}>
                                <View style={styles.txRowCompact}>
                                    <View style={[styles.txIconCircle, { backgroundColor: bg }]}>
                                        <Icon size={16} color={color} />
                                    </View>
                                    <View style={styles.txContent}>
                                        <Text style={styles.txTitle}>{label} {tx.currencySymbol}</Text>
                                        <Text style={styles.txDate}>{dateString}</Text>
                                    </View>
                                    <Text style={[styles.txAmountCompact, { color: tx.type === 1 ? '#f43f5e' : '#34d399' }]}>
                                        {tx.type === 1 ? '-' : '+'}{Number(tx.amount).toLocaleString('pt-BR', { maximumFractionDigits: 8 })}
                                    </Text>
                                </View>
                                {!isLast && <View style={styles.divider} />}
                            </View>
                        );
                    })
                )}
            </View>
        </View>

      </ScrollView>

      {/* Modal de Ação (Input) */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{getModalTitle()}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}><X size={24} color="#9ca3af" /></TouchableOpacity>
                </View>
                {modalType === 'create' ? (
                    <View style={styles.form}>
                        <Text style={styles.label}>Nome</Text>
                        <TextInput style={styles.input} placeholder="Ex: Minha Reserva" placeholderTextColor="#475569" value={inputName} onChangeText={setInputName} />
                        <Text style={styles.label}>Moeda</Text>
                        <View style={styles.currencySelector}>
                            {currencies.map(c => (
                                <TouchableOpacity key={c.symbol} style={[styles.currencyTag, inputCurrency === c.symbol && styles.currencyTagActive]} onPress={() => setInputCurrency(c.symbol)}>
                                    <Text style={[styles.currencyText, inputCurrency === c.symbol && styles.currencyTextActive]}>{c.symbol}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ) : (
                    <View style={styles.form}>
                        <Text style={styles.label}>Valor / Quantidade</Text>
                        <TextInput style={styles.input} placeholder="0.00" placeholderTextColor="#475569" keyboardType="numeric" value={inputAmount} onChangeText={setInputAmount} autoFocus />
                        <Text style={styles.helperText}>Disponível: {selectedWallet?.balance.toFixed(4)} {selectedWallet?.currencySymbol}</Text>
                        {selectedWallet?.currencySymbol !== 'BRL' && <Text style={{ color: '#F0B90B', fontSize: 11, marginTop: 4 }}>Nota: Simulação de transferência de rede.</Text>}
                    </View>
                )}
                <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color="black" /> : <Text style={styles.confirmButtonText}>Confirmar</Text>}
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* --- MODAL DE FEEDBACK (Novo!) --- */}
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
                    {feedbackType === 'success' ? 'Sucesso!' : 'Atenção'}
                </Text>
                <Text style={styles.feedbackMessage}>{feedbackMessage}</Text>
                
                <TouchableOpacity 
                    style={[styles.feedbackButton, feedbackType === 'success' ? {backgroundColor: '#22c55e'} : {backgroundColor: '#ef4444'}]}
                    onPress={() => setFeedbackVisible(false)}
                >
                    <Text style={styles.feedbackButtonText}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  subtitle: { color: '#94a3b8', fontSize: 14 },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0B90B', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 6 },
  addButtonText: { fontWeight: 'bold', color: '#020617' },
  
  grid: { gap: 16 },
  card: { backgroundColor: '#0f172a', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardBrl: { borderColor: 'rgba(34, 197, 94, 0.2)', backgroundColor: 'rgba(34, 197, 94, 0.03)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  coinBadge: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  coinSymbol: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cardName: { color: '#64748b', fontSize: 12 },
  balanceValue: { color: 'white', fontSize: 28, fontWeight: 'bold', fontFamily: 'monospace', marginBottom: 4 },
  balanceLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 20 },
  cardActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 14, gap: 8, borderWidth: 1, borderColor: 'transparent' },
  btnGreen: { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)' },
  btnBlue: { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)' },
  btnRed: { backgroundColor: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.2)' },
  actionText: { fontWeight: 'bold', fontSize: 12 },

  // HISTÓRICO COMPACTO
  historySection: { marginTop: 32 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  historyContainer: { backgroundColor: '#0f172a', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' },
  txRowCompact: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  txIconCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  txContent: { flex: 1 },
  txTitle: { color: 'white', fontWeight: '600', fontSize: 14 },
  txDate: { color: '#64748b', fontSize: 11, marginTop: 2 },
  txAmountCompact: { fontWeight: 'bold', fontSize: 14, fontFamily: 'monospace' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginLeft: 66 },
  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 20 },
  
  // MODAL AÇÃO
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1e293b', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  form: { gap: 16, marginBottom: 24 },
  label: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: '#0f172a', color: 'white', padding: 16, borderRadius: 16, fontSize: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  helperText: { color: '#64748b', fontSize: 12, marginTop: 4 },
  currencySelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  currencyTag: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
  currencyTagActive: { backgroundColor: '#F0B90B' },
  currencyText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  currencyTextActive: { color: '#020617' },
  confirmButton: { backgroundColor: '#F0B90B', padding: 16, borderRadius: 16, alignItems: 'center' },
  confirmButtonText: { color: '#020617', fontWeight: 'bold', fontSize: 16 },

  // MODAL FEEDBACK (CSS)
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