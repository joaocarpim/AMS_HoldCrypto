// Caminho: backend/walletApi/API/DTOs/WalletDTO.cs

public class WalletDTO
{
    // ****** ADICIONADO ******
    public int Id { get; set; } // Adiciona o ID da carteira
    // ************************

    public int UserId { get; set; }
    public required string Name { get; set; }
    public required string CurrencySymbol { get; set; }
    public WalletCategory Category { get; set; }
    public decimal Balance { get; set; }
}