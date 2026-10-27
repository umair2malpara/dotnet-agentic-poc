using DotnetAgenticPoc.Domain.Models;

namespace DotnetAgenticPoc.Application.Services;

public interface IProductService
{
    Task<IReadOnlyCollection<Product>> GetAllAsync(CancellationToken cancellationToken);

    Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<Product> CreateAsync(Product product, CancellationToken cancellationToken);

    Task<bool> UpdateAsync(Product product, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}