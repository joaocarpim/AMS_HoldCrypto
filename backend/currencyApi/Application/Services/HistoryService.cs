public class HistoryService : IHistoryService
{
    private readonly IHistoryRepository _historyRepository;
    private readonly ICurrencyService _currencyService;

    public HistoryService(IHistoryRepository historyRepository, ICurrencyService currencyService)
    {
        _historyRepository = historyRepository;
        _currencyService = currencyService;
    }

    public HistoryDTO RegisterHistory(HistoryDTO historyDto, int currencyId)
    {
        var currency = _currencyService.GetCurrencyById(currencyId);

        var history = new History
        {
            Datetime = historyDto.Datetime,
            Price = historyDto.Price,
            CurrencyId = currency.Id,
            Currency = currency
        };

        _historyRepository.Add(history);

        return new HistoryDTO
        {
            Id = history.Id,
            Datetime = history.Datetime,
            Price = history.Price,
            CurrencyId = history.CurrencyId,
           
        };
    }

    public HistoryDTO? GetHistoryDetails(int id)
    {
        var history = _historyRepository.GetById(id);
        return history != null ? new HistoryDTO
        {
            Id = history.Id,
            Datetime = history.Datetime,
            Price = history.Price,
            CurrencyId = history.CurrencyId,
            
        } : null;
    }

    public List<HistoryDTO> GetAllHistory()
    {
        return _historyRepository.GetAll().Select(history => new HistoryDTO
        {
            Id = history.Id,
            Datetime = history.Datetime,
            Price = history.Price,
            CurrencyId = history.CurrencyId,
            
        }).ToList();
    }

    public HistoryDTO? UpdateHistory(int id, HistoryDTO historyDto)
    {
        var history = _historyRepository.GetById(id);
        if (history == null) return null;

        history.Datetime = historyDto.Datetime;
        history.Price = historyDto.Price;
        history.CurrencyId = historyDto.CurrencyId;

        _historyRepository.Update(history);

        return new HistoryDTO
        {
            Id = history.Id,
            Datetime = history.Datetime,
            Price = history.Price,
            CurrencyId = history.CurrencyId,
            
        };
    }

    public bool DeleteHistory(int id)
    {
        var history = _historyRepository.GetById(id);
        if (history == null) return false;
        _historyRepository.Delete(id);
        return true;
    }
}
