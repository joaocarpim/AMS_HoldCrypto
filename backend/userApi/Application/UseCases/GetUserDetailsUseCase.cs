using UserApi.API.DTOs; // <--- O SEGREDO ESTÁ AQUI
using UserApi.Application.Interfaces;

namespace UserApi.Application.UseCases
{
    public class GetUserDetailsUseCase
    {
        private readonly IUserService _userService;

        public GetUserDetailsUseCase(IUserService userService)
        {
            _userService = userService;
        }

        public UserDTO? Execute(int id)
        {
            return _userService.GetUserDetails(id);
        }
    }
}