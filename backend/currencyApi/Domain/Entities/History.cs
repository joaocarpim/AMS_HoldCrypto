public class History
{
    public int Id { get; set; }
    public DateTime Datetime { get; set; }
    public double Price { get; set; }

    public int CurrencyId { get; set; }
    public Currency Currency { get; set; }
}