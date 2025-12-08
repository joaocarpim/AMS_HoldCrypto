namespace UserApi.API.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        // --- NOVO CAMPO ---
        // O Frontend vai ler isso para saber se mostra o menu de Admin
        public string Role { get; set; } = "user"; 
        // ------------------

        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        
        // Mantendo opcionais (Nullables)
        public string? Password { get; set; }
        public string? Photo { get; set; }
    }
}