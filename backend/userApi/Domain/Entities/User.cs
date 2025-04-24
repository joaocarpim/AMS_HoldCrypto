using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty; // Solução: Adicionar valor padrão

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty; // Solução: Adicionar valor padrão

    [Required]
    public string Phone { get; set; } = string.Empty; // Solução: Adicionar valor padrão

    [Required]
    public string Address { get; set; } = string.Empty; // Solução: Adicionar valor padrão

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty; // Solução: Adicionar valor padrão

    public string Photo { get; set; } = string.Empty; // Solução: Adicionar valor padrão
}