using System.Collections.Concurrent;
using DotnetAgenticPoc.Api.Models;

namespace DotnetAgenticPoc.Api.Repositories;

public sealed class InMemoryProductRepository : IProductRepository
{
    private readonly ConcurrentDictionary<Guid, Product> products = new();

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