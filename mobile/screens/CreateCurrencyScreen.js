import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../apiConfig';

// --- Componente do Cabeçalho com Botão de Voltar ---
const CreateHeader = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Adicionar Nova Moeda</Text>
    </View>
  );
};

export default function CreateCurrencyScreen({ navigation }) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !symbol || !description) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      const body = {
        name,
        symbol,
        description,
        status: true, // Moedas novas são criadas como ativas por padrão
        backing: 'USD', // Valor padrão, pode ser alterado se necessário
        icon: 'MonetizationOn' // Ícone padrão
      };

      const response = await fetch(`${API_BASE_URL}/currency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        Alert.alert('Sucesso!', 'Nova moeda adicionada ao seu portfólio.');
        // Volta para a tela anterior (Dashboard), que irá recarregar os dados
        navigation.goBack();
      } else {
        const data = await response.json();
        Alert.alert('Erro na Criação', data.message || 'Ocorreu um erro ao salvar a moeda.');
      }
    } catch (error) {
      console.error('Erro de conexão ao criar moeda:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CreateHeader navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados da Moeda</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome (ex: Bitcoin)"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Símbolo (ex: BTC)"
            placeholderTextColor="#aaa"
            value={symbol}
            onChangeText={setText => setSymbol(setText.toUpperCase())} // Converte o símbolo para maiúsculas
            autoCapitalize="characters"
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            placeholderTextColor="#aaa"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleCreate} disabled={loading}>
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.saveButtonText}>Salvar Moeda</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  backButton: { padding: 15, zIndex: 1 },
  backButtonText: { color: '#F0B90B', fontSize: 30, fontWeight: 'bold' },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute', 
    left: 0,
    right: 0,
    textAlign: 'center'
  },
  card: { backgroundColor: '#1E1E1E', borderRadius: 16, padding: 24 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 24 },
  input: { backgroundColor: '#2D2D2D', color: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16 },
  saveButton: { backgroundColor: '#F0B90B', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
  saveButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },
});

