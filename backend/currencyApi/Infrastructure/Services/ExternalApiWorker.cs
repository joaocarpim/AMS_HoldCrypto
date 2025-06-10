using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

public class ExternalApiWorker : BackgroundService
{
    private const int IntervalSeconds = 10;

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _cryptoPricesUrl;
    private readonly List<string> _symbols;
    private readonly IServiceProvider _serviceProvider;

    public ExternalApiWorker(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        IServiceProvider serviceProvider)
    {
        _httpClientFactory = httpClientFactory;
        _cryptoPricesUrl = configuration["ExternalApi:CryptoPricesUrl"];
        _symbols = configuration.GetSection("ExternalApi:Symbols").Get<List<string>>() ?? new List<string>();
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        Console.WriteLine("Serviço de consulta de criptomoedas iniciado.");

        var client = _httpClientFactory.CreateClient();

        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var currencyService = scope.ServiceProvider.GetRequiredService<ICurrencyService>();
                var historyService = scope.ServiceProvider.GetRequiredService<IHistoryService>();

                var allCurrencies = currencyService.GetAllCurrency();

                foreach (var symbol in _symbols)
                {
                    try
                    {
                        var url = $"{_cryptoPricesUrl}?symbol={symbol}";
                        var response = await client.GetAsync(url, stoppingToken);

                        if (response.IsSuccessStatusCode)
                        {
                            var content = await response.Content.ReadAsStringAsync(stoppingToken);
                            var json = System.Text.Json.JsonDocument.Parse(content);
                            var priceStr = json.RootElement.GetProperty("price").GetString();

                            if (decimal.TryParse(priceStr, out decimal price))
                            {
                                Console.WriteLine($"[{DateTime.Now}] {symbol}: {price}");

                                var currency = allCurrencies.FirstOrDefault(c => c.Name == symbol);
                                if (currency != null)
                                {
                                    historyService.RegisterHistory(new HistoryDTO
                                    {
                                        Datetime = DateTime.UtcNow,
                                        Price = (double)price
                                    }, currency.Id);
                                }
                                else
                                {
                                    Console.WriteLine($"Moeda '{symbol}' não encontrada. Cadastre-a manualmente.");
                                }
                            }
                            else
                            {
                                Console.WriteLine($"Erro ao converter o preço de {symbol}.");
                            }
                        }
                        else
                        {
                            Console.WriteLine($"Erro ao consultar {symbol}: {response.StatusCode}");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Erro ao processar {symbol}: {ex.Message}");
                    }
                }
            }

            await Task.Delay(TimeSpan.FromSeconds(IntervalSeconds), stoppingToken);
        }

        Console.WriteLine("Serviço de consulta de criptomoedas finalizado.");
    }
}
