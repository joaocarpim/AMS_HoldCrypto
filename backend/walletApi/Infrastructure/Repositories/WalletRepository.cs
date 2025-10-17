public class WalletRepository : IWalletRepository
{
    private readonly WalletDbContext _context;

    public WalletRepository(WalletDbContext context)
    {
        _context = context;
    }

    public IEnumerable<Wallet> GetWalletsByUser(int userId, WalletCategory? category = null)
    {
        var query = _context.Wallets.AsQueryable().Where(w => w.UserId == userId);
        if (category.HasValue)
            query = query.Where(w => w.Category == category.Value);
        return query.ToList();
    }

    public Wallet GetWalletById(int id)
    {
        return _context.Wallets.Find(id);
    }

    public Wallet CreateWallet(Wallet wallet)
    {
        _context.Wallets.Add(wallet);
        _context.SaveChanges();
        return wallet;
    }

    public bool UpdateWallet(Wallet wallet)
    {
        _context.Wallets.Update(wallet);
        return _context.SaveChanges() > 0;
    }

    public bool DeleteWallet(int id)
    {
        var w = _context.Wallets.Find(id);
        if (w == null) return false;
        _context.Wallets.Remove(w);
        return _context.SaveChanges() > 0;
    }

    public WalletTransaction CreateTransaction(WalletTransaction transaction)
    {
        // Update wallet balance accordingly
        var wallet = _context.Wallets.Find(transaction.WalletId);
        if (wallet == null) throw new InvalidOperationException("Wallet not found");

        if (transaction.Type == TransactionType.Deposit)
        {
            wallet.Balance += transaction.Amount;
        }
        else if (transaction.Type == TransactionType.Withdraw)
        {
            wallet.Balance -= transaction.Amount;
        }

        _context.WalletTransactions.Add(transaction);
        _context.SaveChanges();
        return transaction;
    }

    public bool Transfer(int fromWalletId, int toWalletId, decimal amount)
    {
        var from = _context.Wallets.Find(fromWalletId);
        var to = _context.Wallets.Find(toWalletId);
        if (from == null || to == null) return false;
        if (from.UserId != to.UserId) return false; // only same user
        if (from.Balance < amount) return false;

        from.Balance -= amount;
        to.Balance += amount;

        var txOut = new WalletTransaction
        {
            WalletId = fromWalletId,
            Type = TransactionType.Transfer,
            Amount = amount,
            FromWalletId = fromWalletId,
            ToWalletId = toWalletId,
            Notes = "Transfer out"
        };

        var txIn = new WalletTransaction
        {
            WalletId = toWalletId,
            Type = TransactionType.Transfer,
            Amount = amount,
            FromWalletId = fromWalletId,
            ToWalletId = toWalletId,
            Notes = "Transfer in"
        };

        _context.WalletTransactions.Add(txOut);
        _context.WalletTransactions.Add(txIn);

        _context.SaveChanges();
        return true;
    }
}
