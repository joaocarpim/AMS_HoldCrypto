// mobile/app/(auth)/register.tsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
// REMOVIDO: CheckCircle da lista de imports
import { User, Mail, Phone, MapPin, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';

import authService from '../../src/features/auth/services/AuthServices';

export default function RegisterScreen() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert("Atenção", "Nome, Email e Senha são obrigatórios.");
    }

    setIsSubmitting(true);

    try {
      // Montagem dos dados exatamente como o C# espera
      const userData = {
        name: name,
        email: email,
        password: password,
        phone: phone,
        address: address,
        role: "Client"
      };

      console.log("Enviando dados:", userData);

      await authService.register(userData);

      Alert.alert(
        "Conta Criada!", 
        "Sua conta foi criada com sucesso. Faça login para continuar.",
        [
          { text: "Ir para Login", onPress: () => router.back() }
        ]
      );

    } catch (error: any) {
      console.error("Erro no registro:", error);
      const msg = error.response?.data?.message || "Não foi possível criar a conta. Verifique os dados.";
      Alert.alert("Erro", msg);
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
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Comece a operar no mercado global</Text>
        </View>

        <View style={styles.form}>
          
          <View style={styles.inputGroup}>
              <Text style={styles.label}>NOME COMPLETO</Text>
              <View style={styles.inputContainer}>
                  <User size={20} color="#6b7280" />
                  <TextInput 
                    style={styles.input}
                    placeholder="Ex: Ana Silva"
                    placeholderTextColor="#4b5563"
                    value={name}
                    onChangeText={setName}
                  />
              </View>
          </View>

          <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <View style={styles.inputContainer}>
                  <Mail size={20} color="#6b7280" />
                  <TextInput 
                    style={styles.input}
                    placeholder="Ex: ana@crypto.com"
                    placeholderTextColor="#4b5563"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
              </View>
          </View>

          <View style={styles.inputGroup}>
              <Text style={styles.label}>TELEFONE</Text>
              <View style={styles.inputContainer}>
                  <Phone size={20} color="#6b7280" />
                  <TextInput 
                    style={styles.input}
                    placeholder="(00) 00000-0000"
                    placeholderTextColor="#4b5563"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
              </View>
          </View>

          <View style={styles.inputGroup}>
              <Text style={styles.label}>CIDADE/ESTADO</Text>
              <View style={styles.inputContainer}>
                  <MapPin size={20} color="#6b7280" />
                  <TextInput 
                    style={styles.input}
                    placeholder="Ex: São Paulo, SP"
                    placeholderTextColor="#4b5563"
                    value={address}
                    onChangeText={setAddress}
                  />
              </View>
          </View>

          <View style={styles.inputGroup}>
              <Text style={styles.label}>SENHA</Text>
              <View style={styles.inputContainer}>
                  <Lock size={20} color="#6b7280" />
                  <TextInput 
                    style={styles.input}
                    placeholder="Crie uma senha forte"
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

          <TouchableOpacity 
            onPress={handleRegister}
            disabled={isSubmitting}
            style={styles.button}
          >
            {isSubmitting ? (
              <ActivityIndicator color="black" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Começar Agora</Text>
              </View>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { flexGrow: 1, padding: 24, paddingBottom: 50 },
  
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  backText: { color: 'white', marginLeft: 8, fontSize: 16, fontWeight: '500' },

  header: { marginBottom: 30 },
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
  
  button: {
    backgroundColor: '#F0B90B', height: 56, borderRadius: 12, 
    alignItems: 'center', justifyContent: 'center', marginTop: 10
  },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buttonText: { color: 'black', fontWeight: 'bold', fontSize: 16 },
});