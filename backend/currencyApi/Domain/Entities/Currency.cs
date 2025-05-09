public class Currency
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool Status {get; set;}
    public Backing Backing { get; set; }
    
    public ICollection<History> Histories { get; set; }
}