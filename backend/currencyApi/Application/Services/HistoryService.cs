public class HistoryService : IHistoryService
{
    private readonly IHistoryRepository _historyRepository;

    public HistoryService(IHistoryRepository historyRepository)
    {
        _historyRepository = historyRepository;
    }

    public HistoryDTO RegisterHistory(HistoryDTO historyDto)
    {
        var history = new History
        {
            Datetime = historyDto.Datetime,
            Price = historyDto.Price,
            CurrencyId = historyDto.CurrencyId,
        };

        _historyRepository.Add(history);

        return new HistoryDTO
        {
            Id = history.Id,
            Datetime = history.Datetime,
            Price = history.Price,
            CurrencyId = history.CurrencyId,
            Currency = history.Currency
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
            Currency = history.Currency
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
            Currency = history.Currency
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
            Currency = history.Currency
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
