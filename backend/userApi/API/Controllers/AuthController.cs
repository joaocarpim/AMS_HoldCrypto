using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;

    public AuthController(IUserService userService, IConfiguration configuration)
    {
        _userService = userService;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDTO loginDto)
    {
        // Verifica se os dados fornecidos estão completos
        if (loginDto == null || string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
        {
            return BadRequest(new { message = "Dados de login incompletos." });
        }

        var user = _userService.ValidateUser(loginDto.Email, loginDto.Password);
        if (user == null)
        {
            return Unauthorized(new { message = "Email ou senha inválidos." });
        }

        var token = GenerateJwtToken(user);
        return Ok(new AuthResponseDTO { Token = token });
    }

    [Authorize]
    [HttpGet("profile")]
    public IActionResult GetProfile()
    {
        // Protege contra referências nulas
        var email = User?.Identity?.Name;
        if (string.IsNullOrEmpty(email))
        {
            return NotFound(new { message = "Perfil não encontrado." });
        }

        return Ok(new { message = "Rota protegida acessada!", user = email });
    }

    private string GenerateJwtToken(UserDTO user)
    {
        // Garantia de que a chave JWT está configurada
        var jwtKey = _configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(jwtKey))
        {
            throw new Exception("JWT Key está faltando no appsettings.json");
        }

        var key = Encoding.ASCII.GetBytes(jwtKey);
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Email ?? string.Empty), // Protege contra email nulo
            new Claim(ClaimTypes.Name, user.Name ?? string.Empty), // Protege contra nome nulo
            new Claim(ClaimTypes.Role, "Administrator") // Define um papel padrão
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(int.TryParse(_configuration["Jwt:ExpirationMinutes"], out var expiration) ? expiration : 60), // Expiração flexível
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}