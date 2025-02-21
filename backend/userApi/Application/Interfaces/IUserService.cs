public interface IUserService
{
    UserDTO RegisterUser(UserDTO userDto);
    UserDTO? GetUserDetails(int id);
}