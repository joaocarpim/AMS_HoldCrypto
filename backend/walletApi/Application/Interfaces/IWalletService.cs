public interface IWalletService
{
    IEnumerable<Wallet> GetUserWallets(int userId, WalletCategory? category = null);
    Wallet GetWallet(int id);
    Wallet CreateWallet(Wallet wallet);
    bool Deposit(int walletId, decimal amount);
    bool Withdraw(int walletId, decimal amount);
    bool Transfer(int fromWalletId, int toWalletId, decimal amount);
}
