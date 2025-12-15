import axios from 'axios';

// O Gateway roda na 5026
const API_URL = 'http://localhost:5026/api'; 

export interface ChatMessage {
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export const chatbotService = {
    sendMessage: async (message: string): Promise<string> => {
        // Pega o token salvo no login
        const token = localStorage.getItem('token');

        if (!token) {
            // Se não tiver token, nem tenta chamar a API
            return "Erro: Você não parece estar logado.";
        }

        try {
            // POST para o Gateway (/chatbot/message)
            // O Gateway vai redirecionar para o Python (5005)
            const response = await axios.post(
                `${API_URL}/chatbot/message`, 
                { message },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Passa o token pro Python
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.response;
        } catch (error: any) {
            console.error("Erro Chatbot:", error);
            if (error.response?.status === 401) {
                return "Sessão expirada. Faça login novamente.";
            }
            return "Não consegui conectar ao assistente no momento.";
        }
    }
};