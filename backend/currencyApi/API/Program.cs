using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontEnd",
            builder =>
            {
                builder.WithOrigins("http://localhost:5105")
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
    });

// Configuração de injeção de dependências
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Currency API",
        Version = "v1",
        Description = "API para gerenciamento das moedas",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "AMS_HoldCrypto",
            Email = "null"
        }
    });
});

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