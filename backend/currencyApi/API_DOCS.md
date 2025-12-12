
# 📘 Especificação Técnica - Currency API

**Base URL:** `http://localhost:5105`
**Versão:** v1

## Visão Geral
A Currency API atua como a "fonte da verdade" para os preços dos ativos na plataforma. Ela não realiza transações, apenas fornece dados de mercado.

---

## 🔄 Worker Service (Sincronização)

O sistema possui um `HostedService` chamado `ExternalApiWorker`.
- **Funcionamento:** Executa em loop infinito enquanto a API está no ar.
- **Lógica:**
  1. Busca todas as moedas ativas no banco de dados local.
  2. Para cada moeda, monta o par correspondente na Binance (ex: `BTC` -> `BTCUSDT`).
  3. Consulta o endpoint público da Binance.
  4. Salva o novo preço na tabela `History` com o timestamp atual (UTC).
- **Fallback:** Se a moeda não existir na Binance ou a API externa falhar, o erro é logado e o processo continua para a próxima moeda.

---

## 🛣️ Endpoints

### 1. Moedas (Currencies)

#### `GET /api/Currency`
Retorna a lista de todas as moedas cadastradas, incluindo seus relacionamentos de histórico (se solicitado).

- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "Bitcoin",
      "symbol": "BTC",
      "description": "Ouro digital",
      "status": true,
      "backing": "USD",
      "histories": [ ... ]
    }
  ]