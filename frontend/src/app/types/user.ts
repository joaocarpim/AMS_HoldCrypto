
export interface User {
    id: string;       // ID único do usuário
    name: string;     // Nome do usuário
    email: string;    // Email do usuário
    password?: string; // Senha do usuário (opcional, pois nem sempre será exposta)
   
}