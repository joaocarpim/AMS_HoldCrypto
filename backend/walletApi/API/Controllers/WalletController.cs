using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq; 
using System.Threading.Tasks; 
using System.Collections.Generic; 
using System; 
using System.Net.Http; 
using System.Text.Json; 


namespace WalletApi.API.Controllers 
{
    [ApiController]
    [Route("api/[controller]")]
    public class WalletController : ControllerBase
    {
        private readonly IWalletService _walletService;
        private readonly IHttpClientFactory _httpClientFactory;

        public WalletController(IWalletService walletService, IHttpClientFactory httpClientFactory)
        {
            _walletService = walletService ?? throw new ArgumentNullException(nameof(walletService));
            _httpClientFactory = httpClientFactory;
        }

        // ===================================================================================
        // 🤖 ENDPOINT CHATBOT: DEPÓSITO
        // ===================================================================================
        [HttpPost("chatbot/deposit")]
        [Authorize] 
        public IActionResult ChatbotDeposit([FromBody] ChatbotDepositDTO dto)
        {
            try 
            {
                var userIdString = User.FindFirst("id")?.Value 
                                ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                                ?? User.FindFirst("sub")?.Value;

                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                    return Unauthorized(new { message = "Token inválido." });

                // 1. Busca carteiras
                var userWallets = _walletService.GetUserWallets(userId, null);
                
                // 2. Acha a carteira certa (Ex: BRL)
                var targetWallet = userWallets.FirstOrDefault(w => 
                    string.Equals(w.CurrencySymbol, dto.CurrencyCode, StringComparison.OrdinalIgnoreCase));

                if (targetWallet == null)
                    return NotFound(new { message = $"Carteira de {dto.CurrencyCode} não encontrada." });

                // 3. Deposita
                var success = _walletService.Deposit(targetWallet.Id, dto.Amount);

                if (!success) return BadRequest(new { message = "Falha no depósito." });

                return Ok(new { 
                    message = "Depósito realizado via Chatbot!", 
                    newBalance = targetWallet.Balance + dto.Amount 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { detail = ex.Message });
            }
        }

        // ===================================================================================
        // 💰 GET BALANCE: LÓGICA ESPELHADA DO FRONTEND (StatsCards.tsx)
        // ===================================================================================
        [HttpGet("balance")]
        public async Task<IActionResult> GetBalance()
        {
            try 
            {
                // 1. Identificar Usuário (Fallback para Admin ID 2 se testando sem token)
                int userId = 2; 
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id" || c.Type == "nameid");
                
                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int parsedId)) 
                {
                    userId = parsedId;
                }

                // 2. Buscar Carteiras do Banco Local
                var walletEntities = _walletService.GetUserWallets(userId, null);

                // 3. Buscar TODAS as Cotações da CurrencyAPI (Igual o Frontend faz)
                // Isso evita o erro 400 de buscar uma por uma.
                var client = _httpClientFactory.CreateClient();
                var pricesDictionary = await GetAllPricesDictionaryAsync(client);

                var assetsList = new List<object>();
                decimal totalBalanceBRL = 0;

                foreach (var wallet in walletEntities)
                {
                    decimal currentPrice = 0;

                    // Regra: BRL vale sempre 1.0 (Igual ao seu StatsCards.tsx)
                    if (string.Equals(wallet.CurrencySymbol, "BRL", StringComparison.OrdinalIgnoreCase)) 
                    {
                        currentPrice = 1.0m;
                    }
                    else 
                    {
                        // Tenta pegar do dicionário que baixamos
                        if (pricesDictionary.TryGetValue(wallet.CurrencySymbol.ToUpper(), out decimal apiPrice))
                        {
                            currentPrice = apiPrice;
                        }
                        else 
                        {
                            // Se não achou na API, usa Mock como último recurso
                            currentPrice = GetMockPriceFallback(wallet.CurrencySymbol);
                        }
                    }
                    
                    decimal walletValueBRL = wallet.Balance * currentPrice;
                    totalBalanceBRL += walletValueBRL;

                    assetsList.Add(new {
                        id = wallet.Id,
                        symbol = wallet.CurrencySymbol,
                        name = wallet.Name,
                        amount = wallet.Balance,
                        currentPriceBRL = currentPrice,
                        latestChangePercentage = 0.0 
                    });
                }

                return Ok(new {
                    totalBalanceBRL = totalBalanceBRL,
                    assets = assetsList
                });
            }
            catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        // ===================================================================================
        // 🔌 AUXILIAR: BUSCA LISTA COMPLETA (Bulk Fetch)
        // ===================================================================================
        private async Task<Dictionary<string, decimal>> GetAllPricesDictionaryAsync(HttpClient client)
        {
            var prices = new Dictionary<string, decimal>();

            try 
            {
                // Chama a rota que lista TUDO: GET /api/currency
                var response = await client.GetAsync("http://localhost:5105/api/currency");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(content);
                    
                    // O retorno é um Array de objetos Currency
                    if (doc.RootElement.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var element in doc.RootElement.EnumerateArray())
                        {
                            string symbol = element.GetProperty("symbol").GetString()?.ToUpper() ?? "";
                            
                            // Tenta ler o histórico mais recente ou o preço direto
                            decimal price = 0;

                            // Se a API retornar um campo "histories", pegamos o último
                            if (element.TryGetProperty("histories", out var histories) && histories.ValueKind == JsonValueKind.Array)
                            {
                                // Lógica simplificada: pega o último item do histórico se existir
                                var enumerator = histories.EnumerateArray();
                                if (enumerator.MoveNext()) 
                                {
                                    // Pega o último (supondo que venha ordenado ou seja o único relevante)
                                    var lastHistory = histories.EnumerateArray().LastOrDefault();
                                    if (lastHistory.ValueKind != JsonValueKind.Undefined && lastHistory.TryGetProperty("price", out var p))
                                    {
                                        price = p.GetDecimal();
                                    }
                                }
                            }
                            // Se tiver um campo "price" direto no objeto (fallback)
                            else if (element.TryGetProperty("price", out var directPrice))
                            {
                                price = directPrice.GetDecimal();
                            }

                            if (!string.IsNullOrEmpty(symbol) && price > 0)
                            {
                                prices[symbol] = price;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[WalletAPI] Erro ao sincronizar preços: {ex.Message}");
            }

            return prices;
        }

        private decimal GetMockPriceFallback(string symbol)
        {
            return symbol.ToUpper() switch {
                "BTC" => 580000.0m, "ETH" => 22000.0m, "SOL" => 1250.0m, "USDT" => 6.10m, "USD" => 6.10m, _ => 0.0m
            };
        }

        // ===================================================================================
        // 🌐 OUTROS MÉTODOS (GetWallets, Create, Withdraw, Transfer, History, Trade)
        // Mantenha-os aqui exatamente como estavam no seu arquivo original
        // ===================================================================================
        
        [HttpGet]
        public IActionResult GetUserWallets(int userId, string? category)
        {
            if (userId <= 0) userId = 1; 
            object parsedCategory = null;
            if (!string.IsNullOrEmpty(category) && Enum.TryParse(typeof(WalletCategory), category, true, out var cat)) parsedCategory = cat;
            
            var walletEntities = _walletService.GetUserWallets(userId, (WalletCategory?)parsedCategory);
            var walletDtos = walletEntities.Select(w => new WalletDTO { Id = w.Id, UserId = w.UserId, Name = w.Name, Category = w.Category, CurrencySymbol = w.CurrencySymbol, Balance = w.Balance }).ToList();
            return Ok(walletDtos);
        }

        [HttpPost]
        public IActionResult CreateWallet([FromBody] WalletDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var walletToCreate = new Wallet { UserId = dto.UserId, Name = dto.Name, Category = dto.Category, CurrencySymbol = dto.CurrencySymbol, Balance = dto.Balance };
            try { var created = _walletService.CreateWallet(walletToCreate); return Ok(new WalletDTO { Id = created.Id, UserId = created.UserId, Name = created.Name, Category = created.Category, CurrencySymbol = created.CurrencySymbol, Balance = created.Balance }); } catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpPost("{id}/deposit")]
        public IActionResult Deposit(int id, [FromBody] DepositWithdrawDTO dto) { var result = _walletService.Deposit(id, dto.Amount); if (!result) return Problem("Falha."); var updated = _walletService.GetWallet(id); return Ok(new { Balance = updated?.Balance ?? 0 }); }

        [HttpPost("{id}/withdraw")]
        public IActionResult Withdraw(int id, [FromBody] DepositWithdrawDTO dto) { var result = _walletService.Withdraw(id, dto.Amount); if (!result) return Problem("Falha."); var updated = _walletService.GetWallet(id); return Ok(new { Balance = updated?.Balance ?? 0 }); }

        [HttpPost("transfer")]
        public IActionResult Transfer([FromBody] TransferDTO dto) { var result = _walletService.Transfer(dto.FromWalletId, dto.ToWalletId, dto.Amount); if (!result) return Problem("Falha."); var from = _walletService.GetWallet(dto.FromWalletId); var to = _walletService.GetWallet(dto.ToWalletId); return Ok(new { FromBalance = from?.Balance ?? 0, ToBalance = to?.Balance ?? 0 }); }

        [HttpPost("trade")]
        public async Task<IActionResult> Trade([FromBody] TradeRequestDTO dto) { try { var (from, to) = await _walletService.PerformTrade(dto.UserId, dto.FromWalletId, dto.ToCurrencySymbol, dto.AmountToSpend); return Ok(new { status = "SUCCESS", newBalances = new Dictionary<string, decimal> { { from.CurrencySymbol, from.Balance }, { to.CurrencySymbol, to.Balance } } }); } catch (Exception ex) { return BadRequest(new { message = ex.Message }); } }

        [HttpGet("history")]
        public IActionResult GetTransactionHistory(int userId) { var transactions = _walletService.GetTransactionsByUser(userId); var dtos = transactions.Select(t => new WalletTransactionDTO { Id = t.Id, CreatedAt = t.CreatedAt, Type = t.Type, Amount = t.Amount, WalletId = t.WalletId, CurrencySymbol = t.Wallet?.CurrencySymbol ?? "N/A", Notes = t.Notes ?? "" }).ToList(); return Ok(dtos); }
    }

    // DTO EMBUTIDO (Para evitar erros de namespace)
    public class ChatbotDepositDTO
    {
        public decimal Amount { get; set; }
        public string CurrencyCode { get; set; } = string.Empty;
    }
}