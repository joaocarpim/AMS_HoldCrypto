import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TextInputProps } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Phone, MapPin, Lock, ArrowLeft } from 'lucide-react-native';
// Removemos importações desnecessárias que geravam warnings:
// import { useAuthActions, useIsAuthenticated } from '../src/features/auth/store/useAuthStore'; 

// Importação do service (quando existir)
// import { userService } from '../src/features/user/services/userService'; 

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) return Alert.alert("Erro", "Campos obrigatórios faltando.");

    setIsLoading(true);
    try {
      // await userService.create(form); 
      
      // Simulação para o MVP
      setTimeout(() => {
          Alert.alert("Sucesso", "Conta criada! Faça login.");
          router.back();
      }, 1500);

    } catch (error) {
      console.error("Erro ao registrar:", error);
      Alert.alert("Erro", "Não foi possível criar a conta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <ArrowLeft size={24} color="#9ca3af" />
           <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Comece a operar no mercado global</Text>
        </View>

        <View style={styles.form}>
            <InputItem 
                icon={User} 
                label="NOME COMPLETO" 
                placeholder="Ex: Ana Silva" 
                value={form.name} 
                onChangeText={(v) => handleChange('name', v)} 
            />
            
            <InputItem 
                icon={Mail} 
                label="EMAIL" 
                placeholder="Ex: ana@crypto.com" 
                value={form.email} 
                onChangeText={(v) => handleChange('email', v)} 
                keyboardType="email-address" 
            />

            <InputItem 
                icon={Phone} 
                label="TELEFONE" 
                placeholder="(00) 00000-0000" 
                value={form.phone} 
                onChangeText={(v) => handleChange('phone', v)} 
                keyboardType="phone-pad" 
            />

            <InputItem 
                icon={MapPin} 
                label="CIDADE/ESTADO" 
                placeholder="Ex: São Paulo, SP" 
                value={form.address} 
                onChangeText={(v) => handleChange('address', v)} 
            />

            <InputItem 
                icon={Lock} 
                label="SENHA" 
                placeholder="Crie uma senha forte" 
                value={form.password} 
                onChangeText={(v) => handleChange('password', v)} 
                secureTextEntry 
            />

            <TouchableOpacity onPress={handleRegister} disabled={isLoading} style={styles.button}>
                {isLoading ? <ActivityIndicator color="black" /> : <Text style={styles.buttonText}>Começar Agora</Text>}
            </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// CORREÇÃO: Interface e Componente
interface InputItemProps extends TextInputProps {
    icon: any;
    label: string;
}

const InputItem = ({ icon: Icon, label, ...props }: InputItemProps) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputContainer}>
            <Icon size={20} color="#6b7280" />
            <TextInput 
                style={styles.input} 
                placeholderTextColor="#4b5563" 
                {...props} // Passa value, onChangeText e outros props nativos
            />
        </View>
    </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { flexGrow: 1, padding: 24, paddingBottom: 50 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backText: { color: '#9ca3af', marginLeft: 8, fontSize: 16 },
  header: { marginBottom: 32 },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#9ca3af', fontSize: 14, marginTop: 4 },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: { color: '#525252', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, height: 56
  },
  input: { flex: 1, color: 'white', marginLeft: 12, fontSize: 16 },
  button: {
    backgroundColor: '#F0B90B', height: 56, borderRadius: 12, 
    alignItems: 'center', justifyContent: 'center', marginTop: 16
  },
  buttonText: { color: 'black', fontWeight: 'bold', fontSize: 16 },
});