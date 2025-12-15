namespace UserApi.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        // --- NOVO CAMPO ---
        // Define o nível de acesso. Padrão é "user".
        public string Role { get; set; } = "user"; 
        // ------------------

        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        
        // Mantendo opcionais conforme correção anterior
        public string? Password { get; set; }
        public string? Photo { get; set; }
    }
}