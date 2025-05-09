    public class HistoryRepository : IHistoryRepository
    {
        private readonly CurrencyDbContext _context;

        public HistoryRepository(CurrencyDbContext context)
        {
            _context = context;
        }
        public void Add(History history)
        {
            _context.History.Add(history);
            _context.SaveChanges();
        }

        public History? GetById(int id) => _context.History.Find(id);

        public List<History> GetAll() => _context.History.ToList();

        public void Update(History history)
        {
            _context.History.Update(history);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var history = _context.History.Find(id);
            if (history != null)
            {
                _context.History.Remove(history);
                _context.SaveChanges();
            }
        }
        
    }