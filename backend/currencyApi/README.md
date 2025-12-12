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


## 🌱 Seed de Dados (Injeção Inicial de Moedas)

Quando o banco de dados `currencydb.sqlite` é criado pela primeira vez (ou apagado), a tabela `Currency` fica vazia. O Worker de preços (`ExternalApiWorker`) não pode monitorar ativos que não existem, resultando em dados vazios no Frontend.

Para iniciar a demonstração com os ativos principais, é necessário injetar os dados iniciais (`Seed`).

### Opção 1: Via DB Browser (Injeção Rápida Manual)

Esta é a forma mais rápida de popular o banco com as moedas essenciais (BTC, ETH, BRL) para a demonstração:

1.  **Abra o arquivo:** Use o **DB Browser for SQLite** para abrir o arquivo `currencydb.sqlite`.
2.  **Aba SQL:** Vá para a aba "Execute SQL" e cole o script abaixo.
3.  **Execute e Salve:** Clique em "Execute" e depois em **"Write Changes"** para salvar no banco.

-- Limpa a tabela Currency antes de inserir novos dados
DELETE FROM "Currency"; 

-- IMPORTANTE: Definindo Backing = 0 (BRL) para TODAS as moedas de negociação.
-- Isso faz com que o ExternalApiWorker busque os pares XXXBRL (ex: BTCBRL, USDTBRL)
-- e salve os preços já em Reais.

-- As colunas na tabela "Currency" são:

-- "Id", "Name", "Symbol", "Description", "Status", "Backing"

INSERT INTO "Currency" ("Name", "Symbol", "Description", "Status", "Backing") VALUES
-- Criptomoedas Principais
('Bitcoin', 'BTC', 'A cripto original e maior reserva de valor.', 1, 0),
('Ethereum', 'ETH', 'Plataforma para Smart Contracts e dApps.', 1, 0),
('Solana', 'SOL', 'Blockchain de alta performance e baixo custo.', 1, 0),
('Cardano', 'ADA', 'Plataforma baseada em Prova de Participação (PoS).', 1, 0),

-- Stablecoin (Preço do Dólar)
('Tether', 'USDT', 'Stablecoin lastreada em Dólar Americano.', 1, 0),

-- Moeda Fiduciária base
('Real Brasileiro', 'BRL', 'Moeda fiduciária local e base do sistema.', 1, 0);

-- Nota: O campo Status=1 significa que o ativo está ATIVO.