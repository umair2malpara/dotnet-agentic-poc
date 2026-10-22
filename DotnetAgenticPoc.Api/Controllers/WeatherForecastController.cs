using DotnetAgenticPoc.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace DotnetAgenticPoc.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class WeatherForecastController(
    IWeatherForecastService weatherForecastService)
    : ControllerBase
{
    [HttpGet(Name = "GetWeatherForecast")]
    public async Task<ActionResult<IReadOnlyCollection<WeatherForecast>>> Get(
        [FromQuery] int count = 5,
        CancellationToken cancellationToken = default)
    {
        var forecasts = await weatherForecastService.GetAsync(
            count,
            cancellationToken);

        return Ok(forecasts);
    }
}
