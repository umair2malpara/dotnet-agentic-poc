using System.Diagnostics;

namespace DotnetAgenticPoc.Api.Middleware;

public sealed class CorrelationIdMiddleware(
    RequestDelegate next,
    ILogger<CorrelationIdMiddleware> logger)
{
    public const string HeaderName = "X-Correlation-Id";
    public const string HttpContextItemKey = "DotnetAgenticPoc.CorrelationId";

    public async Task InvokeAsync(HttpContext httpContext)
    {
        var correlationId = Guid.NewGuid().ToString("N");

        httpContext.Items[HttpContextItemKey] = correlationId;
        httpContext.Response.Headers[HeaderName] = correlationId;

        using var loggingScope = logger.BeginScope(
            new Dictionary<string, object>
            {
                ["CorrelationId"] = correlationId
            });

        var stopwatch = Stopwatch.StartNew();

        logger.LogInformation(
            "Request started: {HttpMethod} {RequestPath}",
            httpContext.Request.Method,
            httpContext.Request.Path);

        try
        {
            await next(httpContext);
        }
        finally
        {
            stopwatch.Stop();

            logger.LogInformation(
                "Request completed: {HttpMethod} {RequestPath} {StatusCode} in {ElapsedMilliseconds} ms",
                httpContext.Request.Method,
                httpContext.Request.Path,
                httpContext.Response.StatusCode,
                stopwatch.ElapsedMilliseconds);
        }
    }
}
