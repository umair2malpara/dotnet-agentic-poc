using DotnetAgenticPoc.Api;
using DotnetAgenticPoc.Api.Repositories;

namespace DotnetAgenticPoc.Api.Services;

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