public interface IUserService
{
    UserDTO RegisterUser(UserDTO userDto);
    UserDTO? GetUserDetails(int id);
    List<UserDTO> GetAllUsers();
    UserDTO? UpdateUser(int id, UserDTO userDto);
    bool DeleteUser(int id);
}