using Microsoft.EntityFrameworkCore;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IWalletRepository, WalletRepository>();
        services.AddScoped<IWalletService, WalletService>();

        services.AddDbContext<WalletDbContext>(options =>
            options.UseSqlite("Data Source=walletdb.sqlite"));

        services.AddHttpClient();

        return services;
    }
}
