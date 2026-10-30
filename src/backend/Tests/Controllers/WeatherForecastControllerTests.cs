using DotnetAgenticPoc.Api.Contracts;
using DotnetAgenticPoc.Api.Controllers;
using DotnetAgenticPoc.Application.Services;
using DotnetAgenticPoc.Domain.Models;
using DotnetAgenticPoc.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace DotnetAgenticPoc.Api.Tests.Controllers;

public sealed class WeatherForecastControllerTests
{
    [Fact]
    public async Task Get_ReturnsForecastsInSuccessEnvelope()
    {
        var controller = new WeatherForecastController(
            new WeatherForecastService(new WeatherForecastRepository()));

        var result = await controller.Get(5, CancellationToken.None);
        var success = Assert.IsType<OkObjectResult>(result.Result);

        Assert.Equal(
            5,
            Assert.IsType<ApiResponse<IReadOnlyCollection<WeatherForecast>>>(
                success.Value).Data!.Count);
    }
}
