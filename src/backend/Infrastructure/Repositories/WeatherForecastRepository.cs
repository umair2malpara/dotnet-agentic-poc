using DotnetAgenticPoc.Application.Abstractions.Repositories;
using DotnetAgenticPoc.Domain.Models;

namespace DotnetAgenticPoc.Infrastructure.Repositories;

public sealed class WeatherForecastRepository : IWeatherForecastRepository
{
    private static readonly string[] Summaries =
    [
        "Freezing",
        "Bracing",
        "Chilly",
        "Cool",
        "Mild",
        "Warm",
        "Balmy",
        "Hot",
        "Sweltering",
        "Scorching"
    ];

    public Task<IReadOnlyCollection<WeatherForecast>> GetAsync(
        int count,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var forecasts = Enumerable.Range(1, count)
            .Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();

        IReadOnlyCollection<WeatherForecast> result = forecasts;
        return Task.FromResult(result);
    }
}