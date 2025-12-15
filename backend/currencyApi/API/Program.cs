using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
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

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Garante que Enums (BRL, USD) apareçam como texto no JSON
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

// --- Configuração do Swagger ---
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Currency API",
        Version = "v1",
        Description = "API de Cotações em Tempo Real e Histórico (Worker Service)",
        Contact = new OpenApiContact
        {
            Name = "AMS_HoldCrypto",
            Email = "admin@holdcrypto.com"
        }
    });
});

// Injeção de Dependências (DB, Services, BackgroundWorker)
builder.Services.AddApplicationServices();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Currency API V1");
        options.RoutePrefix = string.Empty;
    });
}

app.UseCors("AllowFrontEnd");
app.UseHttpsRedirection();

app.MapControllers();

app.Run();