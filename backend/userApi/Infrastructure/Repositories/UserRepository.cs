public class UserRepository : IUserRepository
{
    private readonly UserDbContext _context;

    public UserRepository(UserDbContext context)
    {
        _context = context;
    }

    public void Add(User user)
    {
        _context.Users.Add(user);
        _context.SaveChanges();
    }

    public User? GetById(int id) => _context.Users.Find(id);
}
