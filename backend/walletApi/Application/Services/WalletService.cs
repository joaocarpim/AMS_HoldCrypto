// Caminho: backend/walletApi/Application/Services/WalletService.cs
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using System.Globalization;
using System.Collections.Generic;
using System;

// Mantendo seus usings originais
// using AMS_HoldCrypto.WalletApi.Domain.Entities; (Se precisar descomente)

public class WalletService : IWalletService
{
    private readonly IWalletRepository _repo;
    private readonly IHttpClientFactory _httpClientFactory;
    
    // CORREÇÃO 1: Ajuste da URL para bater no Gateway corretamente (com /api)
    private const string CurrencyApiUrl = "http://localhost:5026/api/currency"; 

    public WalletService(IWalletRepository repo, IHttpClientFactory httpClientFactory)
    {
        _repo = repo;
        _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
    }

    // --- Métodos CRUD (Mantidos iguais) ---
    public IEnumerable<Wallet> GetUserWallets(int userId, WalletCategory? category = null)
    {
        return _repo.GetWalletsByUser(userId, category);
    }
    public Wallet GetWallet(int id) { return _repo.GetWalletById(id); }
    
    public Wallet CreateWallet(Wallet wallet)
    {
        var existing = _repo.GetWalletsByUser(wallet.UserId)
                            .FirstOrDefault(w => w.CurrencySymbol.Equals(wallet.CurrencySymbol, StringComparison.OrdinalIgnoreCase));
        
        if (existing != null) throw new InvalidOperationException($"O usuário já possui uma carteira para {wallet.CurrencySymbol}.");
        return _repo.CreateWallet(wallet);
    }

    public bool Deposit(int walletId, decimal amount) {
       var tx = new WalletTransaction { WalletId = walletId, Type = TransactionType.Deposit, Amount = amount };
       _repo.CreateTransaction(tx);
       return true;
    }

    public bool Withdraw(int walletId, decimal amount) {
       var wallet = _repo.GetWalletById(walletId);
       if (wallet == null || wallet.Balance < amount) return false;
       var tx = new WalletTransaction { WalletId = walletId, Type = TransactionType.Withdraw, Amount = amount };
       _repo.CreateTransaction(tx);
       return true;
    }

    public bool Transfer(int fromWalletId, int toWalletId, decimal amount)
    {
        return _repo.Transfer(fromWalletId, toWalletId, amount);
    }

    // --- O MÈTODO CRÍTICO DE TRADE (Refinado para Nota 10) ---
    public async Task<Tuple<Wallet, Wallet>> PerformTrade(int userId, int fromWalletId, string toCurrencySymbol, decimal amountToSpend)
    {
        var fromWallet = _repo.GetWalletById(fromWalletId);
        
        // Validações Básicas
        if (fromWallet == null || fromWallet.UserId != userId)
            throw new InvalidOperationException("Carteira de origem inválida.");
        
        if (fromWallet.Balance < amountToSpend)
            throw new InvalidOperationException($"Saldo insuficiente. Você tem {fromWallet.Balance} {fromWallet.CurrencySymbol}.");

        // Busca ou Cria a Carteira de Destino
        var toWallet = _repo.GetWalletsByUser(userId)
                            .FirstOrDefault(w => w.CurrencySymbol.Equals(toCurrencySymbol, StringComparison.OrdinalIgnoreCase));

        if (toWallet == null)
        {
            toWallet = new Wallet { 
                UserId = userId, 
                Name = toCurrencySymbol, 
                CurrencySymbol = toCurrencySymbol, 
                Category = WalletCategory.Spot, 
                Balance = 0 
            };
            toWallet = _repo.CreateWallet(toWallet);
        }

        string fromSymbol = fromWallet.CurrencySymbol;
        string toSymbol = toCurrencySymbol;
        
        decimal amountToReceive = 0;

        // Lógica de Conversão (Triangulação via BRL ou USD)
        // Assume que a API retorna o preço unitário em BRL/USD
        if (fromSymbol == toSymbol) 
             throw new InvalidOperationException("Não é possível trocar uma moeda por ela mesma.");

        if (fromSymbol == "BRL") // Compra direta (BRL -> BTC)
        {
            decimal priceTo = await GetPriceFromCurrencyApi(toSymbol);
            if (priceTo <= 0) throw new InvalidOperationException($"Preço inválido para {toSymbol}.");
            amountToReceive = amountToSpend / priceTo;
        }
        else if (toSymbol == "BRL") // Venda direta (BTC -> BRL)
        {
            decimal priceFrom = await GetPriceFromCurrencyApi(fromSymbol);
            if (priceFrom <= 0) throw new InvalidOperationException($"Preço inválido para {fromSymbol}.");
            amountToReceive = amountToSpend * priceFrom;
        }
        else // Troca entre Criptos (BTC -> ETH)
        {
            // 1. Converte Origem para Lastro (BRL)
            decimal fromPriceBRL = await GetPriceFromCurrencyApi(fromSymbol);
            // 2. Pega preço do Destino em Lastro (BRL)
            decimal toPriceBRL = await GetPriceFromCurrencyApi(toSymbol);

            if (fromPriceBRL <= 0 || toPriceBRL <= 0)
                throw new InvalidOperationException("Falha ao obter cotações para conversão.");

            decimal valueInBRL = amountToSpend * fromPriceBRL;
            amountToReceive = valueInBRL / toPriceBRL;
        }

        // CORREÇÃO 2: Arredondamento para 8 casas decimais (Padrão Bitcoin)
        // Isso evita erros de dízima periódica no banco de dados.
        amountToReceive = Math.Round(amountToReceive, 8);

        if (amountToReceive <= 0)
            throw new InvalidOperationException("O valor da troca é muito baixo.");

        // Executa a transação no repositório
        var (updatedFromWallet, updatedToWallet) = _repo.ExecuteTrade(
            fromWalletId, toWallet.Id, amountToSpend, amountToReceive);
        
        return Tuple.Create(updatedFromWallet, updatedToWallet);
    }

    public IEnumerable<WalletTransaction> GetTransactionsByUser(int userId)
    {
        return _repo.GetTransactionsByUser(userId);
    }

    // --- Busca Preço no Microserviço de Currency ---
    private async Task<decimal> GetPriceFromCurrencyApi(string symbol)
    {
        // Se for BRL ou USD (Stablecoin base), vale 1
        if (symbol == "BRL" || symbol == "USD") return 1.0m;

        try 
        {
            var client = _httpClientFactory.CreateClient();
            // Chama o Gateway na rota corrigida /api/currency
            var response = await client.GetAsync(CurrencyApiUrl); 
            response.EnsureSuccessStatusCode();

            var stream = await response.Content.ReadAsStreamAsync();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var currencies = await JsonSerializer.DeserializeAsync<List<CurrencyPriceDTO>>(stream, options);
            
            var targetCurrency = currencies?.FirstOrDefault(c => c.Symbol.Equals(symbol, StringComparison.OrdinalIgnoreCase));
            
            if (targetCurrency?.Histories != null && targetCurrency.Histories.Any())
            {
                // Pega o preço mais recente baseada na data
                var latestPrice = targetCurrency.Histories
                                                .OrderByDescending(h => h.Datetime)
                                                .First().Price;
                return (decimal)latestPrice;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao buscar cotação: {ex.Message}");
        }
        
        return 0m; // Retorna 0 em caso de falha para tratar no método acima
    }

    // DTOs internos para deserialização
    private class CurrencyPriceDTO
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public List<HistoryPriceDTO> Histories { get; set; }
    }
    private class HistoryPriceDTO
    {
        public DateTime Datetime { get; set; }
        public decimal Price { get; set; }
    }
}