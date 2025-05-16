public class CurrencyService : ICurrencyService
{
    private readonly ICurrencyRepository _currencyRepository;

    public CurrencyService(ICurrencyRepository CurrencyRepository)
    {
        _currencyRepository = CurrencyRepository;
    }

     public CurrencyDTO RegisterCurrency(CurrencyDTO currencyDto)
    {

        var currency = new Currency 
        {
            Name = currencyDto.Name, 
            Description = currencyDto.Description, 
            Status = currencyDto.Status,
            Backing = currencyDto.Backing,
        };
        _currencyRepository.Add(currency);

        return new CurrencyDTO
        {
            Name = currency.Name,
            Description = currency.Description,
            Status = currency.Status,
            Backing = currency.Backing,
            
        };
    }

    public CurrencyDTO? GetCurrencyDetails(int id)
    {
        var currency = _currencyRepository.GetById(id);
        return currency != null ? new CurrencyDTO 
        { 
            Id = currency.Id,
            Name = currency.Name, 
            Description = currency.Description,
            Status = currency.Status,
            Backing = currency.Backing,
        
        } : null;
    }

    public List<CurrencyDTO> GetAllCurrency()
    {
        return _currencyRepository.GetAll().Select(currency => new CurrencyDTO
        {
            Id = currency.Id,
            Name = currency.Name,
            Description = currency.Description,
            Status = currency.Status,
            Backing = currency.Backing,
            
        }).ToList();
    }

    public CurrencyDTO? UpdateCurrency(int id, CurrencyDTO currencyDto)
    {
        var currency = _currencyRepository.GetById(id);
        if (currency == null) return null;
        
        currency.Name = currencyDto.Name;
        currency.Description = currencyDto.Description;
        currency.Status = currencyDto.Status;
        currency.Backing = currencyDto.Backing;
        
        _currencyRepository.Update(currency);
        
        return new CurrencyDTO
        {
            Name = currency.Name,
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