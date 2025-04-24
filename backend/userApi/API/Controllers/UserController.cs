using Microsoft.AspNetCore.Mvc;
using System;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public IActionResult RegisterUser([FromBody] UserDTO userDto)
    {
        try
        {
            if (userDto == null)
            {
                return BadRequest(new { Message = "Dados do usuário estão incompletos." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Retorna mensagens de validação amigáveis
            }

            var result = _userService.RegisterUser(userDto);
            if (result == null)
            {
                return StatusCode(500, "Erro ao registrar usuário. Tente novamente mais tarde.");
            }

            return CreatedAtAction(nameof(GetUserDetails), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao registrar usuário: {ex.Message}");
            return StatusCode(500, new { Message = "Erro interno no servidor.", Details = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public IActionResult GetUserDetails(int id)
    {
        try
        {
            if (id <= 0)
            {
                return BadRequest(new { Message = "ID inválido fornecido." });
            }

            var user = _userService.GetUserDetails(id);
            if (user == null)
            {
                return NotFound(new { Message = $"Usuário com ID {id} não encontrado." });
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao buscar usuário: {ex.Message}");
            return StatusCode(500, new { Message = "Erro interno no servidor.", Details = ex.Message });
        }
    }

    [HttpGet]
    public IActionResult GetAllUsers()
    {
        try
        {
            var users = _userService.GetAllUsers();
            return Ok(users);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao listar usuários: {ex.Message}");
            return StatusCode(500, new { Message = "Erro interno no servidor.", Details = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, [FromBody] UserDTO userDto)
    {
        try
        {
            if (id <= 0)
            {
                return BadRequest(new { Message = "ID inválido fornecido." });
            }

            if (userDto == null)
            {
                return BadRequest(new { Message = "Dados do usuário estão incompletos." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedUser = _userService.UpdateUser(id, userDto);
            return updatedUser != null 
                ? Ok(updatedUser) 
                : NotFound(new { Message = $"Usuário com ID {id} não encontrado." });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao atualizar usuário: {ex.Message}");
            return StatusCode(500, new { Message = "Erro interno no servidor.", Details = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        try
        {
            if (id <= 0)
            {
                return BadRequest(new { Message = "ID inválido fornecido." });
            }

            var result = _userService.DeleteUser(id);
            return result 
                ? NoContent() 
                : NotFound(new { Message = $"Usuário com ID {id} não encontrado." });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao deletar usuário: {ex.Message}");
            return StatusCode(500, new { Message = "Erro interno no servidor.", Details = ex.Message });
        }
    }
}