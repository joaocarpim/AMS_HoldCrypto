// CORREÇÃO: Usando o namespace exato onde o DTO está
using UserApi.API.DTOs; 
using UserApi.Application.Interfaces;

namespace UserApi.Application.UseCases
{
    public class RegisterUserUseCase
    {
        private readonly IUserService _userService;

        public RegisterUserUseCase(IUserService userService)
        {
            _userService = userService;
        }

        public UserDTO Execute(UserDTO userDto)
        {
            return _userService.RegisterUser(userDto);
        }
    }
}