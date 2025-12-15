# 🧪 Testes de Sanidade (Mobile MVP)

Este documento descreve os testes manuais de fumaça (smoke tests) realizados para garantir a funcionalidade mínima do aplicativo React Native.

## 1. Teste de Fluxo de Autenticação

| Passo | Ação | Resultado Esperado (Critério RF-02) | Status |
| :--- | :--- | :--- | :--- |
| **1.1** | Abrir o App e tentar acessar a Dashboard. | Redirecionamento para a tela de Login. | ✅ |
| **1.2** | Fazer Login com credenciais válidas. | Token JWT retornado pela UserAPI e armazenado. A tela Dashboard carrega corretamente. | ✅ |
| **1.3** | Ir para Perfil e clicar em "Sair". | Modal de confirmação customizado aparece. Após confirmação, token é limpo e volta para o Login. | ✅ |

## 2. Teste de Integridade de Dados (RF-03, RF-09)

| Passo | Ação | Resultado Esperado | Status |
| :--- | :--- | :--- | :--- |
| **2.1** | Abrir Dashboard e Carteira. | Saldos (Total e por ativo) carregam da WalletAPI e são exibidos corretamente (sem erro 401). | ✅ |
| **2.2** | Verificar a lista de Histórico. | Transações (Trade, Depósito, Saque) são exibidas de forma compacta e os valores fecham. | ✅ |
| **2.3** | Verificar a tela de Mercados. | Moedas (BTC, ETH, etc.) carregam, e a variação percentual (24h) é calculada a partir do histórico. | ✅ |

## 3. Teste de Operações Financeiras (RF-04)

| Passo | Ação | Resultado Esperado (Critério RF-04) | Status |
| :--- | :--- | :--- | :--- |
| **3.1** | Na Carteira, clicar em **BRL** -> **Depositar**. | Modal de input abre. Após confirmar, o Saldo Total e o saldo BRL aumentam. Feedback de "Sucesso" aparece. | ✅ |
| **3.2** | Na Carteira, tentar **Sacar** (ou **Enviar**) um valor **maior** que o saldo disponível. | A operação é recusada pelo backend/validação local. Aparece o Modal de Feedback de "Atenção" (Erro). | ✅ |
| **3.3** | Na Carteira, usar o botão **Receber** em uma Criptomoeda. | O saldo daquela criptomoeda aumenta (simulação de transferência blockchain). | ✅ |