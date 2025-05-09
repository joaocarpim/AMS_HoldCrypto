using Microsoft.EntityFrameworkCore;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ICurrencyRepository, CurrencyRepository>();
        services.AddScoped<ICurrencyService, CurrencyService>();
        services.AddDbContext<CurrencyDbContext>(options =>
            options.UseSqlite("Data Source=currencydb.sqlite"));
        return services;
    }
}