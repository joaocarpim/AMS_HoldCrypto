# 📱 Módulo Mobile (React Native + Expo)

**Propósito:** Fornecer a versão simplificada e otimizada do sistema, focada em acesso rápido a saldo e transações, conforme definido na arquitetura do MVP.

---

## 1. Stack e Tecnologias

| Tecnologia | Função Principal |
| :--- | :--- |
| **Framework** | React Native (Expo) |
| **Linguagem** | TypeScript / JavaScript |
| **Navegação** | Expo Router |
| **Estado Global** | Zustand (para autenticação e dados da Dashboard) |
| **Estilização** | StyleSheet (simulação de Tailwind/Design System escuro) |
| **HTTP Client** | Axios |
| **Gráficos** | react-native-svg (Gráficos no Módulo Mercados) |

---

## 2. Requisitos e Funcionalidades (RFs)

O Mobile é responsável por cobrir os seguintes requisitos funcionais e entregar a interface do usuário (UI):

| Requisito | Funcionalidade | Status |
| :--- | :--- | :--- |
| **RF-02** | Autenticação (Login via JWT) | ✅ Implementado |
| **RF-03** | Consulta de saldo (Total e por Carteira) | ✅ Implementado |
| **RF-04** | Simulação de Depósito/Saque (BRL/Cripto) | ✅ Implementado |
| **RF-06** | Exibição de ativos e gráficos de preços | ✅ Implementado |
| **RF-09** | Histórico de Transações (Extrato) | ✅ Implementado |
| **RF-08** | Visualização de Perfil (Dados pessoais) | ✅ Implementado |

> **Nota:** O fluxo de Trade (`RF-05`) e o Chatbot (`RF-07`) são centralizados nas interfaces Web e APIs específicas, conforme a regra de "versão simplificada" do Mobile.

---

## 3. Integração e Comunicação (REST/Síncrona)

O módulo Mobile se comunica **apenas com o GatewayAPI** via HTTP/REST, usando o token JWT para autenticação.

### Endpoints Principais Consumidos:

| Módulo | Endpoint (Gateway) | Uso no Mobile |
| :--- | :--- | :--- |
| **UserAPI** | `POST /user/login` | Login e obtenção do JWT. |
| **WalletAPI** | `GET /wallet` | Busca lista de carteiras e saldos (Dashboard/Carteira). |
| **WalletAPI** | `GET /wallet/history?userId={id}` | Busca histórico de transações. |
| **WalletAPI** | `POST /wallet/deposit` | Simulação de entrada de fundos. |
| **WalletAPI** | `POST /wallet/withdraw` | Simulação de saída de fundos. |
| **CurrencyAPI**| `GET /currency` | Lista todas as moedas e seus históricos (Mercados). |

### Estratégia de Segurança

* O **Token JWT** é armazenado globalmente (Zustand Store) e re-injetado em todas as requisições autenticadas pelo **Axios Interceptor** (`src/services/api.ts`).
* O App é configurado para rodar em Dark Mode com feedback customizado (Modals de Sucesso/Erro) para uma experiência coesa e profissional, tratando erros 400/401 de forma amigável ao usuário.

---

## 4. Instruções de Execução Local
* Para executar o módulo Mobile, certifique-se de que o Backend (GatewayAPI) está rodando primeiro e que você conhece o IP da sua máquina.

## 4.1 Inicialização do GatewayAPI
* O GatewayAPI deve ser inicializado com o parâmetro --urls para garantir que ele esteja acessível na rede local, e não apenas no localhost. Isso é essencial para que o celular (ou emulador) consiga se conectar ao servidor.

* Utilize o seguinte comando na pasta do seu projeto GatewayAPI/:

Bash

dotnet run --urls "http://0.0.0.0:5026"
Explicação do Comando: O parâmetro 0.0.0.0 faz com que o servidor do .NET escute requisições em todas as interfaces de rede (Wi-Fi, Ethernet), permitindo que o dispositivo móvel se comunique usando o IP real da sua máquina (ex: 192.168.0.x).

## 4.2 Configuração e Inicialização do Mobile
* Configuração da API:

Edite o arquivo mobile/src/services/api.ts.

Substitua o IP na constante API_URL pelo endereço IP real da sua máquina, mantendo a porta do Gateway (ex: http://192.168.0.11:5026/api).

Inicialização do Aplicativo:

Bash

cd mobile/
npm install
npx expo start ou npx expo start --clear(para limpeza de cache).
Acesse o aplicativo escaneando o QR Code com o Expo Go.