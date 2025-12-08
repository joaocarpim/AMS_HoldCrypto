// Caminho: backend/walletApi/API/DTOs/WalletTransactionDTO.cs
using System;

// O enum TransactionType já deve estar acessível globalmente
// (definido no seu WalletTransaction.cs)

public class WalletTransactionDTO
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public TransactionType Type { get; set; } // Deve encontrar o enum global
    public decimal Amount { get; set; }
    
    public int WalletId { get; set; }
    
    public string CurrencySymbol { get; set; } = ""; 
    public string Notes { get; set; } = "";
}