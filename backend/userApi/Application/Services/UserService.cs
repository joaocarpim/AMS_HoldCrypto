using System.Linq;

public class UserService : IUserService
{
    private readonly UserDbContext _context;

    public UserService(UserDbContext context)
    {
        _context = context;
    }

    public UserDTO RegisterUser(UserDTO userDto)
    {
        var user = new User
        {
            Name = userDto.Name,
            Email = userDto.Email,
            Phone = userDto.Phone,
            Address = userDto.Address,
            Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
            Photo = userDto.Photo
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Photo = user.Photo
        };
    }

    public UserDTO? GetUserDetails(int id)
    {
        var user = _context.Users.Find(id);
        if (user == null) return null;

        return new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Photo = user.Photo
        };
    }

    public List<UserDTO> GetAllUsers()
    {
        return _context.Users.Select(user => new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Photo = user.Photo
        }).ToList();
    }

    public UserDTO? UpdateUser(int id, UserDTO userDto)
    {
        var user = _context.Users.Find(id);
        if (user == null) return null;

        user.Name = userDto.Name;
        user.Email = userDto.Email;
        user.Phone = userDto.Phone;
        user.Address = userDto.Address;
        user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
        user.Photo = userDto.Photo;

        _context.SaveChanges();
        return GetUserDetails(id);
    }

    public bool DeleteUser(int id)
    {
        var user = _context.Users.Find(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        _context.SaveChanges();
        return true;
    }

    public UserDTO? ValidateUser(string email, string password)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password)) return null;

        return new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Photo = user.Photo
        };
    }
}