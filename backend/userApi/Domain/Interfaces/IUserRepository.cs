using System.Collections.Generic;
using UserApi.Domain.Entities;

namespace UserApi.Domain.Interfaces
{
    public interface IUserRepository
    {
        // Adicionamos '?' aqui para aceitar nulo
        User? GetById(int id);
        
        // Adicionamos '?' aqui também
        User? GetByEmail(string email);
        
        IEnumerable<User> GetAll();
        void Add(User user);
        void Update(User user);
        void Delete(int id);
    }
}