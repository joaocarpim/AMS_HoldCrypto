// IMPORTANTE: Mantenha esta como a PRIMEIRA LINHA do arquivo.
import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import CreateCurrencyScreen from './screens/CreateCurrencyScreen'; // 1. Importe a nova tela

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} /> 
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        {/* 2. Adicione a nova tela ao navegador */}
        <Stack.Screen name="CreateCurrency" component={CreateCurrencyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

