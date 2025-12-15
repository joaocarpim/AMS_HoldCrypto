// mobile/app/(tabs)/profile.tsx

import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, Settings, ShieldCheck,  
  HelpCircle, LogOut, ChevronRight, Bell, Lock, 
} from 'lucide-react-native';
import { useAuthUser, useAuthActions } from '../../src/features/auth/store/useAuthStore';

// Componente Auxiliar para Itens de Menu
const MenuItem = ({ icon: Icon, title, subtitle, onPress, isDestructive = false }: any) => (
  <TouchableOpacity 
    style={styles.menuItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.iconBox, isDestructive && styles.destrIconBox]}>
      <Icon size={20} color={isDestructive ? '#ef4444' : '#F0B90B'} />
    </View>
    <View style={styles.menuTextContainer}>
      <Text style={[styles.menuTitle, isDestructive && styles.destrText]}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    {!isDestructive && <ChevronRight size={16} color="#475569" />}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const user = useAuthUser();
  const { logout } = useAuthActions();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(false);
    // Pequeno delay para a animação do modal terminar antes de limpar o estado
    setTimeout(() => {
        logout();
    }, 200);
  };

  const getInitials = (name: string) => {
    if (!name) return 'US';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Meu Perfil</Text>
        </View>

        {/* CARD DO USUÁRIO */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(user?.name || '')}</Text>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@exemplo.com'}</Text>
            
            <View style={styles.badgeContainer}>
              <ShieldCheck size={12} color="#10b981" />
              <Text style={styles.badgeText}>Verificado</Text>
            </View>
          </View>
        </View>

        {/* SEÇÃO 1: CONTA */}
        <Text style={styles.sectionHeader}>Conta</Text>
        <View style={styles.menuGroup}>
          <MenuItem icon={User} title="Dados Pessoais" subtitle="Nome e CPF" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon={Lock} title="Segurança" subtitle="Senha e 2FA" onPress={() => {}} />
        </View>

        {/* SEÇÃO 2: PREFERÊNCIAS */}
        <Text style={styles.sectionHeader}>Preferências</Text>
        <View style={styles.menuGroup}>
          <MenuItem icon={Bell} title="Notificações" subtitle="Alertas de preço" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon={Settings} title="Configurações" subtitle="Tema e Idioma" onPress={() => {}} />
        </View>

        {/* SEÇÃO 3: SUPORTE */}
        <Text style={styles.sectionHeader}>Suporte</Text>
        <View style={styles.menuGroup}>
          <MenuItem icon={HelpCircle} title="Ajuda" subtitle="FAQ e Chat" onPress={() => {}} />
        </View>

        {/* BOTÃO SAIR (Abre o Modal) */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => setLogoutModalVisible(true)}>
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>HoldCrypto v1.0.0</Text>

      </ScrollView>

      {/* --- MODAL DE LOGOUT PERSONALIZADO --- */}
      <Modal visible={logoutModalVisible} transparent animationType="fade" onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
                
                {/* Ícone de Saída */}
                <View style={styles.modalIconBg}>
                    <LogOut size={32} color="#ef4444" />
                </View>

                <Text style={styles.modalTitle}>Sair do App?</Text>
                <Text style={styles.modalMessage}>
                    Tem certeza que deseja desconectar? Você precisará fazer login novamente para acessar sua carteira.
                </Text>

                <View style={styles.modalActions}>
                    <TouchableOpacity 
                        style={styles.cancelBtn} 
                        onPress={() => setLogoutModalVisible(false)}
                    >
                        <Text style={styles.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.confirmBtn} 
                        onPress={handleLogout}
                    >
                        <Text style={styles.confirmBtnText}>Sair</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  
  header: { marginBottom: 24 },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },

  // User Card
  userCard: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#0f172a', padding: 20, borderRadius: 24, 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 32
  },
  avatarContainer: { 
    width: 64, height: 64, borderRadius: 32, 
    backgroundColor: '#F0B90B', justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
    shadowColor: '#F0B90B', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5
  },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: 'black' },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  userEmail: { fontSize: 14, color: '#94a3b8', marginBottom: 6 },
  badgeContainer: { 
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, 
    borderRadius: 8, gap: 4 
  },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase' },

  // Menu Groups
  sectionHeader: { 
    fontSize: 12, fontWeight: 'bold', color: '#64748b', 
    textTransform: 'uppercase', marginBottom: 12, marginLeft: 4, letterSpacing: 1 
  },
  menuGroup: { 
    backgroundColor: '#0f172a', borderRadius: 20, 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24, overflow: 'hidden'
  },
  menuItem: { 
    flexDirection: 'row', alignItems: 'center', padding: 16 
  },
  iconBox: { 
    width: 36, height: 36, borderRadius: 10, 
    backgroundColor: 'rgba(240, 185, 11, 0.1)', 
    justifyContent: 'center', alignItems: 'center', marginRight: 14 
  },
  destrIconBox: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '500', color: 'white' },
  menuSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  destrText: { color: '#ef4444' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginLeft: 66 },

  // Logout Button
  logoutButton: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)',
    gap: 8, marginBottom: 24
  },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#ef4444' },
  versionText: { textAlign: 'center', color: '#334155', fontSize: 12 },

  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { width: '100%', backgroundColor: '#1e293b', borderRadius: 32, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalIconBg: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(239, 68, 68, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  modalTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  modalMessage: { color: '#94a3b8', fontSize: 16, textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  
  modalActions: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelBtn: { flex: 1, paddingVertical: 16, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  cancelBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  confirmBtn: { flex: 1, paddingVertical: 16, borderRadius: 16, backgroundColor: '#ef4444', alignItems: 'center' },
  confirmBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});