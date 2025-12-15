// mobile/src/features/auth/services/AuthServices.ts

import api from '../../../services/api'; 

const authService = {
    // Adicionamos a tipagem ': string' para o TypeScript parar de reclamar
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },
    
    // Tipagem 'any' no userData (você pode criar uma interface depois se quiser)
    register: async (userData: any) => {
        // CORREÇÃO DA ROTA:
        // Como você deixou o caminho "puro" no Backend e Ocelot (/api/User),
        // o mobile deve chamar '/user', e não '/user/register'.
        const response = await api.post('/user', userData);
        return response.data;
    }
};

export default authService;