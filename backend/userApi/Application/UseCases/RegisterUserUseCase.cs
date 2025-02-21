public class RegisterUserUseCase
{
    private readonly IUserService _userService;

    public RegisterUserUseCase(IUserService userService)
    {
        _userService = userService;
    }

    public UserDTO Execute(UserDTO userDto) => _userService.RegisterUser(userDto);
}