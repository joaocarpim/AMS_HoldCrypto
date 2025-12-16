using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // <--- CORREÇÃO 1: O Import que faltava
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserApi.API.DTOs;
using UserApi.Application.Interfaces;

namespace UserApi.API.Controllers
{
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
        public IActionResult Login([FromBody] UserDTO loginDto) 
        {
            // Valida se veio preenchido
            if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
            {
                return Unauthorized(new { message = "Email e senha são obrigatórios." });
            }

            // O '!' diz que garantimos que password não é nulo aqui
            var user = _userService.ValidateUser(loginDto.Email, loginDto.Password!);

                       if (user == null)
            {
                return Unauthorized(new { message = "Email ou senha inválidos." });
            }
            
            var token = GenerateJwtToken(user);
            
            return Ok(new { Token = token }); 
        }

        [Authorize] // Agora isso vai funcionar com o 'using' lá em cima
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var name = User.FindFirst(ClaimTypes.Name)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Token inválido: ID de usuário não encontrado.");
            }

            return Ok(new { 
                id = int.Parse(userId), 
                user = name, 
                email = email,
                role = role 
            });
        }

        private string GenerateJwtToken(UserDTO user)
        {
            var jwtKey = _configuration["Jwt:Key"];
            
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new Exception("JWT Key is missing in appsettings.json");
            }

            // CORREÇÃO 2: Adicionamos '!' (jwtKey!) para dizer ao compilador que não é nulo
            var key = Encoding.ASCII.GetBytes(jwtKey!);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), 
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role) 
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
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
}