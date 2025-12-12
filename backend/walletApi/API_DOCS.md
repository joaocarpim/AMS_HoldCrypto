
# Especificação Técnica - Wallet API

**Base URL:** `http://localhost:5129`

## Endpoints

### 1. Carteiras
- **GET** `/api/wallet/balance`: Retorna patrimônio total convertido em BRL (Usa cotação em tempo real).
- **GET** `/api/wallet`: Lista carteiras individuais.
- **POST** `/api/wallet`: Cria nova carteira.

### 2. Operações
- **POST** `/api/wallet/{id}/deposit`: Depósito manual.
- **POST** `/api/wallet/{id}/withdraw`: Saque.
- **POST** `/api/wallet/trade`: Troca entre moedas (Swap).

### 3. Integração Chatbot
- **POST** `/api/wallet/chatbot/deposit`: Endpoint exclusivo para automação via bot.