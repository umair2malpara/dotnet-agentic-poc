using DotnetAgenticPoc.Application.Abstractions.Repositories;
using DotnetAgenticPoc.Domain.Models;

namespace DotnetAgenticPoc.Application.Services;

public sealed class WeatherForecastService(
    IWeatherForecastRepository weatherForecastRepository)
    : IWeatherForecastService
{
    public Task<IReadOnlyCollection<WeatherForecast>> GetAsync(
        int count,
        CancellationToken cancellationToken)
    {
        var forecastCount = Math.Clamp(count, 1, 30);

        return weatherForecastRepository.GetAsync(
            forecastCount,
            cancellationToken);
    }
}