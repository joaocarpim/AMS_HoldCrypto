using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection; // Necessário para IServiceCollection

// --- ADICIONE ESTES IMPORTS PARA ELE ENCONTRAR AS CLASSES ---
using UserApi.Domain.Interfaces;           // Para IUserRepository
using UserApi.Infrastructure.Repositories; // Para UserRepository
using UserApi.Application.Interfaces;      // Para IUserService
using UserApi.Application.Services;        // Para UserService
using UserApi.Infrastructure.Data;         // Para UserDbContext

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUserService, UserService>();
        services.AddDbContext<UserDbContext>(options =>
            options.UseSqlite("Data Source=userdb.sqlite"));
        return services;
    }
}