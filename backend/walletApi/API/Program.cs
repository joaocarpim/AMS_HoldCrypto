using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// --- Configuração de CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontEnd",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000", "http://localhost:3001")
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

// --- Configuração de Controllers e JSON ---
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

// --- Configuração do Swagger com Autenticação ---
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Wallet API", 
        Version = "v1",
        Description = "API de Carteiras, Transações e Integração Chatbot"
    });
    
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Insira o token JWT aqui. Exemplo: Bearer eyJhbGci..."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Injeção de Dependências (Services, Repositories, DB, HttpClient)
builder.Services.AddApplicationServices(); 

// --- Configuração de Autenticação JWT ---
var keyString = builder.Configuration["Jwt:Key"] ?? "santosmaiortimedomundotodogustavo_chave_secreta_padrao";
var key = Encoding.ASCII.GetBytes(keyString);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options => 
    { 
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Wallet API V1"); 
        options.RoutePrefix = string.Empty; 
    });
}

app.UseCors("AllowFrontEnd");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();