using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq; 
using System.Threading.Tasks; 
using System.Collections.Generic; 
using System; 

namespace WalletApi.API.Controllers 
{
    [ApiController]
    [Route("api/[controller]")]
    public class WalletController : ControllerBase
    {
        private readonly IWalletService _walletService;

        public WalletController(IWalletService walletService)
        {
            _walletService = walletService ?? throw new ArgumentNullException(nameof(walletService));
        }

        // ===================================================================================
        // 📱 DASHBOARD MOBILE - LÓGICA CORRIGIDA DE CÁLCULO
        // ===================================================================================
        [HttpGet("balance")]
        public IActionResult GetBalance()
        {
            try 
            {
                // 1. Força ID 2 (Seu usuário Admin com dados)
                int userId = 2; 
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id" || c.Type == "nameid");
                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int parsedId))
                {
                    userId = parsedId;
                }

                // 2. Busca as carteiras reais do banco
                var walletEntities = _walletService.GetUserWallets(userId, null);

                // 3. Prepara a lista de ativos calculando o valor correto para cada um
                var assetsList = new List<object>();
                decimal totalBalanceBRL = 0;

                foreach (var wallet in walletEntities)
                {
                    // Pega um preço fictício realista (já que a CurrencyApi não está integrada aqui ainda)
                    decimal currentPrice = GetMockPrice(wallet.CurrencySymbol);
                    
                    // Calcula o valor total dessa carteira em Reais
                    decimal walletValueBRL = wallet.Balance * currentPrice;

                    // Soma ao total geral
                    totalBalanceBRL += walletValueBRL;

                    assetsList.Add(new {
                        symbol = wallet.CurrencySymbol,
                        name = wallet.Name,
                        amount = wallet.Balance,
                        currentPriceBRL = currentPrice,
                        latestChangePercentage = GetMockVariation(wallet.CurrencySymbol)
                    });
                }

                Console.WriteLine($"Saldo Total Calculado: {totalBalanceBRL}");

                // 4. Retorna
                return Ok(new {
                    totalBalanceBRL = totalBalanceBRL,
                    assets = assetsList
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao calcular saldo: " + ex.Message });
            }
        }

        // FUNÇÃO AUXILIAR PARA PREÇOS FICTÍCIOS (Mas Realistas)
        private decimal GetMockPrice(string symbol)
        {
            return symbol.ToUpper() switch
            {
                "BRL" => 1.0m,          // Real vale 1 Real
                "BTC" => 560000.0m,     // Bitcoin ~ 560 mil
                "ETH" => 21000.0m,      // Ethereum ~ 21 mil
                "SOL" => 1200.0m,       // Solana ~ 1.200
                "USDT" => 6.10m,        // Dólar ~ 6,10
                _ => 10.0m              // Qualquer outra moeda desconhecida
            };
        }

        private double GetMockVariation(string symbol)
        {
            return symbol.ToUpper() switch
            {
                "BRL" => 0.0,
                "BTC" => 2.5,
                "ETH" => -1.2,
                "SOL" => 5.4,
                _ => 0.0
            };
        }

        // ===================================================================================
        // 🌐 ENDPOINTS EXISTENTES (MANTIDOS)
        // ===================================================================================

        [HttpGet]
        public IActionResult GetUserWallets(int userId, string? category)
        {
            if (userId <= 0) userId = 1; 
            WalletCategory? parsedCategory = null;
            if (!string.IsNullOrEmpty(category) && Enum.TryParse<WalletCategory>(category, true, out var cat))
                parsedCategory = cat;
            
            var walletEntities = _walletService.GetUserWallets(userId, parsedCategory);
            var walletDtos = walletEntities.Select(w => new WalletDTO
            {
                Id = w.Id, UserId = w.UserId, Name = w.Name, Category = w.Category,
                CurrencySymbol = w.CurrencySymbol, Balance = w.Balance
            }).ToList();
            return Ok(walletDtos);
        }

        [HttpPost]
        public IActionResult CreateWallet([FromBody] WalletDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var walletToCreate = new Wallet { UserId = dto.UserId, Name = dto.Name, Category = dto.Category, CurrencySymbol = dto.CurrencySymbol, Balance = dto.Balance < 0 ? 0 : dto.Balance };
            try {
                var created = _walletService.CreateWallet(walletToCreate);
                if (created == null) return Problem("Erro ao criar carteira.");
                return Ok(new WalletDTO { Id = created.Id, UserId = created.UserId, Name = created.Name, Category = created.Category, CurrencySymbol = created.CurrencySymbol, Balance = created.Balance });
            } catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpPost("{id}/deposit")]
        public IActionResult Deposit(int id, [FromBody] DepositWithdrawDTO dto)
        {
            if (id <= 0 || dto == null || dto.Amount <= 0) return BadRequest(new { message = "Dados inválidos." });
            var result = _walletService.Deposit(id, dto.Amount);
            if (!result) return Problem("Falha no depósito.");
            var updatedWallet = _walletService.GetWallet(id); 
            return Ok(new { Balance = updatedWallet?.Balance ?? 0 });
        }

        [HttpPost("{id}/withdraw")]
        public IActionResult Withdraw(int id, [FromBody] DepositWithdrawDTO dto)
        {
            if (id <= 0 || dto == null || dto.Amount <= 0) return BadRequest(new { message = "Dados inválidos." });
            var result = _walletService.Withdraw(id, dto.Amount);
            if (!result) return Problem("Falha no saque.");
            var updatedWallet = _walletService.GetWallet(id);
            return Ok(new { Balance = updatedWallet?.Balance ?? 0 });
        }

        [HttpPost("transfer")]
        public IActionResult Transfer([FromBody] TransferDTO dto)
        {
            if (dto == null || dto.Amount <= 0) return BadRequest(new { message = "Dados inválidos." });
            var result = _walletService.Transfer(dto.FromWalletId, dto.ToWalletId, dto.Amount);
            if (!result) return Problem("Transferência falhou.");
            var from = _walletService.GetWallet(dto.FromWalletId);
            var to = _walletService.GetWallet(dto.ToWalletId);
            return Ok(new { FromBalance = from?.Balance ?? 0, ToBalance = to?.Balance ?? 0 });
        }

        [HttpPost("trade")]
        public async Task<IActionResult> Trade([FromBody] TradeRequestDTO dto)
        {
            try {
                if (dto == null || dto.AmountToSpend <= 0) return BadRequest(new { message = "Dados inválidos." });
                var (from, to) = await _walletService.PerformTrade(dto.UserId, dto.FromWalletId, dto.ToCurrencySymbol, dto.AmountToSpend);
                return Ok(new { status = "SUCCESS", newBalances = new Dictionary<string, decimal> { { from.CurrencySymbol, from.Balance }, { to.CurrencySymbol, to.Balance } } });
            } catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpGet("history")]
        public IActionResult GetTransactionHistory(int userId)
        {
            if (userId <= 0) return BadRequest(new { message = "UserId inválido." });
            var transactions = _walletService.GetTransactionsByUser(userId);
            var transactionDtos = transactions.Select(t => new WalletTransactionDTO { Id = t.Id, CreatedAt = t.CreatedAt, Type = t.Type, Amount = t.Amount, WalletId = t.WalletId, CurrencySymbol = t.Wallet?.CurrencySymbol ?? "N/A", Notes = t.Notes ?? "" }).ToList();
            return Ok(transactionDtos);
        }
    }
}