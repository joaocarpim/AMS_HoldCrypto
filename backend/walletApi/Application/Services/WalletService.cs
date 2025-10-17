public class WalletService : IWalletService
{
    private readonly IWalletRepository _repo;

    public WalletService(IWalletRepository repo)
    {
        _repo = repo;
    }

    public IEnumerable<Wallet> GetUserWallets(int userId, WalletCategory? category = null)
    {
        return _repo.GetWalletsByUser(userId, category);
    }

    public Wallet GetWallet(int id)
    {
        return _repo.GetWalletById(id);
    }

    public Wallet CreateWallet(Wallet wallet)
    {
        return _repo.CreateWallet(wallet);
    }

    public bool Deposit(int walletId, decimal amount)
    {
        var tx = new WalletTransaction
        {
            WalletId = walletId,
            Type = TransactionType.Deposit,
            Amount = amount
        };
        _repo.CreateTransaction(tx);
        return true;
    }

    public bool Withdraw(int walletId, decimal amount)
    {
        var wallet = _repo.GetWalletById(walletId);
        if (wallet == null || wallet.Balance < amount) return false;
        var tx = new WalletTransaction
        {
            WalletId = walletId,
            Type = TransactionType.Withdraw,
            Amount = amount
        };
        _repo.CreateTransaction(tx);
        return true;
    }

    public bool Transfer(int fromWalletId, int toWalletId, decimal amount)
    {
        return _repo.Transfer(fromWalletId, toWalletId, amount);
    }
}
