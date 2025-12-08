// Caminho: backend/walletApi/Application/Services/WalletService.cs
using System.Net.Http; // Para HttpClient
using System.Text.Json; // Para JsonDocument e JsonSerializer
using System.Threading.Tasks; // Para Task
using System.Linq; // Para FirstOrDefault
using System.Globalization; // Para TryParse
using System.Collections.Generic; // Para List
using System; // Para Exception

// A linha 'using AMS_HoldCrypto.WalletApi.Domain.Entities;' foi REMOVIDA

public class WalletService : IWalletService
{
    private readonly IWalletRepository _repo;
    private readonly IHttpClientFactory _httpClientFactory;
    
    private const string CurrencyApiUrl = "http://localhost:5026/currency"; 

    public WalletService(IWalletRepository repo, IHttpClientFactory httpClientFactory)
    {
        _repo = repo;
        _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
    }

    // --- Métodos Existentes ---
    public IEnumerable<Wallet> GetUserWallets(int userId, WalletCategory? category = null)
    {
        return _repo.GetWalletsByUser(userId, category);
    }
    public Wallet GetWallet(int id) { return _repo.GetWalletById(id); }
    public Wallet CreateWallet(Wallet wallet)
    {
        var existing = _repo.GetWalletsByUser(wallet.UserId)
                            .FirstOrDefault(w => w.CurrencySymbol.Equals(wallet.CurrencySymbol, StringComparison.OrdinalIgnoreCase));
        
        if (existing != null)
        {
            throw new InvalidOperationException($"O usuário já possui uma carteira para {wallet.CurrencySymbol}.");
        }
        
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

    // --- MÉTODO DE TRADE (RF-05) ---
    public async Task<Tuple<Wallet, Wallet>> PerformTrade(int userId, int fromWalletId, string toCurrencySymbol, decimal amountToSpend)
    {
        // ... (lógica de trade existente) ...
        var fromWallet = _repo.GetWalletById(fromWalletId);
        if (fromWallet == null || fromWallet.UserId != userId)
            throw new InvalidOperationException("Carteira de origem inválida ou não pertence ao usuário.");
        if (fromWallet.Balance < amountToSpend)
            throw new InvalidOperationException("Saldo insuficiente na carteira de origem.");

        var toWallet = _repo.GetWalletsByUser(userId)
                            .FirstOrDefault(w => w.CurrencySymbol.Equals(toCurrencySymbol, StringComparison.OrdinalIgnoreCase));

        if (toWallet == null)
        {
            toWallet = new Wallet { UserId = userId, Name = toCurrencySymbol, CurrencySymbol = toCurrencySymbol, Category = WalletCategory.Spot, Balance = 0 };
            toWallet = _repo.CreateWallet(toWallet);
        }

        string fromSymbol = fromWallet.CurrencySymbol;
        string toSymbol = toCurrencySymbol;
        
        decimal price;
        decimal amountToReceive;

        if (fromSymbol == "BRL") 
        {
            price = await GetPriceFromCurrencyApi(toSymbol);
            if (price == 0) throw new InvalidOperationException($"Preço para {toSymbol} é zero.");
            amountToReceive = amountToSpend / price;
        }
        else if (toSymbol == "BRL") 
        {
            price = await GetPriceFromCurrencyApi(fromSymbol);
            if (price == 0) throw new InvalidOperationException($"Preço para {fromSymbol} é zero.");
            amountToReceive = amountToSpend * price;
        }
        else 
        {
             var fromPriceBRL = await GetPriceFromCurrencyApi(fromSymbol);
             var toPriceBRL = await GetPriceFromCurrencyApi(toSymbol);
             if (fromPriceBRL == 0 || toPriceBRL == 0)
                throw new InvalidOperationException("Não foi possível obter os preços para a troca.");
             decimal valueInBRL = amountToSpend * fromPriceBRL;
             amountToReceive = valueInBRL / toPriceBRL;
        }

        var (updatedFromWallet, updatedToWallet) = _repo.ExecuteTrade(
            fromWalletId, toWallet.Id, amountToSpend, amountToReceive);
        
        return Tuple.Create(updatedFromWallet, updatedToWallet);
    }

    // --- MÉTODO DE HISTÓRICO (RF-09) ---
    public IEnumerable<WalletTransaction> GetTransactionsByUser(int userId)
    {
        // Simplesmente repassa a chamada para o repositório
        return _repo.GetTransactionsByUser(userId);
    }

    // --- Método auxiliar GetPriceFromCurrencyApi ---
    private async Task<decimal> GetPriceFromCurrencyApi(string symbol)
    {
        var client = _httpClientFactory.CreateClient();
        var response = await client.GetAsync(CurrencyApiUrl); 
        response.EnsureSuccessStatusCode();

        var stream = await response.Content.ReadAsStreamAsync();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var currencies = await JsonSerializer.DeserializeAsync<List<CurrencyPriceDTO>>(stream, options);
        
        var targetCurrency = currencies?.FirstOrDefault(c => c.Symbol.Equals(symbol, StringComparison.OrdinalIgnoreCase));
        
        if (targetCurrency?.Histories != null && targetCurrency.Histories.Any())
        {
            var latestPrice = targetCurrency.Histories
                                .OrderByDescending(h => h.Datetime)
                                .First().Price;
            return (decimal)latestPrice; // A API da CurrencyApi já retorna decimal
        }

        if (symbol == "BRL") return 1.0m; 
        
        throw new InvalidOperationException($"Preço para {symbol} não encontrado na CurrencyApi.");
    }

    // DTOs auxiliares internos
    private class CurrencyPriceDTO
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public List<HistoryPriceDTO> Histories { get; set; }
    }
    private class HistoryPriceDTO
    {
        public DateTime Datetime { get; set; }
        public decimal Price { get; set; } // Corrigido para decimal
    }
}