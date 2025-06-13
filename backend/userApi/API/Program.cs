using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"] ?? throw new ArgumentNullException("Jwt:Key is missing"));

// Configuração de autenticação JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// Configuração de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontEnd",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000") // Permite que o frontend acesse o backend
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

// Configuração de injeção de dependências
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configuração do Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "User API",
        Version = "v1",
        Description = "API para gerenciamento de usuários",
        Contact = new OpenApiContact
        {
            Name = "AMS_HoldCrypto",
            Email = "null"
        }
    });
});

// Adiciona os serviços da aplicação (caso tenha mais serviços customizados)
builder.Services.AddApplicationServices();

var app = builder.Build();

// Configuração do ambiente de desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "User API V1");
        options.RoutePrefix = string.Empty; // Isso garante que o Swagger UI apareça na raiz
    });
}

// Configuração de middleware
app.UseCors("AllowFrontEnd");  // Aplica o CORS para permitir requisições do frontend
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();  // Mapeia os controllers da API
app.Run();
