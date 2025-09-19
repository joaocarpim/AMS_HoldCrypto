import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { API_BASE_URL } from '../apiConfig';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !phone || !address) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha todos os campos para continuar.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, address, photo: '' }),
      });
      if (response.ok) {
        Alert.alert('Sucesso!', 'Cadastro realizado. Agora você pode fazer o login.');
        navigation.navigate('Login');
      } else {
        const data = await response.json();
        Alert.alert('Erro no Cadastro', data.message || 'Ocorreu um erro ao tentar criar a conta.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* A seção do header foi removida, conforme solicitado */}
        <View style={styles.card}>
          <Text style={styles.title}>Criar Conta</Text>
          <TextInput style={styles.input} placeholder="Nome Completo" placeholderTextColor="#aaa" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor="#aaa" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="Endereço" placeholderTextColor="#aaa" value={address} onChangeText={setAddress} />
          <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#aaa" value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.registerButtonText}>Criar Conta</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
            <Text style={styles.loginText}>Já tem conta? <Text style={styles.loginTextBold}>Faça login</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0B' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 30 },
  card: { backgroundColor: '#1E1E1E', borderRadius: 16, padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 24 },
  input: { backgroundColor: '#2D2D2D', color: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16 },
  registerButton: { backgroundColor: '#F0B90B', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
  registerButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  loginText: { color: '#aaa', textAlign: 'center', marginTop: 24, fontSize: 14 },
  loginTextBold: { color: '#F0B90B', fontWeight: '600' },
});

