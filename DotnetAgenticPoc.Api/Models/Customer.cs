namespace DotnetAgenticPoc.Api.Models;

public sealed class Customer
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }
}