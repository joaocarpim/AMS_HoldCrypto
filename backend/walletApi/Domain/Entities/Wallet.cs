// Caminho: backend/walletApi/Domain/Entities/Wallet.cs
using System.Collections.Generic; // Adicionado para ICollection
using System; // Adicionado para DateTime

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
    public required string Name { get; set; } // 'required' adicionado
    public WalletCategory Category { get; set; }

    // ****** NOVA PROPRIEDADE ******
    public required string CurrencySymbol { get; set; } // 'required' adicionado
    // *****************************

    public decimal Balance { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<WalletTransaction> Transactions { get; set; } = new List<WalletTransaction>();
}