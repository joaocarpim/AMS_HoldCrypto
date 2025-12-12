# 📈 Currency API - Microserviço de Mercado

Serviço responsável por gerenciar o catálogo de criptomoedas, fornecer cotações atuais e manter um histórico de preços para análise gráfica.

## 🚀 Tecnologias e Arquitetura

- **Framework:** .NET 9.0 (Web API)
- **Banco de Dados:** SQLite (Entity Framework Core)
- **Arquitetura:** Clean Architecture (API, Application, Domain, Infrastructure)
- **Background Service:** `ExternalApiWorker` para sincronização automática de preços.
- **Integração Externa:** Binance Public API (Ticker).

## 📍 Funcionalidades Principais

1. **Catálogo de Ativos:** CRUD completo de moedas (BTC, ETH, SOL, etc.).
2. **Atualização Automática:** Um serviço em segundo plano (Worker) consulta a API da Binance a cada 5 minutos (configurável) e salva o preço atual no histórico.
3. **Histórico de Preços:** Armazena snapshots de valor para plotagem de gráficos no Frontend.
4. **Endpoint de Cotação:** Fornece a lista completa de ativos com seus detalhes e preços mais recentes.

## ⚙️ Configuração

O serviço roda na porta **5105** por padrão.

### AppSettings
No arquivo `appsettings.json`, você pode configurar a fonte de dados externa:

```json
"ExternalApi": {
  "CryptoPricesUrl": "[https://api.binance.com/api/v3/ticker/price](https://api.binance.com/api/v3/ticker/price)",
  "Symbols": [ "ETHBTC", "BTCUSDT", "ADAUSDT", "BNBUSDT", "SOLUSDT" ]
}