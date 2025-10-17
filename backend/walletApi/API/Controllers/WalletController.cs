using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class WalletController : ControllerBase
{
    private readonly IWalletService _walletService;

    public WalletController(IWalletService walletService)
    {
        _walletService = walletService;
    }

    [HttpGet]
    public IActionResult GetUserWallets(int userId, string? category)
    {
        WalletCategory? cat = null;
        if (!string.IsNullOrEmpty(category) && Enum.TryParse<WalletCategory>(category, true, out var parsed))
            cat = parsed;

        var wallets = _walletService.GetUserWallets(userId, cat);
        return Ok(wallets);
    }

    [HttpPost]
    public IActionResult CreateWallet(WalletDTO dto)
    {
        var wallet = new Wallet
        {
            UserId = dto.UserId,
            Name = dto.Name,
            Category = dto.Category,
            Balance = dto.Balance
        };
        var created = _walletService.CreateWallet(wallet);
        return Ok(created);
    }

    [HttpPost("{id}/deposit")]
    public IActionResult Deposit(int id, DepositWithdrawDTO dto)
    {
        var result = _walletService.Deposit(id, dto.Amount);
        return result ? Ok(new { Balance = _walletService.GetWallet(id).Balance }) : BadRequest();
    }

    [HttpPost("{id}/withdraw")]
    public IActionResult Withdraw(int id, DepositWithdrawDTO dto)
    {
        var result = _walletService.Withdraw(id, dto.Amount);
        return result ? Ok(new { Balance = _walletService.GetWallet(id).Balance }) : BadRequest();
    }

    [HttpPost("transfer")]
    public IActionResult Transfer(TransferDTO dto)
    {
        var result = _walletService.Transfer(dto.FromWalletId, dto.ToWalletId, dto.Amount);
        if (!result) return BadRequest();
        return Ok(new
        {
            From = _walletService.GetWallet(dto.FromWalletId).Balance,
            To = _walletService.GetWallet(dto.ToWalletId).Balance
        });
    }
}
