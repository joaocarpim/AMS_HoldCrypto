[ApiController]
[Route("api/[controller]")]
public class WalletController : ControllerBase
{
    private readonly WalletService _walletService;

    public WalletController(WalletService walletService)
    {
        _walletService = walletService;
    }

    [HttpGet]
    public async Task<IActionResult> GetWallets()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var wallets = await _walletService.GetWalletsAsync(userId);
        return Ok(wallets);
    }

    [HttpPost]
    public async Task<IActionResult> CreateWallet([FromBody] WalletDto walletDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await _walletService.CreateWalletAsync(userId, walletDto.Currency, walletDto.Balance);
        return Created("", walletDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWallet(int id, [FromBody] decimal balance)
    {
        await _walletService.UpdateWalletAsync(id, balance);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWallet(int id)
    {
        await _walletService.DeleteWalletAsync(id);
        return NoContent();
    }
}