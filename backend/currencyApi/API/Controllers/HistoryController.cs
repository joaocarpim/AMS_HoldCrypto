using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class HistoryController : ControllerBase
{
    private readonly IHistoryService _historyService;

    public HistoryController(IHistoryService historyService)
    {
        _historyService = historyService;
    }

     [HttpPost]
    public IActionResult RegisterHistory(HistoryDTO historyDto)
    {
        var result = _historyService.RegisterHistory(historyDto);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public IActionResult GetHistoryDetails(int id)
    {
        var history = _historyService.GetHistoryDetails(id);
        return history != null ? Ok(history) : NotFound();
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAllHistorys()
    {
        var historys = _historyService.GetAllHistory();
        return Ok(historys);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateHistory(int id, HistoryDTO historyDto)
    {
        var updatedHistory = _historyService.UpdateHistory(id, historyDto);
        return updatedHistory != null ? Ok(updatedHistory) : NotFound();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteHistory(int id)
    {
        var result = _historyService.DeleteHistory(id);
        return result ? NoContent() : NotFound();
    }
}