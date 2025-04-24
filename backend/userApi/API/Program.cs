using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Carregar chave JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? Environment.GetEnvironmentVariable("Jwt__Key");
if (string.IsNullOrEmpty(jwtKey))
{
    throw new Exception("A chave JWT (Jwt:Key) não foi configurada no appsettings.json ou nas variáveis de ambiente.");
}

// Configuração de CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Permitir requisições do frontend
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Adicionar controllers e serviços
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configuração do Swagger para documentação da API
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "User API",
        Version = "v1",
        Description = "API para gerenciamento de usuários",
        Contact = new OpenApiContact
        {
            Name = "Andre Souza",
            Email = "andre.souza99@fatec.sp.gov.br"
        }
    });
});

// Adicionando serviços customizados (ex.: IUserService -> UserService)
builder.Services.AddApplicationServices();

// Configuração da aplicação
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // Configuração do Swagger no modo de desenvolvimento
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "User API V1");
        options.RoutePrefix = string.Empty;
    });
}

// Configurações de pipeline
app.UseHttpsRedirection();
app.UseCors(); // Middleware de CORS para permitir chamadas externas
app.UseAuthorization();
app.MapControllers(); // Mapeia os endpoints de controllers

// Executar a aplicação
app.Run();