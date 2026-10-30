using System.Text.Json;
using DotnetAgenticPoc.Api.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace DotnetAgenticPoc.Api.Tests.Middleware;

public sealed class ApiExceptionHandlerTests
{
    [Fact]
    public async Task TryHandleAsync_ReturnsSafeProblemDetailsWithCorrelationId()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddProblemDetails();
        using var provider = services.BuildServiceProvider();
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();
        context.Request.Path = "/api/customers";
        context.Items[CorrelationIdMiddleware.HttpContextItemKey] = "correlation-123";
        var handler = new ApiExceptionHandler(
            NullLogger<ApiExceptionHandler>.Instance,
            provider.GetRequiredService<IProblemDetailsService>());

        var handled = await handler.TryHandleAsync(
            context,
            new InvalidOperationException("sensitive exception detail"),
            CancellationToken.None);

        Assert.True(handled);
        Assert.Equal(StatusCodes.Status500InternalServerError, context.Response.StatusCode);
        Assert.Equal("application/problem+json", context.Response.ContentType);

        context.Response.Body.Position = 0;
        using var document = await JsonDocument.ParseAsync(context.Response.Body);
        var problem = document.RootElement;
        Assert.Equal(StatusCodes.Status500InternalServerError, problem.GetProperty("status").GetInt32());
        Assert.Equal("An unexpected error occurred.", problem.GetProperty("title").GetString());
        Assert.Equal("The request could not be completed.", problem.GetProperty("detail").GetString());
        Assert.Equal("correlation-123", problem.GetProperty("correlationId").GetString());
        Assert.DoesNotContain("sensitive exception detail", problem.GetRawText());
    }
}
