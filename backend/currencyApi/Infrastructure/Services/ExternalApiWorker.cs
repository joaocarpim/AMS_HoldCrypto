// Caminho: backend/currencyApi/Infrastructure/Services/ExternalApiWorker.cs
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Text.Json; // Adicionado para JsonDocument
using System.Globalization; // <-- ADICIONADO (IMPORTANTE)

public class ExternalApiWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IHttpClientFactory _httpClientFactory;
    private const int IntervalSeconds = 30; 
    private const string _cryptoPricesUrl = "https://api.binance.com/api/v3/ticker/price";

    public ExternalApiWorker(IServiceProvider serviceProvider, IHttpClientFactory httpClientFactory)
    {
        _serviceProvider = serviceProvider;
        _httpClientFactory = httpClientFactory;
    }

    private string GetBinanceSymbol(string symbol, string backing)
    {
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

                var allCurrencies = currencyService.GetAllCurrency()
                    .Where(c => c.Status)
                    .ToList();

                foreach (var currency in allCurrencies)
                {
                    // Ignora BRL (lógica que adicionámos antes)
                    if (currency.Symbol.Equals(currency.Backing.ToString(), StringComparison.OrdinalIgnoreCase))
                    {
                        Console.WriteLine($"[{DateTime.Now}] Ignorando {currency.Symbol} (Moeda Fiat Base).");
                        continue; 
                    }

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

                            // ****** CORREÇÃO DA CONVERSÃO ******
                            // Usar decimal.TryParse com CultureInfo.InvariantCulture
                            // Isto garante que "60000.12" (com PONTO) seja lido corretamente.
                            if (decimal.TryParse(priceStr, NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out decimal price))
                            {
                                // O log agora deve mostrar o preço real (ex: 60000.12)
                                Console.WriteLine($"[{DateTime.Now}] {binanceSymbol}: {price}"); 
                                
                                historyService.RegisterHistory(new HistoryDTO
                                {
                                    Datetime = DateTime.UtcNow,
                                    Price = price // Salva o decimal correto (não (double)price)
                                }, currency.Id);
                            }
                            // ************************************
                            else
                            {
                                Console.WriteLine($"Erro ao converter o preço (decimal) de {binanceSymbol}. String recebida: {priceStr}");
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