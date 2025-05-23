using Microsoft.EntityFrameworkCore;

public class CurrencyRepository : ICurrencyRepository
{
    private readonly CurrencyDbContext _context;

    public CurrencyRepository(CurrencyDbContext context)
    {
        _context = context;
    }
    public void Add(Currency currency)
    {
        _context.Currency.Add(currency);
        _context.SaveChanges();
    }

    public Currency? GetById(int id) => _context.Currency.Include(c => c.Histories)
    .FirstOrDefault(c => c.Id == id);

    public List<Currency> GetAll() => _context.Currency?.Include(c => c.Histories)
    .ToList() ?? new List<Currency>();

    public void Update(Currency currency)
    {
        _context.Currency.Update(currency);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var currency = _context.Currency.Find(id);
        if (currency != null)
        {
            _context.Currency.Remove(currency);
            _context.SaveChanges();
        }
    }
    
}