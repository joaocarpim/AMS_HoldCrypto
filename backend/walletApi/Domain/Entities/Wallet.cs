public enum WalletCategory
{
    Overview,
    Spot,
    Funding
}

public class Wallet
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; }
    public WalletCategory Category { get; set; }
    public decimal Balance { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<WalletTransaction> Transactions { get; set; } = new List<WalletTransaction>();
}
