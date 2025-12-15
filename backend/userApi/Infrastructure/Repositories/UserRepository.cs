using System.Collections.Generic;
using System.Linq;
// --- ESTES SÃO OS IMPORTS QUE FALTAVAM ---
using UserApi.Domain.Entities;   // Para a classe 'User'
using UserApi.Domain.Interfaces; // Para a interface 'IUserRepository'
using UserApi.Infrastructure.Data; // Para o 'UserDbContext'

namespace UserApi.Infrastructure.Repositories
{
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

        // GetById retorna nulo se não achar
        public User? GetById(int id) => _context.Users.Find(id);

        // GetAll retorna uma lista
        // Nota: Se a interface pedir IEnumerable, List funciona pois List herda de IEnumerable
        public IEnumerable<User> GetAll() => _context.Users.ToList();

        public void Update(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }

        public User? GetByEmail(string email) => _context.Users.FirstOrDefault(u => u.Email == email);
    }
}