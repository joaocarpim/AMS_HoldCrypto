public interface ICurrencyService{

    CurrencyDTO RegisterCurrency(CurrencyDTO currencyDto);

    List<CurrencyDTO> GetAllCurrency();
    
    CurrencyDTO? GetCurrencyDetails(int id);

    bool DeleteCurrency(int id);

    CurrencyDTO UpdateCurrency(int id, CurrencyDTO currencyDto);

}