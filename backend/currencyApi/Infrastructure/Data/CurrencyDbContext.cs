using Microsoft.EntityFrameworkCore;

public class CurrencyDbContext : DbContext
{
    public CurrencyDbContext(DbContextOptions<CurrencyDbContext> options) : base(options) { }
    public DbSet<Currency> Currency { get; set; }
    public DbSet<History> History {get; set;}
}