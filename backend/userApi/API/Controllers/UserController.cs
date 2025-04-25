using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

     [HttpPost]
    public IActionResult RegisterUser(UserDTO userDto)
    {
        var result = _userService.RegisterUser(userDto);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public IActionResult GetUserDetails(int id)
    {
        var user = _userService.GetUserDetails(id);
        return user != null ? Ok(user) : NotFound();
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAllUsers()
    {
        var users = _userService.GetAllUsers();
        return Ok(users);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, UserDTO userDto)
    {
        var updatedUser = _userService.UpdateUser(id, userDto);
        return updatedUser != null ? Ok(updatedUser) : NotFound();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        var result = _userService.DeleteUser(id);
        return result ? NoContent() : NotFound();
    }
}