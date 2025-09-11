public interface ICurrencyRepository
{
    void Add(Currency currency);
    Currency? GetById(int id);
    List<Currency>? GetAll();
    void Update(Currency currency);
    void Delete(int id);


}