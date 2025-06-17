public class Currency
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Symbol { get; set; } // NOVO CAMPO
    public string Description { get; set; }
    public bool Status { get; set; }
    public Backing Backing { get; set; }
    public ICollection<History> Histories { get; set; }
}