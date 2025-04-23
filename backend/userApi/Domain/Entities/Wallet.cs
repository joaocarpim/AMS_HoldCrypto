public class Wallet
{
    public int Id { get; set; }
    public string UserId { get; set; } 
    public string Currency { get; set; } 
    public decimal Balance { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}