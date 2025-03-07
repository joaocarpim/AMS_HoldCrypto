public interface IUserRepository
{
     void Add(User user);
    User? GetById(int id);
    List<User> GetAll();
    void Update(User user);
    void Delete(int id);
}