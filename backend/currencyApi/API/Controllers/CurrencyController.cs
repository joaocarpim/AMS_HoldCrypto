using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class CurrencyController : ControllerBase
{
    private readonly ICurrencyService _currencyService;

    public CurrencyController(ICurrencyService currencyService)
    {
        _currencyService = currencyService;
    }

     [HttpPost]
    public IActionResult RegisterCurrency(CurrencyDTO currencyDto)
    {
        var result = _currencyService.RegisterCurrency(currencyDto);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public IActionResult GetCurrencyDetails(int id)
    {
        var currency = _currencyService.GetCurrencyDetails(id);
        return currency != null ? Ok(currency) : NotFound();
    }

    [HttpGet]
    public IActionResult GetAllCurrencys()
    {
        var currencys = _currencyService.GetAllCurrency();
        return Ok(currencys);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateCurrency(int id, CurrencyDTO currencyDto)
    {
        var updatedCurrency = _currencyService.UpdateCurrency(id, currencyDto);
        return updatedCurrency != null ? Ok(updatedCurrency) : NotFound();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteCurrency(int id)
    {
        var result = _currencyService.DeleteCurrency(id);
        return result ? NoContent() : NotFound();
    }
}