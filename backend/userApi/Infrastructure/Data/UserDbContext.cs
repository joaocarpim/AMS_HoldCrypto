using Microsoft.EntityFrameworkCore;
using UserApi.Domain.Entities; 

// O namespace PRECISA ser exatamente este para o UserRepository encontrar:
namespace UserApi.Infrastructure.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
    }
}