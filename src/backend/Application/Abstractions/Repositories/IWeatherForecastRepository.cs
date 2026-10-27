using DotnetAgenticPoc.Domain.Models;

namespace DotnetAgenticPoc.Application.Abstractions.Repositories;

public interface IWeatherForecastRepository
{
    Task<IReadOnlyCollection<WeatherForecast>> GetAsync(
        int count,
        CancellationToken cancellationToken);
}