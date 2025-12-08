// Caminho: backend/walletApi/API/Controllers/WalletController.cs
using Microsoft.AspNetCore.Mvc;
using System.Linq; 
using System.Threading.Tasks; 
using System.Collections.Generic; 
using System; 

[ApiController]
[Route("api/[controller]")]
public class WalletController : ControllerBase
{
    private readonly IWalletService _walletService;

    public WalletController(IWalletService walletService)
    {
        _walletService = walletService ?? throw new ArgumentNullException(nameof(walletService));
    }

    // GET /api/Wallet?userId=123&category=Spot
    [HttpGet]
    public IActionResult GetUserWallets(int userId, string? category)
    {
        if (userId <= 0) return BadRequest(new { message = "UserId inválido." });

        WalletCategory? parsedCategory = null;
        if (!string.IsNullOrEmpty(category) && Enum.TryParse<WalletCategory>(category, true, out var cat))
        {
            parsedCategory = cat;
        }
        
        var walletEntities = _walletService.GetUserWallets(userId, parsedCategory);

        var walletDtos = walletEntities.Select(w => new WalletDTO
        {
            Id = w.Id,
            UserId = w.UserId,
            Name = w.Name,
            Category = w.Category,
            CurrencySymbol = w.CurrencySymbol,
            Balance = w.Balance
        }).ToList();

        return Ok(walletDtos);
    }

    // POST /api/Wallet
    [HttpPost]
    public IActionResult CreateWallet([FromBody] WalletDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var walletToCreate = new Wallet
        {
            UserId = dto.UserId,
            Name = dto.Name,
            Category = dto.Category,
            CurrencySymbol = dto.CurrencySymbol,
            Balance = dto.Balance < 0 ? 0 : dto.Balance 
        };

        try
        {
            var createdWalletEntity = _walletService.CreateWallet(walletToCreate);
            if (createdWalletEntity == null) return Problem("Não foi possível criar a carteira.");

            return Ok(new WalletDTO
            {
                Id = createdWalletEntity.Id,
                UserId = createdWalletEntity.UserId,
                Name = createdWalletEntity.Name,
                Category = createdWalletEntity.Category,
                CurrencySymbol = createdWalletEntity.CurrencySymbol,
                Balance = createdWalletEntity.Balance
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
             Console.WriteLine($"Erro inesperado em CreateWallet: {ex.Message}");
             return Problem("Ocorreu um erro inesperado ao criar a carteira.");
        }
    }

    // POST /api/Wallet/{id}/deposit
    [HttpPost("{id}/deposit")]
    public IActionResult Deposit(int id, [FromBody] DepositWithdrawDTO dto)
    {
        if (id <= 0 || dto == null || dto.Amount <= 0) return BadRequest(new { message = "Dados inválidos." });

        var walletExists = _walletService.GetWallet(id);
        if (walletExists == null) return NotFound(new { message = "Carteira não encontrada." });

        var result = _walletService.Deposit(id, dto.Amount);
        if (!result) return Problem("Falha no depósito.");

        var updatedWallet = _walletService.GetWallet(id); 
        return Ok(new { Balance = updatedWallet?.Balance ?? 0 });
    }

    // POST /api/Wallet/{id}/withdraw
    [HttpPost("{id}/withdraw")]
    public IActionResult Withdraw(int id, [FromBody] DepositWithdrawDTO dto)
    {
        if (id <= 0 || dto == null || dto.Amount <= 0) return BadRequest(new { message = "Dados inválidos." });

        var walletExists = _walletService.GetWallet(id);
        if (walletExists == null) return NotFound(new { message = "Carteira não encontrada." });
        if (walletExists.Balance < dto.Amount) return BadRequest(new { message = "Saldo insuficiente." });

        var result = _walletService.Withdraw(id, dto.Amount);
        if (!result) return Problem("Falha no saque.");

        var updatedWallet = _walletService.GetWallet(id);
        return Ok(new { Balance = updatedWallet?.Balance ?? 0 });
    }

    // POST /api/Wallet/transfer
    [HttpPost("transfer")]
    public IActionResult Transfer([FromBody] TransferDTO dto)
    {
        if (dto == null || dto.Amount <= 0) return BadRequest(new { message = "Dados inválidos." });

        var result = _walletService.Transfer(dto.FromWalletId, dto.ToWalletId, dto.Amount);
        if (!result) return Problem("Transferência falhou.");

        var fromWallet = _walletService.GetWallet(dto.FromWalletId);
        var toWallet = _walletService.GetWallet(dto.ToWalletId);

        return Ok(new { FromBalance = fromWallet?.Balance ?? 0, ToBalance = toWallet?.Balance ?? 0 });
    }

    // POST /api/Wallet/trade
    [HttpPost("trade")]
    public async Task<IActionResult> Trade([FromBody] TradeRequestDTO dto)
    {
        try
        {
            if (dto == null || dto.AmountToSpend <= 0) return BadRequest(new { message = "Dados inválidos." });
            if (dto.UserId <= 0) return BadRequest(new { message = "UserId inválido."});

            var (fromWallet, toWallet) = await _walletService.PerformTrade(dto.UserId, dto.FromWalletId, dto.ToCurrencySymbol, dto.AmountToSpend);

            return Ok(new 
            {
                status = "SUCCESS",
                newBalances = new Dictionary<string, decimal> {
                    { fromWallet.CurrencySymbol, fromWallet.Balance },
                    { toWallet.CurrencySymbol, toWallet.Balance }
                }
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
             Console.WriteLine($"Erro inesperado no Trade: {ex.Message}");
             return Problem("Erro interno no trade.");
        }
    }

    // *** NOVO ENDPOINT ADICIONADO (RF-09) ***
    [HttpGet("history")]
    public IActionResult GetTransactionHistory(int userId)
    {
        if (userId <= 0) return BadRequest(new { message = "UserId inválido." });

        // Chama o serviço (que chama o repositório)
        var transactions = _walletService.GetTransactionsByUser(userId);

        // Mapeia as entidades para o DTO de resposta
        var transactionDtos = transactions.Select(t => new WalletTransactionDTO
        {
            Id = t.Id,
            CreatedAt = t.CreatedAt,
            Type = t.Type,
            Amount = t.Amount,
            WalletId = t.WalletId,
            // Pega o símbolo da carteira (usando navegação segura ?.)
            CurrencySymbol = t.Wallet?.CurrencySymbol ?? "N/A",
            Notes = t.Notes ?? ""
        }).ToList();

        return Ok(transactionDtos);
    }
}