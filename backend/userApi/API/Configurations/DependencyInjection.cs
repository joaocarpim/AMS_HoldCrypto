using Microsoft.EntityFrameworkCore;

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