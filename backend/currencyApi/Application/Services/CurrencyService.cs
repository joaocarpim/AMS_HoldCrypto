public class CurrencyService : ICurrencyService
{
    private readonly ICurrencyRepository _currencyRepository;

    public CurrencyService(ICurrencyRepository currencyRepository)
    {
        _currencyRepository = currencyRepository;
    }

    public CurrencyDTO RegisterCurrency(CurrencyDTO currencyDto)
    {
        var currency = new Currency
        {
            Name = currencyDto.Name,
            Symbol = currencyDto.Symbol,
            Description = currencyDto.Description,
            Status = currencyDto.Status,
            Backing = currencyDto.Backing,
        };
        _currencyRepository.Add(currency);

        return new CurrencyDTO
        {
            Id = currency.Id,
            Name = currency.Name,
            Symbol = currency.Symbol,
            Description = currency.Description,
            Status = currency.Status,
            Backing = currency.Backing,
        };
    }

    public Currency? GetCurrencyById(int id)
    {
        return _currencyRepository.GetById(id);
    }

    public CurrencyDTO? GetCurrencyDetails(int id)
    {
        var currency = _currencyRepository.GetById(id);

        var dto = new CurrencyDTO
        {
            Id = currency.Id,
            Name = currency.Name,
            Symbol = currency.Symbol,
            Description = currency.Description,
            Status = currency.Status,
            Backing = currency.Backing,
            Histories = new List<HistoryDTO>()
        };

        if (currency.Histories != null && currency.Histories.Any())
        {
            foreach (var history in currency.Histories)
            {
                dto.Histories.Add(new HistoryDTO
                {
                    Id = history.Id,
                    Datetime = history.Datetime,
                    Price = history.Price,
                    CurrencyId = history.CurrencyId
                });
            }
        }
        return dto;
    }

    public List<CurrencyDTO> GetAllCurrency()
    {
        var currencies = _currencyRepository.GetAll();

        var result = new List<CurrencyDTO>();

        foreach (var currency in currencies)
        {
            var currencyDto = new CurrencyDTO
            {
                Id = currency.Id,
                Name = currency.Name,
                Symbol = currency.Symbol,
                Description = currency.Description,
                Status = currency.Status,
                Backing = currency.Backing,
                Histories = currency.Histories != null
                    ? currency.Histories
                        .Select(h => new HistoryDTO
                        {
                            Id = h.Id,
                            Datetime = h.Datetime,
                            Price = h.Price,
                            CurrencyId = h.CurrencyId
                        }).ToList()
                    : new List<HistoryDTO>()
            };
            result.Add(currencyDto);
        }
        return result;
    }

    public CurrencyDTO? UpdateCurrency(int id, CurrencyDTO currencyDto)
    {
        var currency = _currencyRepository.GetById(id);
        if (currency == null) return null;

        currency.Name = currencyDto.Name;
        currency.Symbol = currencyDto.Symbol;
        currency.Description = currencyDto.Description;
        currency.Status = currencyDto.Status;
        currency.Backing = currencyDto.Backing;

        _currencyRepository.Update(currency);

        return new CurrencyDTO
        {
            Id = currency.Id,
            Name = currency.Name,
            Symbol = currency.Symbol,
            Description = currency.Description,
            Status = currency.Status,
            Backing = currency.Backing,
        };
    }

    public bool DeleteCurrency(int id)
    {
        var currency = _currencyRepository.GetById(id);
        if (currency == null) return false;
        _currencyRepository.Delete(id);
        return true;
    }
}