public interface IHistoryService{

    HistoryDTO RegisterHistory(HistoryDTO historyDto);

    List<HistoryDTO> GetAllHistory();
    
    HistoryDTO? GetHistoryDetails(int id);

    bool DeleteHistory(int id);

    HistoryDTO UpdateHistory(int id, HistoryDTO historyDto);

}