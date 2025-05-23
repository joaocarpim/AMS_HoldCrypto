public interface IHistoryService{

    HistoryDTO RegisterHistory(HistoryDTO historyDto, int currencyId);

    List<HistoryDTO> GetAllHistory();
    
    HistoryDTO? GetHistoryDetails(int id);

    bool DeleteHistory(int id);

    HistoryDTO UpdateHistory(int id, HistoryDTO historyDto);

}