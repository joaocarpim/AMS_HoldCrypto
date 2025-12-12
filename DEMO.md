# 🎬 Roteiro de Demonstração - AMS Trade Holding

Este documento serve como guia para a apresentação prática do sistema, cobrindo todos os requisitos funcionais e técnicos exigidos.

---

## 🛠️ 0. Preparação (Bastidores)

Antes de iniciar a apresentação, certifique-se de que todos os serviços estão rodando nos terminais:

1.  **CurrencyAPI** (`:5105`) - *Dados de Mercado*
2.  **UserAPI** (`:5294`) - *Auth*
3.  **WalletAPI** (`:5129`) - *Core Financeiro*
4.  **ChatbotAPI** (`:5005`) - *Python/IA*
5.  **GatewayAPI** (`:5026`) - *Proxy Reverso*
6.  **Frontend** (`:3000`) - *Interface Web*
7.  **Mobile** (Expo Go) - *Opcional, se for mostrar o celular*

---

## 1. 👤 Autenticação e Segurança (UserAPI)

**Objetivo:** Demonstrar o fluxo de registro e a emissão do Token JWT.

- [ ] **Acessar o Frontend:** Abra `http://localhost:3000`.
- [ ] **Criar Conta:**
    - Clique em "Registrar-se".
    - Nome: `Avaliador Demo`
    - Email: `demo@holdcrypto.com`
    - Senha: `123456`
- [ ] **Fazer Login:**
    - Use as credenciais criadas.
- [ ] **Evidência Técnica:**
    - *Abrir o F12 (DevTools) -> Application -> Local Storage.*
    - Mostrar o **Token JWT** salvo.
    - Explicar: *"O Frontend armazena este token e o envia no cabeçalho Authorization para o Gateway em todas as requisições."*

---

## 2. 📈 Dados de Mercado (CurrencyAPI)

**Objetivo:** Mostrar o consumo de dados externos e a persistência de histórico.

- [ ] **Navegar para "Mercados":**
    - Mostrar a lista de criptomoedas (BTC, ETH, SOL).
    - Explicar: *"Esses dados vêm da CurrencyAPI, que possui um Worker em segundo plano sincronizando com a Binance."*
- [ ] **Detalhes:**
    - Clicar em uma moeda (ex: Bitcoin).
    - Mostrar o gráfico (Sparkline) gerado com base no histórico salvo no SQLite.

---

## 3. 💰 Operações Financeiras (WalletAPI)

**Objetivo:** Demonstrar o Core Business (Depósito e Trade).

- [ ] **Criar Carteira:**
    - No Dashboard, clicar em **"Nova Carteira"**.
    - Escolher moeda: `BTC` (Bitcoin).
    - Categoria: `Spot`.
- [ ] **Depósito Manual (BRL):**
    - Identificar a carteira `BRL` (criada automaticamente ou criar uma).
    - Clicar em **Depositar**.
    - Valor: `1000.00`.
    - Verificar atualização imediata do saldo total.
- [ ] **Swap (Trade):**
    - Ir no Widget de **Swap Rápido** (Direita).
    - De: `BRL` | Para: `BTC`.
    - Valor: `500`.
    - Confirmar.
    - **Resultado:** O saldo em BRL diminui e o saldo em BTC aumenta.

---

## 4. 🤖 A "Cereja do Bolo": Chatbot (Integração Total)

**Objetivo:** Provar a comunicação entre microserviços (Python -> Gateway -> C#).

- [ ] **Abrir o Widget do Chatbot:** (Canto inferior direito).
- [ ] **Teste 1: Cotação (Leitura)**
    - Digitar: `Qual a cotação do ETH?`
    - *Explicação:* O Python recebe, identifica a intent via Regex, chama a `CurrencyAPI` via Gateway e responde.
- [ ] **Teste 2: Depósito via Chat (Escrita)**
    - Digitar: `Depositar 5000 BRL`
    - *Explicação:* O Python identifica o comando, extrai o valor e a moeda, e faz um POST seguro na `WalletAPI`.
- [ ] **Teste 3: Saldo (Consolidação)**
    - Digitar: `Qual meu saldo?`
    - **Resultado:** O bot deve responder com o valor atualizado (incluindo os 5000 depositados via chat).

---

## 5. 📱 Mobile (Opcional/Diferencial)

**Objetivo:** Mostrar a arquitetura multiplataforma consumindo a mesma API.

- [ ] Abrir o App no emulador ou celular.
- [ ] Fazer login com `demo@holdcrypto.com`.
- [ ] Mostrar que o **Saldo** e as **Transações** feitas na Web aparecem instantaneamente no Mobile.

---

## ✅ Encerramento

- Mostrar o PDF de Documentação Técnica gerado.
- Mostrar o Swagger do Gateway (`http://localhost:5026/swagger`) como prova da organização das APIs.