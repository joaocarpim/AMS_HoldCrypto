public class GetUserDetailsUseCase
{
    private readonly IUserService _userService;

    public GetUserDetailsUseCase(IUserService userService)
    {
        _userService = userService;
    }

    public UserDTO? Execute(int id) => _userService.GetUserDetails(id);
}
