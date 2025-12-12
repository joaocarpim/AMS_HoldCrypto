# 🚀 AMS Trade Holding - Plataforma de Criptoativos

Plataforma completa de simulação de exchange de criptomoedas, desenvolvida com arquitetura de microserviços, integrando Backend .NET, Frontend Next.js, Mobile React Native e Inteligência Artificial.

## 🏗️ Arquitetura do Sistema

O sistema é composto por microserviços independentes que se comunicam via API Gateway (Ocelot) e mensageria síncrona.

- **Frontend:** Next.js (Web) e React Native (Mobile).
- **Gateway:** Ocelot (Proxy Reverso).
- **Microserviços:**
  - `UserAPI`: Autenticação e Gestão de Usuários (JWT).
  - `WalletAPI`: Core financeiro (Carteiras, Transações, Trade).
  - `CurrencyAPI`: Cotações em tempo real e histórico.
  - `ChatbotAPI`: Assistente virtual em Python (NLP/Regex).

## 🛠️ Tecnologias Principais

- **Backend:** .NET 8 (C#), Entity Framework Core, SQLite.
- **AI/Chatbot:** Python, FastAPI, Regex.
- **Frontend:** TypeScript, Tailwind CSS, Zustand, Recharts.
- **Infra:** Swagger/OpenAPI, Clean Architecture.

## ▶️ Ordem de Execução

Para o sistema funcionar, inicie os serviços nesta ordem:

1. **CurrencyAPI** (Porta 5105)
2. **UserAPI** (Porta 5294)
3. **WalletAPI** (Porta 5129)
4. **ChatbotAPI** (Porta 5005)
5. **GatewayAPI** (Porta 5026) - *Obrigatório para o Frontend*
6. **Frontend Web** (Porta 3000)

Consulte o `README.md` dentro de cada pasta para instruções detalhadas.

## 👥 Equipe

Iran Camargo de Queiroz Junior
Daniel Pereira Silva
João Vitor Aparecido Carpim de Souza
Kenui Engler de Oliveira Martins
Gustavo Germano Lemos Pereira

Projeto desenvolvido para a disciplina de Programação Multiplataforma / IA.

