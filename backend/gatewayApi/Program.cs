// No seu Program.cs do projeto Ocelot Gateway

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Carregar o ocelot.json
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

builder.Services.AddCors(options =>
{
    // Define uma política de CORS chamada "CorsPolicy"
    options.AddPolicy("CorsPolicy", policy =>
    {
        // Permite requisições de qualquer origem (qualquer domínio)
        policy.AllowAnyOrigin()
              // Permite qualquer método HTTP (GET, POST, PUT, DELETE, etc.)
              .AllowAnyMethod()
              // Permite qualquer cabeçalho na requisição
              .AllowAnyHeader();
    });
});

// --- Início da Configuração de Autenticação ---

// 1. Ler as configurações do appsettings.json
var jwtKey = builder.Configuration["Jwt:Key"];

// 2. Configurar o serviço de autenticação
builder.Services.AddAuthentication()
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,

            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });


// --- Fim da Configuração de Autenticação ---

builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

app.UseCors("CorsPolicy");

// Adicionar os middlewares na ordem correta
app.UseAuthentication();
app.UseAuthorization();

await app.UseOcelot();

app.Run();