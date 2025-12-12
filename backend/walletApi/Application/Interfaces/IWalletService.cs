public interface IWalletService

{
    IEnumerable<Wallet> GetUserWallets(int userId, WalletCategory? category = null);
    Wallet GetWallet(int id);
    Wallet CreateWallet(Wallet wallet);
    bool Deposit(int walletId, decimal amount);
    bool Withdraw(int walletId, decimal amount);
    bool Transfer(int fromWalletId, int toWalletId, decimal amount);

    // *** NOVO MÉTODO PARA TRADE (RF-05) ***
    // (Usamos Task<> porque este método vai fazer uma chamada HTTP assíncrona)
    Task<Tuple<Wallet, Wallet>> PerformTrade(int userId, int fromWalletId, string toCurrencySymbol, decimal amountToSpend);

    IEnumerable<WalletTransaction> GetTransactionsByUser(int userId);
}
