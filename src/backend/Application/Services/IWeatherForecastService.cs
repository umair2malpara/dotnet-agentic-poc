using DotnetAgenticPoc.Domain.Models;

namespace DotnetAgenticPoc.Application.Services;

public interface IWeatherForecastService
{
    Task<IReadOnlyCollection<WeatherForecast>> GetAsync(
        int count,
        CancellationToken cancellationToken);
}