using DotnetAgenticPoc.Api;

namespace DotnetAgenticPoc.Api.Services;

public interface IWeatherForecastService
{
    Task<IReadOnlyCollection<WeatherForecast>> GetAsync(
        int count,
        CancellationToken cancellationToken);
}