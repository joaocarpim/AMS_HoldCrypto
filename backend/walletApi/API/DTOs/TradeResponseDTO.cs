public class TradeResponseDTO
{
    public WalletDTO FromWallet { get; set; } // Carteira de origem atualizada
    public WalletDTO ToWallet { get; set; }   // Carteira de destino atualizada
    public decimal PriceUsed { get; set; }      // Preço de conversão
    public decimal AmountReceived { get; set; } // Quanto de cripto foi recebido
}