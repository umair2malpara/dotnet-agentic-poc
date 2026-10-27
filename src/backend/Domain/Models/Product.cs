namespace DotnetAgenticPoc.Domain.Models;

public sealed class Product
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public decimal Price { get; set; }
}