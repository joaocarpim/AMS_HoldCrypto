using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

public class ExternalApiWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IHttpClientFactory _httpClientFactory;
    private const int IntervalSeconds = 60;
    private const string _cryptoPricesUrl = "https://api.binance.com/api/v3/ticker/price";

    public ExternalApiWorker(IServiceProvider serviceProvider, IHttpClientFactory httpClientFactory)
    {
        _serviceProvider = serviceProvider;
        _httpClientFactory = httpClientFactory;
    }

    private string GetBinanceSymbol(string symbol, string backing)
    {
        // Binance só aceita USDT, BRL, BUSD, EUR, TRY, TUSD, etc.
        // Os mais comuns: USDT, BRL, BUSD, EUR
        // Adapte conforme o que você quer suportar
        if (backing == "USD") return symbol.ToUpper() + "USDT";
        if (backing == "BRL") return symbol.ToUpper() + "BRL";
        if (backing == "EUR") return symbol.ToUpper() + "EUR";
        if (backing == "JPY") return symbol.ToUpper() + "JPY";
        if (backing == "ARS") return symbol.ToUpper() + "ARS";
        if (backing == "CNY") return symbol.ToUpper() + "USDT"; // Binance não tem CNY, usar USDT
        return symbol.ToUpper() + "USDT";
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

                // Busca todas as moedas ativas do banco
                var allCurrencies = currencyService.GetAllCurrency()
                    .Where(c => c.Status)
                    .ToList();

                foreach (var currency in allCurrencies)
                {
                    try
                    {
                        var binanceSymbol = GetBinanceSymbol(currency.Symbol, currency.Backing.ToString());

                        var url = $"{_cryptoPricesUrl}?symbol={binanceSymbol}";
                        var response = await client.GetAsync(url, stoppingToken);

                        if (response.IsSuccessStatusCode)
                        {
                            var content = await response.Content.ReadAsStringAsync(stoppingToken);
                            var json = System.Text.Json.JsonDocument.Parse(content);
                            var priceStr = json.RootElement.GetProperty("price").GetString();

                            if (decimal.TryParse(priceStr, out decimal price))
                            {
                                Console.WriteLine($"[{DateTime.Now}] {binanceSymbol}: {price}");

                                // Cria histórico para a moeda
                                historyService.RegisterHistory(new HistoryDTO
                                {
                                    Datetime = DateTime.UtcNow,
                                    Price = (double)price
                                }, currency.Id);
                            }
                            else
                            {
                                Console.WriteLine($"Erro ao converter o preço de {binanceSymbol}.");
                            }
                        }
                        else
                        {
                            Console.WriteLine($"Moeda '{binanceSymbol}' não encontrada na Binance (status {response.StatusCode}). Nenhum histórico criado.");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Erro ao processar {currency.Name}: {ex.Message}");
                    }
                }
            }

            await Task.Delay(TimeSpan.FromSeconds(IntervalSeconds), stoppingToken);
        }

        Console.WriteLine("Serviço de consulta de criptomoedas finalizado.");
    }
}