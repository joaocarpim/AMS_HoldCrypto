import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../apiConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha o email e a senha.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        await AsyncStorage.setItem('token', data.token);
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Erro no login', data.message || 'Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>AMS<Text style={styles.headerHighlight}>_HoldCrypto</Text></Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Entrar na sua conta</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa" // Cor do placeholder ajustada
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa" // Cor do placeholder ajustada
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.loginButtonText}>Entrar</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
          <Text style={styles.registerText}>Não tem conta? <Text style={styles.registerTextBold}>Cadastre-se</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0B', justifyContent: 'center', paddingHorizontal: 20 },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerHighlight: {
    color: '#F0B90B', // Amarelo
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 24,
  },
  title: { fontSize: 22, fontWeight: '600', color: '#fff', marginBottom: 24, textAlign: 'center' },
  input: { backgroundColor: '#2D2D2D', color: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16 },
  loginButton: { backgroundColor: '#F0B90B', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
  loginButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  registerText: { color: '#aaa', textAlign: 'center', marginTop: 20, fontSize: 14 },
  registerTextBold: { color: '#F0B90B', fontWeight: '600' },
});

