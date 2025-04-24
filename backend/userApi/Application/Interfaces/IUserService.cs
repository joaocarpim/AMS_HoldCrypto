public interface IUserService
{
    // Criação de um novo usuário
    UserDTO RegisterUser(UserDTO userDto);

    // Detalhes de um usuário específico por ID
    UserDTO? GetUserDetails(int id);

    // Listagem de todos os usuários
    List<UserDTO> GetAllUsers();

    // Atualização de um usuário específico
    UserDTO? UpdateUser(int id, UserDTO userDto);

    // Exclusão de um usuário por ID
    bool DeleteUser(int id);

    // Validação de credenciais para autenticação
    UserDTO? ValidateUser(string email, string password);
}