public interface IHistoryRepository
{
    void Add(History history);
    History? GetById(int id);
    List<History>? GetAll();
    void Update(History history);
    void Delete(int id);


}