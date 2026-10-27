using DotnetAgenticPoc.Application.Abstractions.Repositories;
using DotnetAgenticPoc.Domain.Models;

namespace DotnetAgenticPoc.Application.Services;

public sealed class ProductService(
    IProductRepository productRepository) : IProductService
{
    public Task<IReadOnlyCollection<Product>> GetAllAsync(
        CancellationToken cancellationToken) =>
        productRepository.GetAllAsync(cancellationToken);

    public Task<Product?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken) =>
        productRepository.GetByIdAsync(id, cancellationToken);

    public Task<Product> CreateAsync(
        Product product,
        CancellationToken cancellationToken)
    {
        product.Id = Guid.NewGuid();
        return productRepository.AddAsync(product, cancellationToken);
    }

    public Task<bool> UpdateAsync(
        Product product,
        CancellationToken cancellationToken) =>
        productRepository.UpdateAsync(product, cancellationToken);

    public Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken) =>
        productRepository.DeleteAsync(id, cancellationToken);
}