public interface IWalletRepository
{
    IEnumerable<Wallet> GetWalletsByUser(int userId, WalletCategory? category = null);
    Wallet GetWalletById(int id);
    Wallet CreateWallet(Wallet wallet);
    bool UpdateWallet(Wallet wallet);
    bool DeleteWallet(int id);

    WalletTransaction CreateTransaction(WalletTransaction transaction);
    bool Transfer(int fromWalletId, int toWalletId, decimal amount);
}
