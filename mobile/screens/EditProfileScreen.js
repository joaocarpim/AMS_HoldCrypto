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
const EditHeader = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Editar Perfil</Text>
    </View>
  );
};

export default function EditProfileScreen({ route, navigation }) {
  // Recebe os dados completos do usuário da tela de Dashboard
  const { user } = route.params;

  // Inicializa o estado do formulário com os dados recebidos
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [password, setPassword] = useState(''); // Senha começa vazia por segurança
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name || !email) {
      Alert.alert('Erro de Validação', 'Nome e email são campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      // Monta o corpo da requisição com todos os dados do usuário, atualizados ou não
      const body = {
        id: user.id,
        name,
        email,
        phone,
        address,
        photo: user.photo || '', // Mantém a foto existente
      };

      // Apenas adiciona o campo 'password' ao corpo da requisição se o usuário digitou uma nova
      if (password && password.trim() !== '') {
        body.password = password;
      }

      const response = await fetch(`${API_BASE_URL}/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        Alert.alert('Sucesso!', 'Seu perfil foi atualizado.');
        // Volta para a tela anterior (Dashboard), que irá recarregar os dados
        navigation.goBack();
      } else {
        // Tenta extrair uma mensagem de erro mais detalhada do backend
        const data = await response.json();
        let errorMessage = 'Ocorreu um erro ao salvar as alterações.';
        // Lida com erros de validação do ASP.NET Core
        if (data.errors) {
            errorMessage = Object.values(data.errors).flat().join('\n');
        } else if (data.message) {
            errorMessage = data.message;
        } else if (data.title) {
            errorMessage = data.title;
        }
        Alert.alert('Erro na Atualização', errorMessage);
      }
    } catch (error) {
      console.error('Erro de conexão ao atualizar:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <EditHeader navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Suas Informações</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            placeholderTextColor="#aaa"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Endereço"
            placeholderTextColor="#aaa"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Nova Senha (deixe em branco para manter)"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={loading}>
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.saveButtonText}>Salvar Alterações</Text>}
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

