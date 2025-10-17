public enum TransactionType
{
    Deposit,
    Withdraw,
    Transfer
}

public class WalletTransaction
{
    public int Id { get; set; }
    public int WalletId { get; set; }
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // For transfers
    public int? FromWalletId { get; set; }
    public int? ToWalletId { get; set; }
    public string? Notes { get; set; }

    public Wallet Wallet { get; set; }
}
