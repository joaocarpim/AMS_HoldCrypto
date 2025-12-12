using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

// SEM NAMESPACE EXPLICITO AQUI, para bater com o resto do seu projeto
public enum WalletCategory
{
    Overview,
    Spot,
    Funding
}

public class Wallet
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    public required string Name { get; set; }

    public WalletCategory Category { get; set; }

    public required string CurrencySymbol { get; set; } // Sua propriedade nova

    [Column(TypeName = "decimal(18,8)")]
    public decimal Balance { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Assumindo que WalletTransaction também é global
    public ICollection<WalletTransaction> Transactions { get; set; } = new List<WalletTransaction>();
}