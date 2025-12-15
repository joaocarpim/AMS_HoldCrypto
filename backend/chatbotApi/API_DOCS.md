# Especificação Técnica - Chatbot API

**Base URL:** `http://localhost:5005`

## Funcionalidades (Intents)

O serviço processa texto livre para identificar:

1. **Cotação:** "Qual o preço do BTC?" -> Consulta CurrencyAPI.
2. **Saldo:** "Quanto tenho?" -> Consulta WalletAPI.
3. **Depósito:** "Depositar 100 BRL" -> Envia comando para WalletAPI.

## Endpoint
- **POST** `/chatbot/message`: Recebe `{ "message": "texto" }` e retorna resposta processada.