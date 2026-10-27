using DotnetAgenticPoc.Domain.Models;

namespace DotnetAgenticPoc.Application.Abstractions.Repositories;

public interface IProductRepository
{
    Task<IReadOnlyCollection<Product>> GetAllAsync(CancellationToken cancellationToken);

    Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<Product> AddAsync(Product product, CancellationToken cancellationToken);

    Task<bool> UpdateAsync(Product product, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}