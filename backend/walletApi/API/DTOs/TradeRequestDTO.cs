public class TradeRequestDTO
{
    public int UserId { get; set; } // Precisamos saber o user (idealmente viria do token)
    public int FromWalletId { get; set; } // ID da carteira de origem (ex: BRL)
    public string ToCurrencySymbol { get; set; } // Símbolo da moeda a comprar (ex: "BTC")
    public decimal AmountToSpend { get; set; } // Quanto da moeda de origem gastar (ex: 500 BRL)
}