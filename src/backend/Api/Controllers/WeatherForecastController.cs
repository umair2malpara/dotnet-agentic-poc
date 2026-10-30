using DotnetAgenticPoc.Api.Contracts;
using DotnetAgenticPoc.Application.Services;
using DotnetAgenticPoc.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace DotnetAgenticPoc.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class WeatherForecastController(
    IWeatherForecastService weatherForecastService)
    : ControllerBase
{
    [HttpGet(Name = "GetWeatherForecast")]
    public async Task<ActionResult<ApiResponse<IReadOnlyCollection<WeatherForecast>>>> Get(
        [FromQuery] int count = 5,
        CancellationToken cancellationToken = default)
    {
        var forecasts = await weatherForecastService.GetAsync(
            count,
            cancellationToken);

        return Ok(ApiResponse<IReadOnlyCollection<WeatherForecast>>.Success(forecasts));
    }
}
