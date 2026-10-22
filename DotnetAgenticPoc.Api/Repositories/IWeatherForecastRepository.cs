using DotnetAgenticPoc.Api;

namespace DotnetAgenticPoc.Api.Repositories;

public interface IWeatherForecastRepository
{
    Task<IReadOnlyCollection<WeatherForecast>> GetAsync(
        int count,
        CancellationToken cancellationToken);
}