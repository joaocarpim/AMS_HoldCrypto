using System.Collections.Generic;
// O IMPORT CORRETO É ESSE:
using UserApi.API.DTOs; 

namespace UserApi.Application.Interfaces
{
    public interface IUserService
    {
        UserDTO RegisterUser(UserDTO userDto);
        UserDTO? GetUserDetails(int id);
        List<UserDTO> GetAllUsers();
        UserDTO? UpdateUser(int id, UserDTO userDto);
        bool DeleteUser(int id);
        UserDTO? ValidateUser(string email, string password);
    }
}