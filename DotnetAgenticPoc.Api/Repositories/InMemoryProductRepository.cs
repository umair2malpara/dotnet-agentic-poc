using System.Collections.Concurrent;
using DotnetAgenticPoc.Api.Models;

namespace DotnetAgenticPoc.Api.Repositories;

public sealed class InMemoryProductRepository : IProductRepository
{
    private readonly ConcurrentDictionary<Guid, Product> products = new(
        new Dictionary<Guid, Product>
        {
            [Guid.Parse("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa")] = new()
            {
                Id = Guid.Parse("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"),
                Name = "Starter Kit",
                Price = 24.99m
            },
            [Guid.Parse("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb")] = new()
            {
                Id = Guid.Parse("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb"),
                Name = "Field Notebook",
                Price = 8.50m
            },
            [Guid.Parse("cccccccc-cccc-4ccc-8ccc-cccccccccccc")] = new()
            {
                Id = Guid.Parse("cccccccc-cccc-4ccc-8ccc-cccccccccccc"),
                Name = "Desk Lamp",
                Price = 42.00m
            }
        });

    public Task<IReadOnlyCollection<Product>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        IReadOnlyCollection<Product> result = products.Values.ToList();
        return Task.FromResult(result);
    }

    public Task<Product?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        products.TryGetValue(id, out var product);
        return Task.FromResult(product);
    }

    public Task<Product> AddAsync(
        Product product,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        products[product.Id] = product;
        return Task.FromResult(product);
    }

    public Task<bool> UpdateAsync(
        Product product,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (!products.ContainsKey(product.Id))
        {
            return Task.FromResult(false);
        }

        products[product.Id] = product;
        return Task.FromResult(true);
    }

    public Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        return Task.FromResult(products.TryRemove(id, out _));
    }
}