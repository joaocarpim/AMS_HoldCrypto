public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public UserDTO RegisterUser(UserDTO userDto)
    {
        var user = new User { Name = userDto.Name, Email = userDto.Email };
        _userRepository.Add(user);
        return userDto;
    }

    public UserDTO? GetUserDetails(int id)
    {
        var user = _userRepository.GetById(id);
        return user != null ? new UserDTO { Name = user.Name, Email = user.Email } : null;
    }
}