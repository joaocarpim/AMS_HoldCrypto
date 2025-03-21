using Microsoft.EntityFrameworkCore;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IBalanceRepository, BalanceRepository>();
        services.AddScoped<IBalanceService, BalanceService>();
        services.AddDbContext<BalanceDbContext>(options =>
            options.UseSqlite("Data Source=Balancedb.sqlite"));
        return services;
    }
}