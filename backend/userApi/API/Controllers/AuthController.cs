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
        var email = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var name = User.FindFirst(ClaimTypes.Name)?.Value;

    return Ok(new { user = name, email });
    }

    private string GenerateJwtToken(UserDTO user)
    {
        var jwtKey = _configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(jwtKey))
        {
            throw new Exception("JWT Key is missing in appsettings.json");
        }

        var key = Encoding.ASCII.GetBytes(jwtKey);
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, "Administrator")
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