// app/(auth)/index.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthActions, useIsAuthenticated, useAuthError } from '../../src/features/auth/store/useAuthStore';
// ADICIONADO: AlertCircle para o ícone de erro
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuthActions();
  const isAuthenticated = useIsAuthenticated();
  const authError = useAuthError(); // Agora vamos usar essa variável na tela!

  useEffect(() => {
    if (isAuthenticated) {
     router.replace('/(tabs)/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    if(!email || !password) return Alert.alert("Atenção", "Preencha todos os campos");

    setIsSubmitting(true);
    try {
      // O login retorna true/false, mas o erro fica gravado na store (authError)
      await login(email, password);
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert("Erro", "Falha na conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Logo Area */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
             <Text style={styles.logoText}>H</Text>
          </View>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Acesse seu terminal mobile</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          
          {/* Email */}
          <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <View style={styles.inputContainer}>
                  <Mail size={20} color="#6b7280" />
                  <TextInput 
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor="#4b5563"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
              </View>
          </View>

          {/* Senha */}
          <View style={styles.inputGroup}>
              <Text style={styles.label}>SENHA</Text>
              <View style={styles.inputContainer}>
                  <Lock size={20} color="#6b7280" />
                  <TextInput 
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#4b5563"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                  </TouchableOpacity>
              </View>
          </View>

          {/* --- CORREÇÃO: EXIBIÇÃO DO ERRO --- */}
          {/* Se houver um authError, mostramos essa caixa vermelha */}
          {authError ? (
            <View style={styles.errorContainer}>
                <AlertCircle size={20} color="#ef4444" />
                <Text style={styles.errorText}>{authError}</Text>
            </View>
          ) : null}

          {/* Botão */}
          <TouchableOpacity 
            onPress={handleLogin}
            disabled={isSubmitting}
            style={styles.button}
          >
            {isSubmitting ? (
              <ActivityIndicator color="black" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Acessar Plataforma</Text>
                <ArrowRight size={20} color="black" />
              </View>
            )}
          </TouchableOpacity>

          {/* Link Criar Conta */}
          <View style={styles.footer}>
             <Text style={styles.footerText}>Não tem uma conta? </Text>
             <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.linkText}>Criar agora</Text>
             </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoBox: { 
    width: 64, height: 64, backgroundColor: '#F0B90B', borderRadius: 16, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
    shadowColor: '#F0B90B', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#000' },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#9ca3af', fontSize: 14 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { color: '#9ca3af', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, height: 56
  },
  input: { flex: 1, color: 'white', marginLeft: 12, fontSize: 16 },
  
  // Estilos para o erro
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Vermelho transparente
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    color: '#ef4444', // Vermelho claro
    fontSize: 14,
    flex: 1, // Para quebrar linha se o texto for longo
  },

  button: {
    backgroundColor: '#F0B90B', height: 56, borderRadius: 12, 
    alignItems: 'center', justifyContent: 'center', marginTop: 10
  },
  buttonContent: {
    flexDirection: 'row', alignItems: 'center', gap: 8
  },
  buttonText: { color: 'black', fontWeight: 'bold', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#9ca3af', fontSize: 14 },
  linkText: { color: '#F0B90B', fontWeight: 'bold', fontSize: 14 }
});