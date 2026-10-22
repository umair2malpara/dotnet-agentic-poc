using DotnetAgenticPoc.Api.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace DotnetAgenticPoc.Api.Tests.Middleware;

public sealed class CorrelationIdMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_AddsCorrelationIdToResponseHeader()
    {
        var context = new DefaultHttpContext();
        var middleware = CreateMiddleware();

        await middleware.InvokeAsync(context);

        var correlationId = context.Response.Headers[
            CorrelationIdMiddleware.HeaderName].ToString();

        Assert.False(string.IsNullOrWhiteSpace(correlationId));
        Assert.True(Guid.TryParseExact(correlationId, "N", out _));
    }

    [Fact]
    public async Task InvokeAsync_StoresCorrelationIdInHttpContextItems()
    {
        var context = new DefaultHttpContext();
        var middleware = CreateMiddleware();

        await middleware.InvokeAsync(context);

        var responseCorrelationId = context.Response.Headers[
            CorrelationIdMiddleware.HeaderName].ToString();
        var itemCorrelationId = context.Items[
            CorrelationIdMiddleware.HttpContextItemKey]?.ToString();

        Assert.Equal(responseCorrelationId, itemCorrelationId);
    }

    [Fact]
    public async Task InvokeAsync_GeneratesDifferentIdsForDifferentRequests()
    {
        var firstContext = new DefaultHttpContext();
        var secondContext = new DefaultHttpContext();
        var middleware = CreateMiddleware();

        await middleware.InvokeAsync(firstContext);
        await middleware.InvokeAsync(secondContext);

        var firstId = firstContext.Response.Headers[
            CorrelationIdMiddleware.HeaderName].ToString();
        var secondId = secondContext.Response.Headers[
            CorrelationIdMiddleware.HeaderName].ToString();

        Assert.NotEqual(firstId, secondId);
    }

    [Fact]
    public async Task InvokeAsync_PreservesDownstreamResponse()
    {
        var context = new DefaultHttpContext();
        var middleware = new CorrelationIdMiddleware(
            httpContext =>
            {
                httpContext.Response.StatusCode = StatusCodes.Status202Accepted;
                return Task.CompletedTask;
            },
            NullLogger<CorrelationIdMiddleware>.Instance);

        await middleware.InvokeAsync(context);

        Assert.Equal(StatusCodes.Status202Accepted, context.Response.StatusCode);
    }

    private static CorrelationIdMiddleware CreateMiddleware() =>
        new(_ => Task.CompletedTask,
            NullLogger<CorrelationIdMiddleware>.Instance);
}
