using DotnetAgenticPoc.Api.Middleware;
using DotnetAgenticPoc.Api.Repositories;
using DotnetAgenticPoc.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddOpenApi();

const string frontendCorsPolicy = "Frontend";
const string frontendDevelopmentOrigin = "http://localhost:4200";
var configuredCorsOrigins = builder.Environment.IsDevelopment()
    ? [frontendDevelopmentOrigin]
    : builder.Configuration
        .GetSection("Cors:AllowedOrigins")
        .Get<string[]>() ?? [];

if (!builder.Environment.IsDevelopment() && configuredCorsOrigins.Length == 0)
{
    throw new InvalidOperationException(
        "Configure at least one allowed origin in Cors:AllowedOrigins outside Development.");
}

var corsOrigins = configuredCorsOrigins
    .Select(ValidateCorsOrigin)
    .ToArray();

builder.Services.AddCors(options =>
{
    options.AddPolicy(frontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .WithMethods(HttpMethods.Get);
    });
});

builder.Logging.AddSimpleConsole(options =>
{
    options.IncludeScopes = true;
});

builder.Services.AddSingleton<ICustomerRepository, InMemoryCustomerRepository>();
builder.Services.AddSingleton<IProductRepository, InMemoryProductRepository>();
builder.Services.AddSingleton<IWeatherForecastRepository, WeatherForecastRepository>();

builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IWeatherForecastService, WeatherForecastService>();

var app = builder.Build();

app.UseMiddleware<CorrelationIdMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors(frontendCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();

static string ValidateCorsOrigin(string origin)
{
    if (Uri.TryCreate(origin, UriKind.Absolute, out var uri) &&
        (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps) &&
        string.Equals(
            origin,
            uri.GetLeftPart(UriPartial.Authority),
            StringComparison.OrdinalIgnoreCase))
    {
        return origin;
    }

    throw new InvalidOperationException(
        $"'{origin}' is not a valid HTTP or HTTPS origin in Cors:AllowedOrigins.");
}
